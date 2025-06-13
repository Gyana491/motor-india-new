# Motor India Project - Copilot Instructions

## Project Overview
This is a Next.js-based automotive website for Motor India, focusing on car information, reviews, and automotive content in both English and Hindi languages.

## Project Structure & Context

### Technology Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Language**: JavaScript/JSX
- **Content Management**: WordPress integration for articles/posts
- **Deployment**: Vercel-ready configuration

### Key Directories

#### `/app` - Main Application
- `layout.js` - Root layout component
- `page.jsx` - Homepage
- `globals.css` - Global styles with Tailwind

#### `/app/(pages)` - Static Pages
- `contact-us/` - Contact page

#### `/app/(posts)` - Content Management
- `articles/` - English articles with category and tag filtering
- `hindi/` - Hindi content with similar structure
- `post-styles.css` - Dedicated styles for post content

#### `/app/(vehicles)` - Vehicle Information
- `cars/` - Car listings and details
- `[brand]/[model]/[variant]/` - Dynamic routing for car hierarchy
- Features: 360-view, colors, specifications, pricing, images
- Components for car comparisons, highlights, and galleries

#### `/app/(sitemaps)` - SEO & Sitemaps
- Auto-generated XML sitemaps for cars, images, and 360-views
- `/lib/getter.js` - Data fetching utilities for sitemaps

#### `/components` - Reusable Components
- `Header.jsx` - Main navigation with search and location
- `Footer.jsx` - Site footer
- `HomePage.jsx` - Homepage component
- `LanguageSwitcher.jsx` - English/Hindi language toggle

#### `/lib` - Business Logic
- `api.js` - Main API utilities
- `apiClient.js` - HTTP client configuration
- `/services/` - Service layer for cars and WordPress

#### `/utils` - Utility Functions
- `calculateCarRTOTax.js` - RTO tax calculations
- `geo.js` - Geolocation utilities
- `constants.js` - Application constants

#### `/data` - Static Data
- `getAllCities.js` - City data for location services

## Code Guidelines & Best Practices

### File Naming Conventions
- Use PascalCase for React components (`Header.jsx`, `ColorCarousel.jsx`)
- Use camelCase for utilities and services (`carService.js`, `calculateCarRTOTax.js`)
- Use kebab-case for routes and pages (`contact-us`, `360-view`)

### Component Structure
```jsx
// Preferred component structure
import React from 'react';

const ComponentName = ({ props }) => {
  // State and hooks
  
  // Event handlers
  
  // Render logic
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### API Integration
- Use services in `/lib/services/` for external API calls
- WordPress integration for articles and posts
- Location-based services for car pricing and availability

### Styling Guidelines
- Primary framework: Tailwind CSS
- Custom styles in dedicated CSS files when needed
- Responsive design patterns
- Dark/light theme considerations

### Color Scheme
- **Primary**: red-600 (#DC2626) - Brand primary color for buttons, links, and highlights
- **Secondary**: gray-800 (#1F2937) - Navigation, headers, and secondary elements
- **Background**: white or gray-50 (#F9FAFB) - Page backgrounds and content areas
- **Text**: gray-900 (#111827) for headings, gray-600 (#4B5563) for body text
- **Borders**: gray-100 for light borders, gray-200 for more prominent borders
- **Focus/Active states**: border-red-600 for active elements and form focus states
- **Error states**: red-500 for error messages and validation feedback
- **Success states**: green-500 for success messages and confirmation states
- **Warning states**: yellow-500 for warning messages and alerts
- **Info states**: blue-500 for informational messages and tooltips

### Dynamic Routing Patterns
- `[brand]/[model]/[variant]` - Car hierarchy
- `[slug]` - Article and category pages
- `category/[slug]` and `tag/[slug]` - Content filtering

## Development Workflow

### Pre-Development Checklist ✅
Before starting any development work:
1. **Review existing code patterns** in similar components
2. **Check for any unescaped entities** in text content
3. **Verify all imports are used** and necessary
4. **Ensure proper error handling** is in place
5. **Plan responsive design approach** from the start

### During Development
1. **Use consistent naming conventions** as outlined above
2. **Write semantic, accessible HTML**
3. **Escape all special characters in JSX content immediately**
4. **Add proper TypeScript/JSDoc comments** where needed
5. **Test on multiple screen sizes continuously**

### Post-Development Validation
1. **Run `npm run build`** to catch build errors early
2. **Fix any ESLint warnings immediately**
3. **Test all interactive features**
4. **Verify SEO metadata is correct**
5. **Check loading states and error boundaries**

### Key Features to Maintain
1. **Multilingual Support** - English/Hindi content
2. **SEO Optimization** - Comprehensive sitemap generation
3. **Location-based Services** - RTO pricing, city detection
4. **Car Comparison Tools** - Specifications, features, pricing
5. **360-degree Views** - Interior/exterior car views
6. **Image Galleries** - Car photos and color variations
7. **WordPress Integration** - Article management

### Performance Considerations
- Image optimization for car galleries
- Lazy loading for 360-degree views
- Efficient API caching strategies
- SEO-friendly URL structures

### Testing & Quality
- Ensure responsive design across devices
- Validate dynamic routing functionality
- Test location-based features
- Verify multilingual content rendering

## API Endpoints & Services

### Internal APIs (`/app/api`)
- `/location/autocomplete` - Location search suggestions
- `/location/detect` - Automatic location detection

### External Integrations
- WordPress API for content management
- Car database APIs for vehicle information
- Geolocation services for regional pricing

## Deployment & Configuration

### Environment Setup
- Vercel deployment configuration
- Environment variables for API keys
- SEO meta tags and social sharing

### File Configuration
- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind customization
- `postcss.config.mjs` - PostCSS setup
- `jsconfig.json` - JavaScript project configuration

## Common Development Tasks

### Adding New Car Models
1. Update car service APIs
2. Add image assets to `/public/assets`
3. Create dynamic route structure
4. Update sitemap generation

### Content Management
1. WordPress integration for articles
2. Multilingual content handling
3. Category and tag management
4. SEO optimization

### UI Components
1. Follow existing component patterns
2. Use Tailwind for styling
3. Ensure mobile responsiveness
4. Implement proper accessibility

## Debugging & Troubleshooting

### Common Issues
- Dynamic route resolution
- Image loading and optimization
- API rate limiting
- Location detection accuracy
- Multilingual content synchronization

### Development Tools
- Next.js built-in debugging
- Tailwind CSS IntelliSense
- Browser developer tools for responsive testing
- Network tab for API monitoring

## Code Quality Standards

### JavaScript/JSX Best Practices
- Use modern ES6+ syntax
- Implement proper error handling
- Follow React hooks guidelines
- Optimize component re-renders
- **ALWAYS escape special characters in JSX content to prevent `react/no-unescaped-entities` errors**

### React Unescaped Entities Prevention ⚠️ CRITICAL
**Always escape these characters in JSX content:**

#### Apostrophes and Single Quotes
```jsx
// ❌ WRONG - Will cause build errors
<p>Don't use unescaped apostrophes</p>
<h1>India's #1 Platform</h1>

// ✅ CORRECT - Use HTML entities
<p>Don&apos;t use unescaped apostrophes</p>
<h1>India&apos;s #1 Platform</h1>
```

#### Double Quotes
```jsx
// ❌ WRONG - Will cause build errors
<p>We provide "as is" service</p>
<p>Updated the "Last updated" date</p>

// ✅ CORRECT - Use HTML entities
<p>We provide &quot;as is&quot; service</p>
<p>Updated the &quot;Last updated&quot; date</p>
```

#### Complete HTML Entity Reference
- `'` → `&apos;` (apostrophe/single quote)
- `"` → `&quot;` (double quote)
- `&` → `&amp;` (ampersand)
- `<` → `&lt;` (less than)
- `>` → `&gt;` (greater than)

#### Pre-Build Validation Checklist
Before committing code, always check for:
1. **Unescaped apostrophes** in text content (don't, won't, India's, etc.)
2. **Unescaped quotes** in descriptive text ("as is", "Last updated", etc.)
3. **Proper JSX attribute quoting** (use double quotes for attributes)
4. **Consistent indentation and formatting**

### Common ESLint Error Patterns to Avoid

#### 1. React Unescaped Entities (`react/no-unescaped-entities`)
```jsx
// ❌ These will fail build
<p>We're here to help</p>
<p>Don't worry about pricing</p>
<p>Check "latest updates" here</p>
<h2>Children's Safety</h2>

// ✅ Correct versions
<p>We&apos;re here to help</p>
<p>Don&apos;t worry about pricing</p>
<p>Check &quot;latest updates&quot; here</p>
<h2>Children&apos;s Safety</h2>
```

#### 2. Missing Dependencies in useEffect (`react-hooks/exhaustive-deps`)
```jsx
// ❌ Missing dependencies
useEffect(() => {
  fetchCarData(brand, model);
}, []); // brand and model should be in deps

// ✅ Include all dependencies
useEffect(() => {
  fetchCarData(brand, model);
}, [brand, model]);
```

#### 3. Unused Variables (`no-unused-vars`)
```jsx
// ❌ Unused import
import React, { useState, useEffect } from 'react'; // useEffect not used

// ✅ Only import what you use
import React, { useState } from 'react';
```

#### 4. Missing Keys in Lists (`react/jsx-key`)
```jsx
// ❌ Missing key prop
{cars.map(car => <CarCard car={car} />)}

// ✅ Always provide keys
{cars.map(car => <CarCard key={car.id} car={car} />)}
```

### Build Error Prevention Strategy

#### Before Every Commit
1. **Run the build command**: `npm run build`
2. **Fix all ESLint warnings and errors**
3. **Test responsive design on mobile/tablet/desktop**
4. **Verify all dynamic routes work correctly**
5. **Check console for any runtime errors**

#### Text Content Guidelines
When writing any user-facing text content:

1. **Always use HTML entities for special characters**
2. **Avoid contractions when possible** (use "do not" instead of "don't")
3. **If contractions are necessary, always escape the apostrophe**
4. **Use proper quotation entities for quoted text**
5. **Be consistent with punctuation and formatting**

#### Component Text Examples
```jsx
// ✅ Motor India specific examples
const MotorIndiaText = {
  tagline: "India&apos;s #1 Complete Automotive Platform",
  contactMessage: "We&apos;re here to help you make informed decisions",
  serviceDisclaimer: "Motor India is provided &quot;as is&quot; without warranties",
  privacyNote: "Check our &quot;Privacy Policy&quot; for details",
  childrenSection: "Children&apos;s Privacy Protection",
  userFeedback: "We&apos;ve received your message successfully"
};
```

### Accessibility
- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility

### Security
- Input validation and sanitization
- API rate limiting
- Secure environment variable handling
- XSS protection

## Agent Training Context

When working on this project, always consider:
1. **Automotive Industry Context** - Understanding car specifications, pricing, and market dynamics
2. **Multilingual Requirements** - Hindi and English content parity
3. **Location-based Features** - Regional pricing and availability
4. **SEO Importance** - Automotive search optimization
5. **User Experience** - Car buying journey and comparison tools
6. **Performance** - Image-heavy content optimization
7. **Mobile-first Design** - Automotive users are mobile-heavy

### Preferred Development Approach
1. **Read existing code patterns** before implementing new features
2. **Maintain consistency** with established file structure
3. **Use existing utility functions** and services
4. **Follow component composition patterns**
5. **Ensure responsive and accessible design**
6. **Test multilingual functionality**
7. **Validate SEO and performance impact**
8. **Always escape special characters in JSX content** ⚠️
9. **Run build validation before committing** ⚠️

### Critical Error Prevention Rules 🚨

#### MANDATORY: Always Escape These Characters in JSX
- `'` → `&apos;` (Motor India&apos;s, Don&apos;t, We&apos;re)
- `"` → `&quot;` (Check &quot;Privacy Policy&quot;, &quot;as is&quot;)
- `&` → `&amp;` (when used as text, not entity)
- `<` → `&lt;` (mathematical expressions)
- `>` → `&gt;` (mathematical expressions)

#### MANDATORY: Build Validation Workflow
```bash
# Before every commit, run these commands:
npm run build          # Check for build errors
npm run lint          # Check for ESLint issues  
npm start            # Test local functionality
```

#### Common Motor India Text Patterns to Watch
```jsx
// ❌ THESE WILL BREAK BUILD
"India's automotive platform"
"We're committed to quality"
"Check our "Privacy Policy" page"
"Children's safety is important"

// ✅ CORRECT VERSIONS
"India&apos;s automotive platform"
"We&apos;re committed to quality" 
"Check our &quot;Privacy Policy&quot; page"
"Children&apos;s safety is important"
```

This project serves automotive enthusiasts and car buyers in India, requiring attention to local market needs, pricing structures, and user behavior patterns specific to the Indian automotive market.

## Advanced Design Patterns & Architecture

### Component Architecture Patterns

#### Container-Presentation Pattern
```jsx
// Container component (logic)
const CarModelContainer = ({ brand, model }) => {
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCarData(brand, model).then(setCarData);
  }, [brand, model]);
  
  return <CarModelPresentation data={carData} loading={loading} />;
};

// Presentation component (UI)
const CarModelPresentation = ({ data, loading }) => {
  if (loading) return <LoadingSpinner />;
  return (
    <div className="car-model-layout">
      {/* Pure UI rendering */}
    </div>
  );
};
```

#### Higher-Order Components (HOCs) for Location
```jsx
// Location-aware HOC for regional pricing
const withLocationPricing = (WrappedComponent) => {
  return function LocationPricingComponent(props) {
    const { city, state } = useLocation();
    const taxCalculations = calculateCarRTOTax(props.carPrice, city, state);
    
    return <WrappedComponent {...props} locationPricing={taxCalculations} />;
  };
};
```

#### Custom Hooks Pattern
```jsx
// Car data management hook
const useCarData = (brand, model, variant) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    carService.getCarDetails(brand, model, variant)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [brand, model, variant]);
  
  return { data, loading, error, refetch: () => fetchData() };
};

// Location detection hook
const useLocationDetection = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    detectUserLocation().then(setLocation);
  }, []);
  
  return { location, loading, updateLocation: setLocation };
};
```

### State Management Patterns

#### Context API for Global State
```jsx
// Location Context
const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  return (
    <LocationContext.Provider value={{
      userLocation,
      selectedCity,
      setUserLocation,
      setSelectedCity
    }}>
      {children}
    </LocationContext.Provider>
  );
};
```

#### URL State Management
```jsx
// Synchronized URL and component state
const useURLState = (paramName, defaultValue) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const value = searchParams.get(paramName) || defaultValue;
  
  const setValue = useCallback((newValue) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramName, newValue);
    router.push(`?${params.toString()}`);
  }, [router, searchParams, paramName]);
  
  return [value, setValue];
};
```

### API Design Patterns

#### Service Layer Architecture
```jsx
// Base API service
class BaseAPIService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.client = apiClient;
  }
  
  async get(endpoint, params = {}) {
    return this.client.get(`${this.baseURL}${endpoint}`, { params });
  }
  
  async post(endpoint, data) {
    return this.client.post(`${this.baseURL}${endpoint}`, data);
  }
}

// Car service extending base service
class CarService extends BaseAPIService {
  constructor() {
    super('/api/cars');
  }
  
  async getCarsByBrand(brand) {
    return this.get(`/brand/${brand}`);
  }
  
  async getCarVariants(brand, model) {
    return this.get(`/variants`, { brand, model });
  }
}
```

#### Cache Layer Pattern
```jsx
// API response caching
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}
```

### UI/UX Design Patterns

#### Loading States Pattern
```jsx
// Skeleton loading for car listings
const CarCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 w-full rounded-lg mb-4"></div>
    <div className="bg-gray-300 h-6 w-3/4 rounded mb-2"></div>
    <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
  </div>
);

// Progressive loading pattern
const CarImageGallery = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };
  
  return (
    <div className="gallery-grid">
      {images.map((image, index) => (
        <div key={index} className="relative">
          {!loadedImages.has(index) && <ImageSkeleton />}
          <img
            src={image.url}
            alt={image.alt}
            onLoad={() => handleImageLoad(index)}
            className={`transition-opacity duration-300 ${
              loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      ))}
    </div>
  );
};
```

#### Responsive Design Patterns
```jsx
// Mobile-first responsive utilities
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('mobile');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1024) setBreakpoint('desktop');
      else if (width >= 768) setBreakpoint('tablet');
      else setBreakpoint('mobile');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};

// Adaptive component rendering
const CarSpecifications = ({ specs }) => {
  const breakpoint = useResponsive();
  
  if (breakpoint === 'mobile') {
    return <MobileSpecsAccordion specs={specs} />;
  }
  
  return <DesktopSpecsTable specs={specs} />;
};
```

### SEO & Performance Patterns

#### Metadata Generation Pattern
```jsx
// Dynamic metadata for car pages
export async function generateMetadata({ params }) {
  const { brand, model, variant } = params;
  const carData = await getCarData(brand, model, variant);
  
  return {
    title: `${carData.name} - Price, Specs & Reviews | Motor India`,
    description: `Get detailed information about ${carData.name}. Check price in your city, specifications, features, and user reviews.`,
    openGraph: {
      title: carData.name,
      description: carData.description,
      images: [carData.primaryImage],
      type: 'website',
    },
    alternates: {
      canonical: `/cars/${brand}/${model}/${variant}`,
    },
    keywords: [
      carData.name,
      brand,
      'car price',
      'car specifications',
      'car review',
      'India'
    ].join(', ')
  };
}
```

#### Image Optimization Pattern
```jsx
// Responsive image component with optimization
const OptimizedCarImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className = ""
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      className={`object-cover transition-all duration-300 ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
};
```

### Internationalization (i18n) Patterns

#### Multi-language Content Management
```jsx
// Language-aware content fetching
const useLocalizedContent = (contentType, slug) => {
  const { locale } = useRouter();
  const [content, setContent] = useState(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await wordpressService.getContent(
          contentType, 
          slug, 
          locale
        );
        setContent(data);
      } catch (error) {
        // Fallback to English if Hindi content not available
        if (locale === 'hi') {
          const fallbackData = await wordpressService.getContent(
            contentType, 
            slug, 
            'en'
          );
          setContent(fallbackData);
        }
      }
    };
    
    fetchContent();
  }, [contentType, slug, locale]);
  
  return content;
};

// Price formatting for Indian market
const formatIndianPrice = (price, locale = 'en-IN') => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (price >= 10000000) { // 1 crore
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) { // 1 lakh
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  
  return formatter.format(price);
};
```

### Error Handling & Fallback Patterns

#### Error Boundary Pattern
```jsx
class CarDataErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Car data error:', error, errorInfo);
    // Log to error tracking service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h3>Unable to load car information</h3>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

#### Graceful Degradation Pattern
```jsx
// Progressive enhancement for 360-degree views
const Car360View = ({ carId, fallbackImages }) => {
  const [supports360, setSupports360] = useState(false);
  
  useEffect(() => {
    // Check if browser supports required features
    const canSupport360 = 
      'ontouchstart' in window || 
      navigator.maxTouchPoints > 0;
    setSupports360(canSupport360);
  }, []);
  
  if (!supports360) {
    return <CarImageGallery images={fallbackImages} />;
  }
  
  return <Interactive360View carId={carId} />;
};
```

## Advanced Development Guidelines

### Code Organization Principles

#### Feature-Based Structure
```
/app/(vehicles)/cars/[brand]/[model]/
├── layout.jsx                 # Shared layout for model pages
├── page.jsx                   # Model overview page
├── components/                # Model-specific components
│   ├── ModelHeader.jsx
│   ├── VariantSelector.jsx
│   └── SpecificationTable.jsx
├── [variant]/                # Variant-specific pages
│   ├── page.jsx
│   ├── RTOPrice.jsx
│   └── components/
└── 360-view/                 # 360-degree view feature
    ├── page.jsx
    ├── exterior/
    └── interior/
```

#### Service Layer Organization
```
/lib/services/
├── carService.js             # Car data operations
├── wordpressService.js       # CMS content operations
├── locationService.js        # Location-based operations
├── pricingService.js         # RTO tax and pricing calculations
└── seoService.js            # SEO and sitemap generation
```

### Performance Optimization Patterns

#### Code Splitting Strategy
```jsx
// Dynamic imports for heavy components
const Car360Viewer = dynamic(
  () => import('../components/Car360Viewer'),
  {
    loading: () => <Car360ViewerSkeleton />,
    ssr: false // Client-side only for performance
  }
);

// Route-based code splitting
const CarComparison = dynamic(
  () => import('./comparison/CarComparison'),
  {
    loading: () => <ComparisonSkeleton />
  }
);
```

#### Data Fetching Optimization
```jsx
// Parallel data fetching pattern
export async function generateStaticParams() {
  const [brands, popularModels] = await Promise.all([
    carService.getAllBrands(),
    carService.getPopularModels()
  ]);
  
  return brands.flatMap(brand => 
    popularModels
      .filter(model => model.brand === brand.slug)
      .map(model => ({
        brand: brand.slug,
        model: model.slug
      }))
  );
}

// Incremental Static Regeneration (ISR)
export const revalidate = 3600; // Revalidate every hour

export async function getStaticProps({ params }) {
  try {
    const carData = await carService.getCarDetails(
      params.brand, 
      params.model, 
      params.variant
    );
    
    return {
      props: { carData },
      revalidate: 3600,
      notFound: !carData
    };
  } catch (error) {
    return {
      notFound: true
    };
  }
}
```

### Security & Data Validation Patterns

#### Input Validation Pattern
```jsx
// Zod schema for car search validation
import { z } from 'zod';

const CarSearchSchema = z.object({
  brand: z.string().min(1).max(50),
  model: z.string().min(1).max(100).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().max(100000000)
  }).optional(),
  city: z.string().min(1).max(100),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid']).optional()
});

// Validation middleware
export const validateCarSearch = (searchParams) => {
  try {
    return CarSearchSchema.parse(searchParams);
  } catch (error) {
    throw new ValidationError('Invalid search parameters', error.issues);
  }
};
```

#### API Security Pattern
```jsx
// Rate limiting for API endpoints
import rateLimit from 'express-rate-limit';

const createRateLimiter = (windowMs, max) => 
  rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });

// Different limits for different endpoints
export const searchLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const pricingLimiter = createRateLimiter(60 * 1000, 60); // 60 requests per minute
```

### Testing Patterns

#### Component Testing Strategy
```jsx
// Test utilities for car components
export const createCarTestData = (overrides = {}) => ({
  id: 'test-car-1',
  brand: 'Test Brand',
  model: 'Test Model',
  variant: 'Test Variant',
  price: 1000000,
  specifications: {
    engine: '1.5L',
    fuelType: 'petrol',
    transmission: 'manual'
  },
  ...overrides
});

// Custom render with providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    initialLocation = null,
    ...renderOptions
  } = options;
  
  function Wrapper({ children }) {
    return (
      <LocationProvider initialLocation={initialLocation}>
        <Router>
          {children}
        </Router>
      </LocationProvider>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
```

#### API Testing Pattern
```jsx
// Mock car service for testing
export const createMockCarService = () => ({
  getCarDetails: jest.fn(),
  getCarsByBrand: jest.fn(),
  getCarVariants: jest.fn(),
  searchCars: jest.fn()
});

// Integration test example
describe('Car Details Page', () => {
  it('should display car information correctly', async () => {
    const mockCarService = createMockCarService();
    const testCarData = createCarTestData();
    
    mockCarService.getCarDetails.mockResolvedValue(testCarData);
    
    render(
      <CarDetailsPage 
        params={{ brand: 'test-brand', model: 'test-model' }}
        carService={mockCarService}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText(testCarData.model)).toBeInTheDocument();
    });
  });
});
```

This comprehensive guide provides all the architectural patterns, design principles, and implementation details needed for building and maintaining the Motor India automotive platform.