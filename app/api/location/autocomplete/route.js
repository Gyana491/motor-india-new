import { NextResponse } from 'next/server';
import getAllCities from '@/data/getAllCities';

// Cache cities data
let citiesCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

async function getCachedCities() {
    const now = Date.now();
    if (!citiesCache || now - lastCacheTime > CACHE_DURATION) {
        try {
            citiesCache = await getAllCities();
            lastCacheTime = now;
        } catch (error) {
            console.error('Error loading cities:', error);
            return [];
        }
    }
    return citiesCache;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const term = searchParams.get('term')?.toLowerCase().trim() || '';

        if (!term || term.length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        const cities = await getCachedCities();
        
        // Optimize search with early termination and scoring
        const results = [];
        const seen = new Set(); // Avoid duplicates
        const termWords = term.split(/\s+/);

        for (const city of cities) {
            if (results.length >= 10) break; // Early termination

            const cityKey = `${city.title}-${city.state}`;
            if (seen.has(cityKey)) continue;

            // Quick initial check
            const cityLower = city.title.toLowerCase();
            const stateLower = city.state.toLowerCase();
            
            let matches = false;
            // Exact match gets highest priority
            if (cityLower === term || stateLower === term) {
                matches = true;
            } 
            // Starts with gets second priority
            else if (cityLower.startsWith(term) || stateLower.startsWith(term)) {
                matches = true;
            }
            // Multi-word search gets third priority
            else if (termWords.every(word => 
                cityLower.includes(word) || stateLower.includes(word)
            )) {
                matches = true;
            }

            if (matches) {
                seen.add(cityKey);
                results.push({
                    id: city.ID,
                    city: city.title,
                    state: city.state,
                    isUrban: city.isUrban,
                    isPopular: city.isPopular,
                    longitude: city.longitude,
                    latitude: city.latitude,

                });
            }
        }

        return NextResponse.json({
            suggestions: results,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Autocomplete error:', error);
        return NextResponse.json(
            { error: 'Internal server error', suggestions: [] },
            { status: 500 }
        );
    }
}