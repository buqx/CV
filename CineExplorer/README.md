# CineExplorer 🎬

**Desarrollado por:** Juan Esteban Valencia  
**Curso:** Desarrollo Frontend  
**Año:** 2026

---

## 📋 Descripción del Proyecto

CineExplorer es una aplicación web desarrollada en Angular que permite explorar películas utilizando la API pública de TMDB (The Movie Database). El proyecto cumple con todos los requisitos del curso de Desarrollo Frontend, implementando las mejores prácticas de desarrollo web moderno.

### Finalidad del Proyecto

La aplicación tiene como objetivo principal proporcionar una interfaz de usuario para explorar películas de manera intuitiva y atractiva. Los usuarios pueden:

- Visualizar películas populares, mejor valoradas y próximos estrenos
- Buscar películas por nombre
- Ver detalles completos de cada película (reparto, sinopsis, duración, etc.)
- Filtrar películas por género
- Guardar películas favoritas de forma persistente

---

## 🛠 Tecnologías Utilizadas

### Framework y Lenguaje
- **Angular 19+**: Framework principal de la aplicación
- **TypeScript**: Lenguaje de programación typed
- **SCSS**: Preprocesador de CSS para estilos avanzados

### Bibliotecas y Herramientas
- **Bootstrap 5**: Framework CSS para diseño responsive y componentes UI
- **RxJS**: Biblioteca para programación reactiva (manejo de observables)
- **Angular Router**: Sistema de navegación SPA

### API Externa
- **TMDB API v3**: The Movie Database API para obtener información de películas

### Herramientas de Desarrollo
- **Angular CLI**: Herramienta de línea de comandos para Angular
- **Git**: Control de versiones
- **npm**: Gestor de paquetes

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
2. **npm** (incluido con Node.js)
3. **Angular CLI** (se instala durante la configuración)

---

## 🚀 Pasos para Clonar y Ejecutar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/buqx/CineExplorer.git
```

### 2. Navegar al Directorio del Proyecto

```bash
cd CineExplorer
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar la API Key de TMDB

1. Crear una cuenta en [themoviedb.org](https://www.themoviedb.org/signup)
2. Ir a **Settings > API** y solicitar una API key (seleccionar "Developer")
3. Editar el archivo `src/environments/environment.ts`
4. Reemplazar el valor de `tmdbApiKey` con tu API key:

```typescript
export const environment = {
  production: false,
  tmdbApiKey: 'TU_API_KEY_AQUI',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p'
};
```

### 5. Ejecutar el Servidor de Desarrollo

```bash
ng serve
```

### 6. Abrir en el Navegador

Navegar a: `http://localhost:4200/`

### 7. Construir para Producción (Opcional)

```bash
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`.

---

## 🏗 Arquitectura del Proyecto

El proyecto sigue una arquitectura modular y escalable utilizando Angular Standalone Components:

```
src/app/
├── core/                    # Servicios, interceptores y modelos
│   ├── services/           # Lógica de negocio
│   │   ├── tmdb.service.ts       # Comunicación con API de TMDB
│   │   ├── favorites.service.ts   # Manejo de favoritos (localStorage)
│   │   └── theme.service.ts       # Gestión de temas (claro/oscuro)
│   ├── interceptors/        # Interceptores HTTP
│   │   └── api-key.interceptor.ts # Agrega API key automáticamente
│   └── models/              # Interfaces TypeScript
│       └── movie.model.ts   # Definiciones de tipos de datos
│
├── shared/                  # Componentes y pipes reutilizables
│   ├── components/          # Componentes reutilizables
│   │   └── movie-card/      # Tarjeta de película
│   └── pipes/               # Pipes personalizados
│       ├── truncate.pipe.ts      # Trunca texto largo
│       └── tmdb-image.pipe.ts     # Construye URLs de imágenes
│
├── features/                # Páginas de la aplicación
│   ├── home/                # Página de inicio
│   ├── movie-detail/        # Detalle de película
│   ├── search-results/      # Resultados de búsqueda
│   ├── favorites/           # Películas favoritas
│   └── genre-filter/        # Filtrado por género
│
├── app.component.ts         # Componente raíz (navbar + footer)
├── app.routes.ts            # Configuración de rutas
└── app.config.ts           # Configuración de la aplicación
```

### Patrones Implementados

- **Lazy Loading**: Las páginas se cargan bajo demanda
- **Inyección de Dependencias**: Servicios proporcionados a nivel raíz
- **Separación de Responsabilidades**: Cada componente tiene una función específica
- **Programación Reactiva**: Uso de Observables para manejo de datos asíncronos

---

## 🔌 Funcionamiento de la API de TMDB

### Endpoints Utilizados

| Endpoint | Descripción |
|----------|--------------|
| `/movie/popular` | Películas populares del momento |
| `/movie/top_rated` | Películas mejor valoradas |
| `/movie/upcoming` | Próximos estrenos |
| `/movie/now_playing` | Películas en cartelera |
| `/search/movie` | Buscar películas por nombre |
| `/movie/{id}` | Detalle completo de una película |
| `/movie/{id}/credits` | Reparto (actores y crew) |
| `/movie/{id}/similar` | Películas similares |
| `/genre/movie/list` | Lista de todos los géneros |
| `/discover/movie` | Descubrir películas por género |

### Construcción de URLs de Imágenes

Las imágenes de TMDB se construyen concatenando la URL base con el tamaño y la ruta:

```
https://image.tmdb.org/t/p/w500 + poster_path
```

Ejemplo:
```
https://image.tmdb.org/t/p/w500/or6CW5zV2VjX1kJ2h3XaF6yZa7.jpg
```

Tamaños disponibles:
- `w92`, `w154`, `w185`, `w342`, `w500`, `w780`, `original`

### Datos del API Utilizados

#### Película (Movie)
```typescript
{
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  // ...otros campos
}
```

#### Detalle de Película (MovieDetail)
```typescript
{
  id: number;
  title: string;
  overview: string;
  runtime: number | null;  // Duración en minutos
  genres: Genre[];         // Géneros de la película
  release_date: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  tagline: string | null;
  // ...otros campos
}
```

#### Reparto (Credits)
```typescript
{
  cast: CastMember[];  // Actores principales
  crew: CrewMember[]; // Director, productores, etc.
}
```

---

## 💡 Funcionalidades Implementadas

### 1. Página de Inicio
- **Banner destacado**: Película actual en cartelera con imagen de fondo
- **Sección de Películas Populares**: Las películas más vistas
- **Sección de Mejor Valoradas**: Las películas mejor puntuadas
- **Sección de Próximos Estrenos**: Películas próximas a estreno
- **Tarjetas interactivas**: Cada película se muestra en una tarjeta con póster, título, puntuación y botón de favorito

### 2. Detalle de Película
- **Información completa**: Título, sinopsis, fecha de estreno, duración, idioma
- **Géneros**: Mostrados como badges
- **Puntuación**: Calificación de la película
- **Botón de favorito**: Agregar/quitar de favoritos
- **Reparto**: Fotos circulares de los actores principales
- **Director**: Información del director
- **Películas similares**: Recomendaciones de películas relacionadas

### 3. Sistema de Búsqueda
- **Barra de búsqueda**: En el navbar (desktop y mobile)
- **Debounce de 300ms**: Evita múltiples llamadas mientras el usuario escribe
- **Resultados paginados**: Navegación entre páginas de resultados
- **Mensaje de no resultados**: Cuando la búsqueda no encuentra películas

### 4. Favoritos
- **Persistencia**: Los favoritos se guardan en localStorage
- **Contador en navbar**: Muestra el número de películas guardadas
- **Modal de confirmación**: Al eliminar un favorito
- **Estado vacío**: Mensaje cuando no hay favoritos guardados

### 5. Filtro por Género
- **Dropdown de géneros**: Lista de todos los géneros disponibles
- **Chips de géneros**: Botones para seleccionar género
- **Películas filtradas**: Muestra películas del género seleccionado
- **Paginación**: Navegación entre páginas de resultados

### 6. Tema Claro/Oscuro
- **Toggle en navbar**: Botón para cambiar entre temas
- **Persistencia**: El tema seleccionado se guarda en localStorage
- **Preferencia del sistema**: Detecta automáticamente si el usuario prefiere modo oscuro

---

## 🎨 Estilos y Diseño

### Características de Diseño
- **Responsive Design**: Mobile-first con breakpoints en 768px y 1024px
- **CSS Grid**: Para el layout de tarjetas de películas
- **Flexbox**: Para el navbar y layouts generales
- **Variables CSS**: Sistema de variables para colores, espaciados, tipografía
- **Tipografía fluida**: Uso de `clamp()` para tamaños de fuente adaptativos
- **Animaciones**: Transiciones suaves y animaciones de entrada con `@keyframes`

### Componentes Bootstrap Utilizados
- Navbar con soporte responsive
- Grid system (container, row, col)
- Cards para películas
- Badges para géneros
- Spinners de carga
- Pagination
- Modal para confirmación
- Buttons y formularios

---

## 📱 Características Responsive

| Tamaño | Columnas | Navbar |
|--------|----------|--------|
| Mobile (< 768px) | 1-2 columnas | Collapsado con toggle |
| Tablet (768px - 1024px) | 2-3 columnas | Expandido |
| Desktop (> 1024px) | 3-4 columnas | Expandido con búsqueda visible |

---

## ✅ Cumplimiento de Requisitos

El proyecto cumple con todos los requisitos de la rúbrica del curso:

### HTML Semántico
- ✅ Uso de etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<figure>`, `<time>`)
- ✅ Accesibilidad básica con jerarquía de encabezados correcta, atributos `alt` descriptivos y labels para formularios

### CSS
- ✅ CSS Grid para tarjetas de películas
- ✅ Flexbox para navbar y layout general
- ✅ Responsive mobile-first con breakpoints
- ✅ Tipografía fluida con `clamp()`
- ✅ Animaciones y transiciones suaves
- ✅ Variables CSS en `:root`
- ✅ Tema claro/oscuro con persistencia
- ✅ Soporte para `prefers-reduced-motion`

### Bootstrap
- ✅ Grid system y navbar
- ✅ Cards, badges, spinners, pagination, modal

### Consumo de API
- ✅ TmdbService con todos los endpoints
- ✅ Interceptor HTTP para API key
- ✅ Manejo de errores

### Arquitectura
- ✅ Servicios separados (Tmdb, Favorites, Theme)
- ✅ Modelos TypeScript
- ✅ Componente reutilizable (MovieCardComponent)
- ✅ Pipes personalizados (TruncatePipe, TmdbImagePipe)

### Funcionalidades
- ✅ LocalStorage para favoritos y tema
- ✅ Routing completo con todas las rutas
- ✅ Búsqueda con debounce
- ✅ Paginación funcional
- ✅ Modal de confirmación

---

## 📄 Licencia

**© 2026 CineExplorer - Desarrollado por Juan Esteban Valencia. Todos los derechos reservados.**

Este proyecto fue desarrollado como trabajo final del curso de Desarrollo Frontend.

---

## 📞 Información de Contacto

Para consultas o soporte, contactar al desarrollador: **Juan Esteban Valencia**