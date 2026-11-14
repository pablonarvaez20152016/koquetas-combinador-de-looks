# Koquetas Boutique · Combinador de Looks

Repositorio público de publicación: `pablonarvaez20152016/koquetas-combinador-de-looks`. La ruta de GitHub Pages es `/koquetas-combinador-de-looks/`. El acceso de administración se abre añadiendo `#/admin` a la URL del combinador.

React + TypeScript + Vite. Sin backend, base de datos ni servicios externos. Tres colores de pantalón y seis combinaciones manuales por color. Catálogo en `src/data/looks.ts`.

También está habilitada la categoría **Bléizer** con cuatro colores: blanco, negro, rojo y rosado. Cambia entre Pantalón y Bléizer con los botones superiores; cada categoría conserva su última selección. Cada color ofrece una panorámica de PC, dos imágenes móviles de tres modelos y seis combinaciones con votos independientes. El panel de administración incluye las 42 combinaciones de ambas categorías.

Las fotografías de bléizer se importan desde `fondos/Seis looks blaizer COLOR.png` a `public/looks/blazer-COLOR/`. Ejecuta `npm run images` y `npm run build` después de reemplazarlas. El importador genera la panorámica de bléizer únicamente para las entradas con `generateDesktop: true`; conserva las panorámicas existentes de pantalón. Las descripciones del catálogo se basan en la ropa visible de cada foto.

## Desarrollo y compilación

Requiere Node.js 22 o superior.

```sh
npm install
npm run dev
npm run images
npm run build
npm run preview
```

En PowerShell usa `npm.cmd` si la política bloquea `npm.ps1`. La compilación comprueba TypeScript y genera `dist/`.

## Imágenes móviles: dos grupos de tres

`npm run images` lee los originales de `fondos/` según `scripts/images.config.json`. Ya no genera imágenes individuales ni utiliza la opción antigua `--crop`. Tampoco escribe ni reemplaza `desktop.webp`.

Cada original aprobado genera exactamente dos archivos, en orden:

- `public/looks/<color>/mobile-group-01.webp`: modelos 1, 2 y 3.
- `public/looks/<color>/mobile-group-02.webp`: modelos 4, 5 y 6.

El corte es central, en dos mitades idénticas, conservando toda la altura y los píxeles originales sin estirar ni cambiar colores. Para los originales actuales de 1672 × 941, cada mitad mediría 836 × 941. No se fuerza 9:16 ni se amplía artificialmente la resolución. Optimización WebP con calidad 88. La aplicación usa una sola fotografía por grupo, `object-fit: contain`, carga diferida del segundo grupo y dos páginas accesibles mediante tacto, flechas, indicadores o teclado. Al cambiar de pantalón vuelve al primer grupo.

### Estado actual

Las seis imágenes móviles están generadas y habilitadas desde las panorámicas existentes, por indicación del usuario. Cada archivo mide 836 × 941 píxeles. La conversión conserva los originales sin reconstruir partes ni modificar prendas; los detalles del encuadre original también se conservan. El carrusel muestra los grupos 1–3 y 4–6 en orden.

Para regenerarlas tras actualizar los originales, ejecuta `npm run images` y después `npm run build`. El procesamiento no modifica los archivos `desktop.webp`.

## Votos y estadísticas locales

Las clientas solo ven los botones **Me gusta**, sin contadores ni panel de resultados. Para administrar, añade `#/admin` a la URL de la aplicación (por ejemplo, `http://localhost:5173/#/admin`). Ingresa la contraseña de 10 dígitos guardada en `admin-access.txt`, archivo privado excluido de Git y de `dist/`. La sesión se cierra al recargar, salir de la ruta, pulsar **Cerrar sesión** o tras 15 minutos de inactividad.

Para cambiar la contraseña, ejecuta `node scripts/admin-password.mjs` y luego vuelve a compilar. Se genera una contraseña aleatoria nueva en el archivo local y un verificador PBKDF2 en `src/data/admin-access.json`; incluye este JSON en el repositorio para publicar el acceso actualizado. La contraseña en texto claro no se incorpora a la aplicación.

Este acceso protege la interfaz mediante JavaScript, no es autenticación de servidor: una persona con conocimientos técnicos puede eludirlo y leer los datos locales del navegador. Para que las estadísticas sean accesibles exclusivamente a una cuenta administradora y se acumulen desde los celulares de las clientas se necesita autenticación y almacenamiento en un servidor. La ruta actual solo muestra los votos del mismo navegador.

Cada combinación tiene un botón **Me gusta** en PC y móvil. Cada pulsación suma un voto; no representa personas únicas. Dentro de administración, **Ver estadísticas** muestra las 18 combinaciones ordenadas por votos, sus porcentajes y los empates en el primer lugar. El total se conserva al cambiar de pantalón o recargar la página mediante `localStorage` (`koquetas-look-votes-v1`).

Estos resultados corresponden únicamente a este navegador y dispositivo. No se sincronizan entre celulares ni pestañas abiertas simultáneamente. Borrar los datos del sitio elimina los votos; si el almacenamiento está bloqueado, la interfaz avisa que no podrá conservarlos. Para estadísticas compartidas entre todas las clientas será necesario añadir almacenamiento compartido.

## GitHub Pages

1. Crea el repositorio, por ejemplo `koquetas-combinador`, y sube el proyecto a `main`, incluyendo `package-lock.json`, `src/data/mobile-images.json` y `public/looks/`.
2. Abre **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Haz push a `main` o ejecuta **Publicar en GitHub Pages > Run workflow** en Actions.
4. Espera a que termine; la URL aparecerá en el entorno `github-pages`.

El workflow usa `npm ci`, `npm run build` y acciones oficiales para publicar `dist/`. Configura la ruta base con el nombre del repositorio. Para `usuario.github.io`, cambia `VITE_BASE_PATH` del workflow a `/`.

Para compilar con otra ruta en PowerShell:

```powershell
$env:VITE_BASE_PATH = '/otro-repositorio/'
npm.cmd run build
```

Sin variable, el build usa `/koquetas-combinador/`. Los recursos usan `import.meta.env.BASE_URL`. No se necesitan claves ni secretos. El proyecto no está publicado hasta conectar el repositorio y ejecutar correctamente el workflow.

