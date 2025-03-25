## Motor India Frontend - API & Data Fetching Patterns

### Data Fetching in Server Components
```jsx
// Fetch data with revalidation
export async function getModelDetails(brand, model) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API}/wp-json/api/cars/${brand}/${model}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching model details:', error);
    return null;
  }
}
```

### API Route Handlers
```jsx
// app/api/vehicle-info/route.js
export async function POST(request) {
  try {
    const body = await request.json();
    const { vehicleNumber } = body;
    
    if (!vehicleNumber) {
      return Response.json(
        { error: 'Vehicle number is required' },
        { status: 400 }
      );
    }
    
    // External API integration for vehicle lookup
    const data = await fetchVehicleInfo(vehicleNumber);
    
    return Response.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Client-Side API Calls
```jsx
"use client"
import { useState } from 'react';
import toast from 'react-hot-toast';

const ClientComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async (params) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result.data);
      toast.success('Data loaded successfully');
      return result.data;
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Component JSX
};
```

### Dynamic Route Metadata Generation
```jsx
// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { brand, model } = params;
  const data = await getModelDetails(brand, model);
  
  if (!data || !data.posts || data.posts.length === 0) {
    return {
      title: 'Vehicle Not Found',
      description: 'The requested vehicle information could not be found'
    };
  }
  
  const modelData = data.posts[0];
  const { title, excerpt, featured_image } = modelData;
  
  return {
    title: title || `${brand} ${model} - Motor India`,
    description: excerpt || `Explore ${brand} ${model} specifications, features, variants, colors, and more at Motor India.`,
    openGraph: {
      images: [featured_image?.url || '/assets/place-holder.jpg'],
    },
  };
}
```