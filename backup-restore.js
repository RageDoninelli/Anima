/* Alfa 0.6: restauración de respaldos completos con validación y confirmación. */
(()=>{
'use strict';
const byId=id=>document.getElementById(id);
const msg=text=>{byId('snapshotMessage').textContent=text};
const vaultKey='anima_gaia_vault_v2';
const snapshotKey='anima_gaia_snapshots_v1';
const activeKey='anima_gaia_alpha_v1';
const button=byId('importArchive'),file=byId('fullBackupFile');
function validState(s){
 return s&&typeof s==='object'&&!Array.isArray(s)&&
 (s.values===null||s.values===undefined||(Array.isArray(s.values)&&s.values.length===8&&s.values.every(n=>Number.isInteger(n)&&n>=1&&n<=20)))&&
 (s.name===undefined||typeof s.name==='string');
}
function validate(data){
 if(!data||data.format!=='anima-gaia-full-backup'||data.version!==1)throw Error('Este archivo no es un respaldo completo compatible de Anima Gaia.');
 if(!validState(data.active))throw Error('La partida activa no tiene un formato válido.');
 if(!Array.isArray(data.snapshots)||data.snapshots.length>25||data.snapshots.some(x=>!x||typeof x.id!=='string'||!validState(x.data)))throw Error('Las instantáneas del archivo no son válidas.');
 if(!data.vault||typeof data.vault!=='object'||Array.isArray(data.vault))throw Error('El archivo de personajes no es válido.');
 return data;
}
button.addEventListener('click',()=>{file.value='';file.click()});
file.addEventListener('change',async()=>{
 const selected=file.files&&file.files[0];if(!selected)return;
 try{
  if(selected.size>3_000_000)throw Error('El archivo supera el límite de seguridad de 3 MB.');
  const data=validate(JSON.parse(await selected.text()));
  const name=data.active.name||'Sin nombre';
  const count=data.snapshots.length;
  const proceed=confirm('Respaldo detectado:\nPersonaje: '+name+'\nInstantáneas: '+count+
  '\n\nATENCIÓN: se reemplazarán la partida activa, las partidas archivadas y las instantáneas locales. ¿Ya descargaste un respaldo de lo que tienes actualmente?');
  if(!proceed){msg('Restauración cancelada; no se modificó ningún dato.');return}
  // Guardar primero todos los datos serializados; si falla una escritura, revertir.
  const vault=JSON.stringify(data.vault),snapshots=JSON.stringify(data.snapshots),active=JSON.stringify(data.active);
  const keys=[activeKey,vaultKey,snapshotKey];
  const old=keys.map(k=>localStorage.getItem(k));
  try{
   localStorage.setItem(activeKey,active);
   localStorage.setItem(vaultKey,vault);
   localStorage.setItem(snapshotKey,snapshots);
  }catch(err){
   keys.forEach((k,i)=>{try{if(old[i]===null)localStorage.removeItem(k);else localStorage.setItem(k,old[i])}catch(_){}});
   throw Error('No se pudo guardar el respaldo. Se intentó recuperar el estado anterior.');
  }
  msg('Respaldo restaurado. Actualizando aplicación...');
  location.reload();
 }catch(err){msg('No se restauró nada: '+err.message)}
});
})();
