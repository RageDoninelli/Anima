/* Alfa 0.4 — mesa de juego. Seguimiento manual, no simulador de reglas oficiales. */
'use strict';
state.fighters??=[];state.round??=1;state.battleNotes??='';
let fighterCounter=0;
function redrawTabletop(){
 $('roundStatus').textContent='Asalto '+state.round+' · '+state.fighters.length+' participantes';
 $('battleNotes').value=state.battleNotes||'';
 const list=$('fighters');list.replaceChildren();
 state.fighters.forEach((f,i)=>{
  const li=document.createElement('li');li.className='fighter';
  const head=document.createElement('strong');head.textContent=f.name+' · Iniciativa '+f.initiative;li.append(head);
  const controls=document.createElement('div');controls.className='actions';
  const value=document.createElement('span');value.textContent='Vitalidad '+f.hp+' / '+f.max;controls.append(value);
  for(const [label,delta] of [['−10',-10],['−1',-1],['+1',1],['+10',10]]){
   const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-label',label+' vitalidad de '+f.name);
   b.onclick=()=>{f.hp=Math.max(0,Math.min(f.max,f.hp+delta));redrawTabletop();persist()};controls.append(b)
  }
  const remove=document.createElement('button');remove.textContent='Quitar';remove.className='subtle';remove.onclick=()=>{state.fighters.splice(i,1);redrawTabletop();persist()};controls.append(remove);
  li.append(controls);list.append(li);
 });
}
$('addFighter').onclick=()=>{
 const name=$('fighterName').value.trim();if(!name)return alert('Escribe el nombre del participante.');
 if(state.fighters.length>=30)return alert('Máximo 30 participantes.');
 const max=bounded($('fighterMax').value,1,99999,100);
 state.fighters.push({id:Date.now()+'-'+(++fighterCounter),name:name.slice(0,55),initiative:bounded($('fighterInit').value,-999,999,0),hp:Math.min(max,bounded($('fighterHp').value,0,99999,max)),max});
 $('fighterName').value='';redrawTabletop();persist();
};
$('sortFighters').onclick=()=>{state.fighters.sort((a,b)=>b.initiative-a.initiative);redrawTabletop();persist()};
$('nextRound').onclick=()=>{state.round=Math.min(9999,state.round+1);redrawTabletop();persist()};
$('saveBattle').onclick=()=>{state.battleNotes=$('battleNotes').value.slice(0,4000);persist();$('roundStatus').textContent+=' · Notas guardadas'};
$('clearFighters').onclick=()=>{if(!confirm('¿Terminar encuentro y borrar participantes y notas de combate?'))return;state.fighters=[];state.round=1;state.battleNotes='';redrawTabletop();persist()};
$('battleNotes').addEventListener('change',()=>{state.battleNotes=$('battleNotes').value.slice(0,4000);persist()});
redrawTabletop();
