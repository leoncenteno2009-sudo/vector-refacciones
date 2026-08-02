# VECTOR - Refacciones y Distribución Automotriz

Página web pública, profesional, responsive, accesible (WCAG 2.2 AA) y comercialmente preparada para **VECTOR**.

- **URL Pública en Producción**: [https://leoncenteno2009-sudo.github.io/vector-refacciones/](https://leoncenteno2009-sudo.github.io/vector-refacciones/)
- **Repositorio GitHub**: [https://github.com/leoncenteno2009-sudo/vector-refacciones](https://github.com/leoncenteno2009-sudo/vector-refacciones)

---

## Stack Tecnológico

- **Framework**: React 18, TypeScript (modo estricto), Next.js 14 (App Router con exportación estática `output: "export"`).
- **3D & WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`.
- **Animación**: GSAP, GSAP ScrollTrigger.
- **Estilos**: Tailwind CSS, CSS Custom Properties (variables globales).
- **Pruebas**: Vitest, React Testing Library.
- **CI/CD & Hosting**: GitHub Actions (`.github/workflows/deploy-pages.yml`) + GitHub Pages.

---

## Estructura del Proyecto

```
vector-refacciones/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # Workflow de integración y despliegue automático
├── app/
│   ├── globals.css              # Variables de diseño marfil, grafito, rojo vector
│   ├── layout.tsx               # Metadatos SEO, Open Graph y Schema.org
│   └── page.tsx                 # Composición principal de la landing
├── components/
│   ├── layout/ (Header, Footer)
│   ├── scroll/ (VectorScrollStory, ScrollStageCopy, ScrollProgress)
│   ├── three/ (VectorCanvas, MechanicalNucleus, CompatibilityRings, DistributionRoute, VehicleReveal, FallbackPoster)
│   ├── sections/ (Categories, CompatibilityFinder, Distribution, Workshops, QuoteProcess, QuoteForm, FinalCTA)
│   └── ui/ (Button, SkipToContent)
├── config/
│   └── site.config.ts           # Datos de marca, canales de atención y navegación
├── content/
│   └── siteContent.ts           # Textos oficiales en español (es-MX)
├── lib/
│   ├── analytics/events.ts      # Eventos de conversión
│   ├── webgl/detectWebGL.ts     # Detección de soporte 3D y memoria
│   └── utils.ts                 # Normalización de basePath y utilidades
├── tests/
│   └── vector.test.tsx          # Pruebas unitarias e integración
└── next.config.js               # Configuración para GitHub Pages (basePath, trailingSlash)
```

---

## Desarrollo Local y Pruebas

```bash
# Instalación de dependencias
npm install

# Modo desarrollo local (http://localhost:3000)
npm run dev

# Ejecutar suite de pruebas
npm run test

# Probar exportación estática localmente
npm run build
```

---

## Despliegue Automático con GitHub Pages

Cualquier commit o Pull Request fusionado a la rama principal (`main`) dispara automáticamente el workflow de GitHub Actions que:

1. Ejecuta las pruebas automatizadas (`npm run test`).
2. Genera la exportación estática de Next.js en la carpeta `out/`.
3. Despliega el artefacto en GitHub Pages bajo la URL HTTPS pública.

---

## Formulario de Cotización

El formulario utiliza validación técnica en el cliente mediante Zod y trampas anti-spam (honeypot).
Al completar la solicitud, se conecta directamente con los canales de atención configurados en `config/site.config.ts` (como WhatsApp oficial o correo institucional), permitiendo además copiar un resumen estructurado sin depender de servidores o almacenamiento de datos sensibles.
