import SearchClient from './components/SearchClient';

async function fetchServerResults(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/wp-json/wp/v2/car?search=${encodeURIComponent(query)}&_fields=id,title,slug,acf,featured_media&per_page=50`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('SSR search fetch failed:', e);
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  const searchQuery = (searchParams?.q || searchParams?.search || '').toString();
  const initialResults = await fetchServerResults(searchQuery);
  return (
    <SearchClient initialQuery={searchQuery} initialResults={initialResults} />
  );
}

