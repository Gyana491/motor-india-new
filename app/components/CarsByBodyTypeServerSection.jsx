import Link from 'next/link'
import Image from 'next/image'
import { getCarsByBodyType, getCarBodyTypes } from '@/lib/services/carService'

const CarCard = ({ car }) => (
    <Link
        href={`/cars/${car.brandSlug}/${car.slug}`}
        className="group block"
    >
        <div className="bg-white rounded-xl border border-slate-200 hover:border-red-600 hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
            {/* Car Image */}
            <div className="relative h-48 overflow-hidden">
                {car.featuredImageUrl ? (
                    <Image
                        src={car.featuredImageUrl}
                        alt={`${car.name} image`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 group-hover:bg-red-50 transition-colors duration-300">
                        <svg className="w-16 h-16 text-slate-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2-2H7a2 2 0 01-2-2V8z" />
                        </svg>
                    </div>
                )}

                {/* Body Type Badge */}
                {car.bodyType && (
                    <span className="absolute top-3 left-3 bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold rounded-full shadow-sm">
                        {car.bodyType}
                    </span>
                )}
            </div>

            {/* Car Information */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
                        {car.name}
                    </h3>
                    {car.brand && (
                        <span className="text-sm text-slate-500 font-medium">
                            {car.brand}
                        </span>
                    )}
                </div>

                {car.priceRange && (
                    <p className="text-red-600 font-semibold text-sm mb-2">
                        ₹ {car.priceRange}
                    </p>
                )}

                {car.excerpt && (
                    <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                        {car.excerpt}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                    {car.fuelType && (
                        <span className="bg-slate-100 px-2 py-1 rounded-full">
                            {car.fuelType}
                        </span>
                    )}
                    <span className="text-red-600 font-medium">
                        View Details →
                    </span>
                </div>
            </div>
        </div>
    </Link>
)

const BodyTypeSection = ({ bodyType, cars }) => (
    <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-800">
                {bodyType.name}
                {bodyType.count > 0 && (
                    <span className="text-xs sm:text-sm text-slate-500 ml-2">
                        ({bodyType.count} cars)
                    </span>
                )}
            </h3>
            <Link
                href={`/cars?body_type=${bodyType.slug}`}
                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
            >
                View All
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>

        {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cars.slice(0, 4).map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        ) : (
            <div className="text-center py-8">
                <div className="text-slate-500 text-lg mb-2">
                    No {bodyType.name.toLowerCase()} cars available
                </div>
                <p className="text-slate-400 text-sm">
                    Check back later for new additions
                </p>
            </div>
        )}
    </div>
)

const CarsByBodyTypeServerSection = async () => {
    try {
        // Fetch body types
        const bodyTypes = await getCarBodyTypes()
        
        if (!bodyTypes || bodyTypes.length === 0) {
            return null
        }

        // Fetch cars for each body type (limit to top 3 body types for performance)
        const topBodyTypes = bodyTypes.slice(0, 3)
        const carsByBodyType = {}

        await Promise.all(
            topBodyTypes.map(async (bodyType) => {
                try {
                    const cars = await getCarsByBodyType(bodyType.slug, 4)
                    carsByBodyType[bodyType.id] = cars
                } catch (error) {
                    console.error(`Error fetching cars for ${bodyType.name}:`, error)
                    carsByBodyType[bodyType.id] = []
                }
            })
        )

        return (
            <section aria-labelledby="cars-by-body-type-title">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="cars-by-body-type-title" className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                        Cars by Body Type
                    </h2>
                    <Link
                        href="/cars"
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 hover:underline"
                    >
                        View All Cars
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>

                <div className="space-y-8">
                    {topBodyTypes.map(bodyType => (
                        <BodyTypeSection
                            key={bodyType.id}
                            bodyType={bodyType}
                            cars={carsByBodyType[bodyType.id] || []}
                        />
                    ))}
                </div>
            </section>
        )
    } catch (error) {
        console.error('Error in CarsByBodyTypeServerSection:', error)
        return null
    }
}

export default CarsByBodyTypeServerSection