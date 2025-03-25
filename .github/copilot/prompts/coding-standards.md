## Motor India Frontend - Coding Standards

### Component Structure
- Use functional components with hooks
- Keep components focused on a single responsibility
- Extract reusable UI elements into separate components
- Place page-specific components in the same directory as the page
- Use the ThreeSixtyViewer pattern for interactive 3D views

### Naming Conventions
- PascalCase for component names (e.g., ThreeSixtyViewer, ColorGallery)
- camelCase for variables, functions, and instances
- Use descriptive, semantic names that reflect the automotive domain
- Prefix event handlers with "handle" (e.g., handleSubmit, handleColorSelect)

### JavaScript/TypeScript Practices
- Use ES6+ features (arrow functions, destructuring, spread operator)
- Prefer async/await over Promise chains
- Use optional chaining and nullish coalescing for API data
- Type props with JSDoc comments when using JavaScript
- Structured error handling with graceful fallbacks

### CSS/Styling
- Use Tailwind CSS utility classes exclusively
- Follow the spacing scale: 4 = 1rem, 6 = 1.5rem, 8 = 2rem
- Use consistent rounded corners: rounded-lg = 0.5rem
- Follow mobile-first responsive design (sm, md, lg breakpoints)
- Use aspect ratio classes for media containers (aspect-[4/3], aspect-[16/9])
- Apply consistent shadows (shadow-sm, shadow-md) with border-gray-100

### Next.js Best Practices
- Use server components for data fetching when possible
- Mark client components with "use client" directive
- Use route parameter extraction with proper error handling
- Implement loading and error states for all data fetching operations
- Use dynamic metadata generation for SEO

### Media Handling
- Use next/image for static images with proper sizing and lazy loading
- Implement specialized components for different media types (images, 360° views, videos)
- Use embeds with proper loading attributes for third-party content
- Provide aspect ratio containers for all media to prevent layout shifts

### Color Scheme
- Primary: red-600 (#DC2626)
- Secondary: gray-800 (#1F2937)
- Background: white or gray-50 (#F9FAFB)
- Text: gray-900 (#111827) for headings, gray-600 (#4B5563) for body
- Borders: gray-100 for light borders, gray-200 for more prominent borders
- Focus/Active states: Use border-red-600 for active elements
- Error states: Use red-500 for error messages
- Success states: Use green-500 for success messages