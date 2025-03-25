## Project Context: Motor India Frontend

### Tech Stack
- Framework: Next.js 15.1.4 (App Router)
- UI: React 19.0.0, Tailwind CSS 3.4.1
- State Management: React Hooks, Context API
- Routing: Next.js App Router with dynamic segments ([brand]/[model]/[variant])
- Media: Images, 360-degree interior/exterior views, YouTube video embeds
- Toast Notifications: react-hot-toast
- Image Sliders: Swiper
- Icons: Heroicons and React Icons

### Project Overview
This is a frontend for Motor India, a comprehensive platform for automotive content and vehicle information in India. The site includes:
- Vehicle browsing by brands, models, and variants with nested routing
- Detailed vehicle information pages with:
  - Specifications and feature comparison
  - Multiple variants with pricing
  - Color galleries with hex color representation
  - Interactive 360-degree exterior and interior views
  - Image galleries with different angle views
  - YouTube video integration
- Blog/news posts system with categories and tags
- City/location-based filtering for location-specific content
- WordPress backend API integration with revalidation caching

### Code Patterns
- Next.js App Router with nested dynamic routes like /cars/[brand]/[model]/[variant]
- React server components for data fetching with { next: { revalidate: 3600 } }
- Client components marked with "use client" directive for interactive features
- Server-side data fetching with structured error handling
- Tailwind CSS for styling with consistent color scheme (red-600 as primary accent)
- Responsive design patterns (mobile-first approach)
- Component organization by feature (vehicles, categories, posts)
- SEO optimization with dynamic metadata generation