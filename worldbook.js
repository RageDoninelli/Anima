/* Alfa 0.3 — Atlas de campaña. Contenido narrativo original. */
'use strict';
state.npcs ??= []; state.places ??= [];
function redrawWorldbook(){
 for(const [field,id] of [['npcs','npcs'],['places','places']]){
  const ul=$(id);ul.replaceChildren();
  (state[field]||[]).forEach((entry,i)=>{
   const li=document.createElement('li');li.className='world-entry';
   const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=entry.name;
   const note=document.createElement('p');note.textContent=entry.note||'Sin notas todavía.';
   info.append(strong,note);const del=document.createElement('button');del.className='subtle';del.textContent='Quitar';
   del.onclick=()=>{if(!confirm('¿Eliminar «'+entry.name+'»?'))return;state[field].splice(i,1);redrawWorldbook();persist()};
   li.append(info,del);ul.append(li);
  });
 }
}
function addWorld(field,nameId,noteId){
 const name=$(nameId).value.trim(),note=$(noteId).value.trim();
 if(!name)return alert('Escribe un nombre primero.');
 state[field]??=[];
 if(state[field].length>=60)return alert('Máximo 60 registros por sección.');
 state[field].push({name:name.slice(0,70),note:note.slice(0,500)});
 $(nameId).value='';$(noteId).value='';redrawWorldbook();persist();
}
$('addNpc').onclick=()=>addWorld('npcs','npcName','npcNote');
$('addPlace').onclick=()=>addWorld('places','placeName','placeNote');
const encounterActors=['un mensajero exhausto','una patrulla desconfiada','una viajera que oculta su identidad','un erudito perdido','una criatura herida','un comerciante sin mercancía','un niño que conoce un secreto','un antiguo rival','una figura cubierta de ceniza','un testigo silencioso'];
const encounterSituations=['pide ayuda para recuperar un objeto','advierte de un peligro cercano','ofrece información a cambio de un favor','parece reconocer al aventurero','huye de algo que todavía no se ve','protege una entrada sellada','acusa a alguien de traición','muestra un mapa incompleto','lleva una carta con un nombre conocido','revela que el tiempo se agota'];
const encounterTwists=['Una pista conecta con un objetivo pendiente.','El encuentro puede resolverse sin combatir.','Alguien escucha la conversación desde las sombras.','Un detalle contradice la primera impresión.','La decisión tendrá consecuencias más adelante.','El personaje parece saber más de lo que admite.'];
$('encounter').onclick=()=>{
 const a=die(10),b=die(10),c=die(6);
 const message=`Encuentras a ${encounterActors[a-1]} que ${encounterSituations[b-1]}. ${encounterTwists[c-1]}\nTiradas narrativas: D10 ${a}, D10 ${b}, D6 ${c}.`;
 $('encounterResult').textContent=message;
 addLog('Encuentro generado (herramienta no oficial): '+message.replaceAll('\n',' '),true);persist();
};
redrawWorldbook();
