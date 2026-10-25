# Anima — Chronicles of Gaia · Alfa 0.1

Prototipo web estático para un jugador, en español. Funciona sin servidor ni claves API.

## Instalación en GitHub Pages

1. Descomprime el ZIP.
2. Sube `index.html`, `styles.css` y `app.js` a la raíz de un repositorio de GitHub.
3. Activa Settings → Pages → Deploy from a branch → main → / (root).
4. Abre la dirección publicada. También funciona abriendo `index.html` localmente.

## Alcance y fidelidad

Verificado contra el manual aportado **Core Exxet, edición revisada**: ocho características primarias; método de generación Tipo I; D100 con tirada abierta inicial 90+, umbral progresivo, 100 siempre abierto; pifia base 1–3; controles de habilidad D100 + habilidad final. **No es todavía un motor completo de Anima**. El tratamiento de maestría, resistencia, críticos y restricciones adicionales no está integrado. Los umbrales seleccionados por el usuario y las escenas de ficción son demostrativos y no deben confundirse con tablas o material oficial. La prueba del prólogo usa un valor de habilidad manual, no una ficha validada.

No hay IA generativa: la narración es una aventura ramificada local. El guardado es localStorage (mismo navegador/dispositivo). No se incluye texto, arte ni tablas extensas de los libros protegidos por copyright.

## Próximas fases

1. Auditoría de las siete fuentes y matriz de reglas y suplementos.
2. Creación de personaje completa: categoría, PD, habilidades, ventajas, equipo y cálculos.
3. Combate completo y módulos sobrenaturales (Ki, magia, convocación, psíquica).
4. Director de juego generativo con backend seguro, validación determinista y persistencia robusta.
