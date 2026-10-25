/* Alfa 0.2: extensiones de campaña. No modifican las reglas del dado del prototipo. */
const vaultKey='anima_gaia_vault_v2';
const getVault=()=>{try{const v=JSON.parse(localStorage.getItem(vaultKey)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}};
function storeVault(v){localStorage.setItem(vaultKey,JSON.stringify(v))}
function records(v){return Array.isArray(v)?v.slice(0,60).filter(x=>x&&typeof x==='object').map(x=>({name:String(x.name||'').slice(0,70),note:String(x.note||'').slice(0,500)})).filter(x=>x.name):[]}
function safeState(v){
 if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Formato de partida inválido');
 const values=v.values===null||v.values===undefined?null:v.values;
 if(values!==null&&(!Array.isArray(values)||values.length!==8||values.some(x=>!Number.isInteger(x)||x<1||x>20)))throw Error('Características inválidas');
 const scene=Number(v.scene??-1);
 if(!Number.isInteger(scene)||scene < -1||scene>=scenes.length)throw Error('Escena desconocida');
 const arr=(x,max)=>Array.isArray(x)?x.slice(0,max).filter(y=>typeof y==='string').map(y=>y.slice(0,120)):[];
 return {name:String(v.name||'').slice(0,40),concept:String(v.concept||'Viajero errante').slice(0,60),category:String(v.category||'Guerrero').slice(0,60),values:values?values.slice():null,scene,log:Array.isArray(v.log)?v.log.slice(-70).filter(x=>x&&typeof x.text==='string').map(x=>({text:x.text.slice(0,900),system:!!x.system})):[],journal:String(v.journal||'').slice(0,15000),inventory:arr(v.inventory,80),quests:arr(v.quests,80),completed:Array.isArray(v.completed)?v.completed.slice(0,80).map(Boolean):[],npcs:records(v.npcs),places:records(v.places)};
}
function redrawExtra(){
 $('category').value=Array.from($('category').options).some(o=>o.value===state.category)?state.category:'Guerrero';
 for(const [id,field] of [['inventory','inventory'],['quests','quests']]){
  const ul=$(id);ul.replaceChildren();(state[field]||[]).forEach((name,i)=>{
   const li=document.createElement('li');if(id==='quests'&&state.completed?.[i])li.className='done';
   const span=document.createElement('span');span.textContent=name;li.append(span);
   if(id==='quests'){const done=document.createElement('button');done.textContent=state.completed?.[i]?'Reabrir':'Completar';done.onclick=()=>{state.completed[i]=!state.completed[i];redrawExtra();if(typeof redrawWorldbook==='function')redrawWorldbook();persist()};li.append(done)}
   const remove=document.createElement('button');remove.textContent='Quitar';remove.setAttribute('aria-label','Quitar '+name);remove.onclick=()=>{state[field].splice(i,1);if(field==='quests')state.completed.splice(i,1);redrawExtra();if(typeof redrawWorldbook==='function')redrawWorldbook();persist()};li.append(remove);ul.append(li)
  });
 }
}
function applyState(v){state={...state,...safeState(v)};$('name').value=state.name;$('concept').value=state.concept;$('journal').value=state.journal;renderStats();renderLog();if(state.scene>=0){$('chapter').textContent=scenes[state.scene].title;renderChoices()}else{$('chapter').textContent='Prólogo';$('choices').replaceChildren()}redrawExtra();if(typeof redrawWorldbook==='function')redrawWorldbook();persist()}
function refreshSlots(){const sel=$('slot'),current=sel.value;sel.replaceChildren();const names=Object.keys(getVault()).sort();for(const name of names){const o=document.createElement('option');o.value=name;o.textContent=name;sel.append(o)}if(names.includes(current))sel.value=current;else if(!names.length){const o=document.createElement('option');o.textContent='Sin partidas archivadas';o.value='';sel.append(o)}}
$('category').onchange=()=>{state.category=$('category').value;persist()};
$('saveSlot').onclick=()=>{persist();const label=prompt('Nombre de la partida en el archivo:',state.name||'Mi aventura');if(label===null)return;const name=label.trim().slice(0,70);if(!name)return;const v=getVault();if(v[name]&&!confirm('¿Sobrescribir la partida «'+name+'»?'))return;v[name]=safeState(state);storeVault(v);refreshSlots();$('slot').value=name;$('saveState').textContent='Partida archivada: '+name};
$('loadSlot').onclick=()=>{const v=getVault(),name=$('slot').value;if(!v[name])return;if(!confirm('¿Cargar «'+name+'» y sustituir la partida actual?'))return;applyState(v[name]);$('saveState').textContent='Partida cargada: '+name};
$('deleteSlot').onclick=()=>{const name=$('slot').value,v=getVault();if(!v[name]||!confirm('¿Eliminar definitivamente la partida archivada «'+name+'»?'))return;delete v[name];storeVault(v);refreshSlots()};
$('exportSave').onclick=()=>{persist();const blob=new Blob([JSON.stringify({format:'anima-gaia-save',version:2,created:new Date().toISOString(),data:safeState(state)},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='anima-gaia-partida.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)};
$('importSave').onclick=()=>$('importFile').click();
$('importFile').onchange=async()=>{const file=$('importFile').files[0];if(!file)return;try{if(file.size>500000)throw Error('Archivo demasiado grande');const parsed=JSON.parse(await file.text());if(parsed.format!=='anima-gaia-save'||parsed.version!==2)throw Error('Formato o versión no compatibles');const candidate=safeState(parsed.data);if(confirm('¿Importar esta partida y sustituir la partida actual?')){applyState(candidate);$('saveState').textContent='Partida importada correctamente.'}}catch(e){alert('No se pudo importar: '+e.message)}finally{$('importFile').value=''}};
function addEntry(field,id){const input=$(id),name=input.value.trim();if(!name)return;state[field]??=[];if(state[field].length>=80){alert('Máximo 80 elementos');return}state[field].push(name);if(field==='quests'){state.completed??=[];state.completed.push(false)}input.value='';redrawExtra();if(typeof redrawWorldbook==='function')redrawWorldbook();persist()}
$('addItem').onclick=()=>addEntry('inventory','itemName');$('addQuest').onclick=()=>addEntry('quests','questName');
$('oracle').onclick=()=>{const q=$('oracleQuestion').value.trim();if(!q){$('oracleResult').textContent='Escribe una pregunta primero.';return}const chance=Number($('oracleOdds').value),roll=die(100),yes=roll<=chance,twist=roll<=5||roll>=96;const answer=`${yes?'SÍ':'NO'}${twist?' · GIRO INESPERADO':''}\nD100: ${roll} · Probabilidad seleccionada: ${chance}%\nPregunta: ${q}`;$('oracleResult').textContent=answer;addLog('Oráculo narrativo (no oficial): '+answer.replaceAll('\n',' | '),true);persist()};
const promptsA=['Una deuda antigua','Un desconocido herido','Una promesa olvidada','Una carta sin remitente','Un símbolo prohibido','Un aliado que miente','Un objeto desaparecido','Una puerta sellada','Una celebración interrumpida','Una voz en sueños'];
const promptsB=['exige una elección','oculta una traición','revela una pista','despierta una amenaza','abre una negociación','cambia de dueño','rompe una alianza','reclama un sacrificio','anuncia un viaje','pone a prueba tu lealtad'];
$('inspiration').onclick=()=>{const a=die(10),b=die(10);const text=`Inspiración: ${promptsA[a-1]} ${promptsB[b-1]}. (2D10: ${a}, ${b}; creación original)`;$('inspirationResult').textContent=text;addLog(text,true);persist()};
state.category??='Guerrero';state.inventory??=[];state.quests??=[];state.completed??=[];redrawExtra();refreshSlots();
