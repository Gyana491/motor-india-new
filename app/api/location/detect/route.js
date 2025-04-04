import { NextResponse } from 'next/server';
import getAllCities from '@/data/getAllCities';

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const latitude = parseFloat(searchParams.get('latitude'));
        const longitude = parseFloat(searchParams.get('longitude'));

        if (isNaN(latitude) || isNaN(longitude)) {
            return NextResponse.json(
                { error: 'Invalid coordinates' },
                { status: 400 }
            );
        }

        const cities = await getAllCities();
        let nearestCity = null;
        let shortestDistance = Infinity;

        for (const city of cities) {
            const distance = calculateDistance(
                latitude,
                longitude,
                parseFloat(city.latitude),
                parseFloat(city.longitude)
            );

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestCity = city;
            }
        }

        if (!nearestCity) {
            return NextResponse.json(
                { error: 'No cities found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            city: nearestCity.title,
            state: nearestCity.state,
            distance: Math.round(shortestDistance * 100) / 100, // Round to 2 decimal places
            coordinates: {
                latitude: nearestCity.latitude,
                longitude: nearestCity.longitude
            }
        });

    } catch (error) {
        console.error('Location detection error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
