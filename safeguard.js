/* Alfa 0.5: copias independientes y exportación de todo el archivo. */
(()=>{
 const KEY='anima_gaia_snapshots_v1';
 const $id=id=>document.getElementById(id);
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>x&&x.data&&typeof x.id==='string').slice(-25):[]}catch{return []}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const msg=t=>$id('snapshotMessage').textContent=t;
 const download=(name,payload)=>{const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)};
 const capture=()=>{
  // Persistir los cambios escritos en campos antes de capturar.
  persist();
  const data=safeState(state);
  if(!data.values)throw Error('Primero genera las características del personaje.');
  const list=read();const now=new Date();
  const record={id:now.getTime().toString(36)+'-'+Math.random().toString(36).slice(2,8),date:now.toISOString(),name:data.name||'Héroe sin nombre',stats:data.values.slice(),data};
  list.push(record);write(list.slice(-25));render();return record;
 };
 function render(){const ul=$id('snapshotList');ul.replaceChildren();const list=read().slice().reverse();if(!list.length){const li=document.createElement('li');li.textContent='Todavía no hay instantáneas.';ul.append(li);return}
  for(const entry of list){const li=document.createElement('li');const label=document.createElement('div');label.textContent=entry.name+' · '+new Date(entry.date).toLocaleString('es')+' · '+(Array.isArray(entry.stats)?entry.stats.join(' / '):'');li.append(label);const buttons=document.createElement('div');buttons.className='actions';const restore=document.createElement('button');restore.textContent='Restaurar';restore.onclick=()=>{try{const restored=safeState(entry.data);if(!confirm('¿Restaurar «'+entry.name+'»? Sustituirá la partida activa. Exporta antes si quieres conservarla.'))return;applyState(restored);if(typeof redrawTabletop==='function')redrawTabletop();msg('Héroe restaurado. Tus otras instantáneas siguen protegidas.')}catch(e){msg('No se pudo restaurar: '+e.message)}};const exportOne=document.createElement('button');exportOne.textContent='Exportar JSON';exportOne.onclick=()=>download('anima-heroe-'+entry.id+'.json',{format:'anima-gaia-save',version:2,created:new Date().toISOString(),data:entry.data});const remove=document.createElement('button');remove.textContent='Eliminar copia';remove.className='subtle';remove.onclick=()=>{if(!confirm('¿Eliminar esta instantánea? No se puede deshacer.'))return;write(read().filter(x=>x.id!==entry.id));render()};buttons.append(restore,exportOne,remove);li.append(buttons);ul.append(li)}
 }
 $id('makeSnapshot').onclick=()=>{try{const item=capture();msg('Instantánea protegida: '+item.name+'. Descarga también un respaldo completo.')}catch(e){msg(e.message)}};
 $id('downloadArchive').onclick=()=>{try{persist();download('anima-gaia-respaldo-completo-'+new Date().toISOString().slice(0,10)+'.json',{format:'anima-gaia-full-backup',version:1,created:new Date().toISOString(),active:safeState(state),vault:getVault(),snapshots:read()});msg('Respaldo completo descargado. Guárdalo fuera del navegador. Nota: para importar una partida individual utiliza Exportar JSON en su instantánea.')}catch(e){msg('Error al generar respaldo: '+e.message)}};
 // Guardar instantánea antes de generar estadísticas nuevas cuando ya existen.
 const oldRoll=$id('rollStats').onclick;
 $id('rollStats').onclick=function(ev){if(state.values){if(!confirm('Ya tienes características. ¿Deseas generar otras? Primero guardaremos una instantánea de las actuales.'))return;try{capture()}catch(e){alert('No se pudo proteger el personaje: '+e.message);return}}if(typeof oldRoll==='function')oldRoll.call(this,ev)};
 // No permitir borrar la partida activa sin intentar guardar una instantánea.
 $id('reset').onclick=()=>{if(!confirm('¿Crear una partida nueva? Se borrará la partida activa, pero se conservarán el archivo y las instantáneas.'))return;if(state.values){try{capture()}catch(e){alert('No se pudo proteger el personaje. Operación cancelada: '+e.message);return}}localStorage.removeItem('anima_gaia_alpha_v1');location.reload()};
 render();
})();
