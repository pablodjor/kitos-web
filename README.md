# Kitos Web

Sitio web de **Kitos** para mostrar ofertas de videojuegos, gestionar sorteos y permitir que la comunidad se registre y canjee códigos secretos. Es una aplicación **React** que se ejecuta en el navegador del usuario; no tiene servidor propio: los datos viven en **Google Sheets** y se acceden mediante un **Google Apps Script** desplegado como Web App.

---

## ¿Qué hace la web?

| Sección | Ruta | Descripción |
|--------|------|-------------|
| Inicio | `/` | Banner principal, accesos rápidos, últimas ofertas (categoría `home`) y enlace a Telegram |
| Ofertas | `/ofertas` | Listado de ofertas agrupadas por categoría, con buscador |
| Ofertas por categoría | `/ofertas/:category` | Vista filtrada de una categoría concreta |
| Sorteos | `/sorteos` | Información del sorteo activo y cuenta atrás hasta la fecha de cierre |
| Registro al sorteo | `/registro` | Formulario de inscripción (nombre, email, país) y bases legales |
| Códigos secretos | `/codigo` | Canje de códigos para sumar participaciones al sorteo |

La web incluye **modo claro/oscuro**, navegación responsive y enlaces a las redes sociales de Kitos (YouTube, TikTok, Instagram, Telegram, Discord, etc.).

---

## Arquitectura en pocas palabras

```
┌─────────────────┐     HTTPS (fetch)      ┌──────────────────────────┐
│  Navegador      │ ──────────────────────►│  Google Apps Script      │
│  (React SPA)    │                        │  (Web App desplegada)    │
└────────┬────────┘                        └────────────┬─────────────┘
         │                                                │
         │  GET países (solo registro)                    │ lee/escribe
         ▼                                                ▼
┌─────────────────┐                        ┌──────────────────────────┐
│  restcountries  │                        │  Google Sheets           │
│  .com (público) │                        │  (ofertas, usuarios,     │
└─────────────────┘                        │   sorteo, códigos…)      │
                                           └──────────────────────────┘
```

1. El usuario abre la web (archivos estáticos: HTML, JS, CSS).
2. React pide datos al **script de Google** (`REACT_APP_SCRIPT_URL`).
3. El script procesa la acción (`getOffers`, `register`, etc.) y habla con la hoja de cálculo.
4. Solo en el registro se usa además la API pública **REST Countries** para el autocompletado de países.

**Importante:** el “backend” no está en este repositorio. Este proyecto es solo el **frontend**. La lógica de negocio (validar emails, guardar participantes, canjear códigos) está en el Apps Script asociado a la URL del `.env`.

---

## Stack técnico

- **React 19** + **Create React App** (`react-scripts`)
- **React Router** — rutas del sitio
- **Sass** — estilos por componente (`.module.scss`)
- **Bootstrap 5** — utilidades base
- **Swiper** — carruseles de ofertas
- **react-icons** — iconografía

---

## Estructura del proyecto

```
src/
├── App.js                 # Rutas principales
├── context/
│   └── ThemeContext.jsx   # Tema claro/oscuro
├── layouts/
│   └── MainLayout/        # Navbar + contenido + Footer
├── pages/                 # Una carpeta por pantalla
├── components/            # Piezas reutilizables (tarjetas, modales, etc.)
├── services/
│   ├── googleSheetService.js   # Todas las llamadas al Apps Script
│   └── countriesService.js     # Lista de países (REST Countries)
├── utils/                 # Helpers (filtros, precios, categorías)
└── constants/
    └── socialLinks.js     # URLs de redes sociales
```

---

## Cómo se comunica con Google Sheets

El archivo `src/services/googleSheetService.js` envía peticiones **POST** al Web App con un cuerpo JSON que incluye `action`:

| `action` | Uso |
|----------|-----|
| `getOffers` | Traer todas las ofertas |
| `getRaffleConfig` | Config del sorteo (fechas, premio, ganador si ya hay) |
| `getLegalBases` | Texto de las bases legales |
| `register` | Registrar usuario en el sorteo (`name`, `email`, `country`) |
| `redeemCode` | Canjear código secreto (`email`, `code`) |

La URL del script se configura con la variable de entorno:

```env
REACT_APP_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

Sin esa variable, las funciones del servicio lanzan error al intentar usarlas.

---

## Lógica de negocio relevante (frontend)

- **Registro cerrado** si la fecha de fin del sorteo ya pasó **o** si en la hoja ya hay un ganador cargado.
- **Ofertas en home**: solo las que tienen `category === "home"` (sin distinguir mayúsculas).
- **Categorías en /ofertas**: se agrupan por el campo `category` de cada oferta; si viene vacío, cae en `"Otras ofertas"`.
- **Países**: se cachean en memoria tras la primera carga para no repetir la petición a REST Countries.

---

## Cómo arrancar el proyecto en local

### Requisitos

- Node.js (LTS recomendado)
- npm

### Pasos

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz (no se sube a Git) con la URL del Apps Script:

   ```env
   REACT_APP_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT/exec
   ```

3. Arrancar en desarrollo:

   ```bash
   npm start
   ```

   Abre [http://localhost:3000](http://localhost:3000).

4. Build de producción:

   ```bash
   npm run build
   ```

   Genera la carpeta `build/` con archivos estáticos listos para subir a cualquier hosting (Netlify, Vercel, Cloudflare Pages, S3 + CDN, etc.).

---

## Despliegue

- Solo hace falta **alojar archivos estáticos** (lo que sale de `npm run build`).
- En el hosting hay que definir la variable `REACT_APP_SCRIPT_URL` **en el momento del build** (Create React App la embebe en el bundle).
- El cuello de botella con mucho tráfico suele ser el **Apps Script / Google Sheets** (límites de cuotas de Google), no el servidor que sirve el HTML/JS.
- Para rutas como `/ofertas` o `/registro`, el hosting debe redirigir todas las URLs a `index.html` (configuración típica de SPA).

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build optimizado para producción |
| `npm test` | Tests con Jest (configuración por defecto de CRA) |

---

## Resumen para explicárselo a alguien

> “Es la web de Kitos: un React que se sube como página estática. Las ofertas y los sorteos no están en una base de datos nuestra, sino en Google Sheets; un Apps Script hace de API. El usuario se registra, canjea códigos y ve ofertas; nosotros editamos contenido desde la hoja sin tocar código.”

Si necesitás estimar hosting según visitas, tené en cuenta: **tráfico bajo en el servidor web** (solo JS/CSS/imágenes) y **límites de Google** en escrituras/lecturas del script y la hoja cuando hay picos de registros o canjes.
