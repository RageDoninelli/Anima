# Anima — Chronicles of Gaia · Alfa 0.2.1 PWA

Esta entrega contiene **todos los archivos** de la Alfa 0.2 más los necesarios para instalar la web como aplicación Android/Chrome.

## Publicación

1. Extrae el ZIP y sube **todo el contenido de esta carpeta**, incluida la carpeta `icons`, a la **raíz del mismo repositorio** de GitHub Pages.
2. Espera a que termine la publicación de GitHub Pages.
3. Abre la URL pública con Chrome (no desde una vista integrada en otra app), actualiza la página y espera unos segundos.
4. En el menú ⋮ de Chrome, selecciona **Instalar aplicación**. Si Chrome sigue mostrando solo "Crear acceso directo", vuelve a abrir la URL, verifica que los archivos estén publicados y prueba tras cerrar/reabrir la pestaña.

## Qué cambia

- `manifest.webmanifest`: nombre, identidad visual, inicio y modo independiente.
- `icons/icon-192.png` y `icons/icon-512.png`: iconos locales.
- `sw.js`: cachea los recursos básicos para carga sin conexión tras la primera visita.
- `pwa.js`: registra el service worker.
- `index.html`: incluye referencias al manifiesto e iconos.

**Importante:** No elimina ni migra datos de `localStorage`; si mantienes la misma URL y navegador, tus partidas deberían permanecer. Exporta JSON como copia de seguridad antes de actualizar. Las funciones de juego siguen siendo las de Alfa 0.2, sin nuevas reglas. La instalación depende de Chrome y de que el sitio esté servido por HTTPS (GitHub Pages lo permite). No se garantiza instalación en todos los dispositivos o configuraciones.
