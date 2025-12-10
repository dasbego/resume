# Resume / CV Portfolio

Un CV/Resume interactivo y bilingüe (Español/Inglés) construido con Astro y Preact. El sitio permite cambiar entre idiomas dinámicamente, descargar el CV en PDF, y está optimizado para impresión.

## Características

- 🌐 **Bilingüe**: Soporte completo para Español e Inglés con cambio dinámico de idioma
- 📄 **Descarga PDF**: Botón para descargar el CV en formato PDF
- 🎨 **Diseño Minimalista**: Interfaz limpia y profesional
- ⚡ **Alto Rendimiento**: Construido con Astro (Islands Architecture) y Preact
- 🖨️ **Optimizado para Impresión**: Estilos específicos para impresión
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- 🔄 **View Transitions**: Transiciones suaves al cambiar de idioma

## Tecnologías

- **Astro 4.x**: Framework web moderno con Islands Architecture
- **Preact**: Biblioteca ligera (~3KB) para interactividad
- **TypeScript**: Tipado estático para mejor desarrollo
- **JSON Resume Schema**: Formato estándar para datos del CV

## Requisitos

- **Node.js**: LTS version (20.x o 22.x recomendado)
- **npm** o **pnpm**: Gestor de paquetes

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd resume
```

2. Instala las dependencias:
```bash
npm install
# o
pnpm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

## Estructura del Proyecto

```
resume/
├── public/                 # Archivos estáticos
│   ├── cv.json            # CV en español (accesible públicamente)
│   ├── cv.en.json         # CV en inglés (accesible públicamente)
│   ├── preview_resume_photo.png
│   └── Guillermo_Beltran_Resume_2025.pdf
├── src/
│   ├── components/
│   │   ├── Hero.tsx       # Componente Hero (Preact)
│   │   ├── LanguageToggle.tsx  # Toggle de idioma (Preact)
│   │   ├── ResumeContent.tsx   # Contenido del resume (Preact)
│   │   ├── sections/      # Componentes Astro (legacy, no usados actualmente)
│   │   └── ...
│   ├── contexts/
│   │   └── LanguageContext.tsx  # Contexto Preact para idioma
│   ├── layouts/
│   │   └── Layout.astro   # Layout principal con View Transitions
│   └── pages/
│       └── index.astro    # Página principal
├── cv.json                # CV en español (fuente de datos)
├── cv.en.json             # CV en inglés (fuente de datos)
├── astro.config.mjs       # Configuración de Astro
└── package.json
```

## Personalización

### Actualizar el CV

Edita los archivos `cv.json` (español) y `cv.en.json` (inglés) siguiendo el [JSON Resume Schema](https://jsonresume.org/schema/).

**Estructura básica:**
- `basics`: Información personal (nombre, email, teléfono, etc.)
- `work`: Experiencia laboral
- `education`: Educación
- `skills`: Habilidades técnicas
- `projects`: Proyectos personales
- `languages`: Idiomas

### Cambiar la Foto

1. Reemplaza `public/preview_resume_photo.png` con tu foto
2. Actualiza la ruta en `cv.json` y `cv.en.json`:
```json
{
  "basics": {
    "image": "/preview_resume_photo.png"
  }
}
```

### Actualizar el PDF

Reemplaza `public/Guillermo_Beltran_Resume_2025.pdf` con tu CV en PDF.

## Sistema de Idiomas

El sistema de idiomas utiliza:

- **Preact Context**: Para compartir el estado del idioma entre componentes
- **localStorage**: Para persistir la preferencia del usuario
- **View Transitions**: Para transiciones suaves al cambiar de idioma

**Componentes clave:**
- `LanguageContext.tsx`: Contexto que maneja el estado del idioma
- `LanguageToggle.tsx`: Botón para cambiar de idioma
- `ResumeContent.tsx`: Renderiza el contenido según el idioma seleccionado

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye el sitio para producción
- `npm run preview`: Previsualiza el build de producción
- `npm run astro`: Ejecuta comandos de Astro CLI

## Build y Deploy

### Build para Producción

```bash
npm run build
```

Los archivos estáticos se generan en `dist/`.

### Deploy

El sitio puede desplegarse en cualquier plataforma que soporte sitios estáticos:

- **Vercel**: Conecta tu repositorio y despliega automáticamente
- **Netlify**: Similar a Vercel, despliegue automático
- **GitHub Pages**: Usa GitHub Actions para build y deploy
- **VPS propio**: Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas de despliegue automático con GitHub Actions

## Arquitectura

### Islands Architecture

Este proyecto utiliza la arquitectura de "Islands" de Astro:

- **Componentes Astro**: Renderizados en el servidor, sin JavaScript
- **Componentes Preact**: Hidratados solo donde es necesario (islands)
- **Beneficios**: 
  - Menor bundle size
  - Mejor rendimiento
  - SEO optimizado

### Preact vs React

Se eligió Preact sobre React por:

- **Tamaño**: ~3KB vs ~45KB (93% más pequeño)
- **API Compatible**: Misma API que React
- **Rendimiento**: Virtual DOM más ligero

## Estilos CSS

Los estilos están organizados en:

- **Componentes Preact**: CSS modules (`.css` files)
- **Componentes Astro**: Scoped styles (`<style>` tags)
- **Globales**: En `Layout.astro` con `is:global`

## Compatibilidad de Navegadores

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- View Transitions requieren navegadores modernos

## Licencia

Este proyecto está basado en el diseño de [BartoszJarocki/cv](https://github.com/BartoszJarocki/cv) y utiliza el [JSON Resume Schema](https://jsonresume.org/schema/).

## Créditos

- Diseño original: [BartoszJarocki/cv](https://github.com/BartoszJarocki/cv)
- Schema: [JSON Resume](https://jsonresume.org/)
- Framework: [Astro](https://astro.build/)
- UI Library: [Preact](https://preactjs.com/)
