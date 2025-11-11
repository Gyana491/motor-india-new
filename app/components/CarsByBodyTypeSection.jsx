'use client'

import { useState, useEffect } from 'react'
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
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 transition-colors duration-300 line-clamp-1">
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

const BodyTypeFilter = ({ bodyTypes, selectedType, onTypeSelect, loading }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Filter by Body Type</h3>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onTypeSelect('all')}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === 'all'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                All Cars
            </button>
            {bodyTypes.map(type => (
                <button
                    key={type.id}
                    onClick={() => onTypeSelect(type.slug)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedType === type.slug
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {type.name}
                    {type.count > 0 && (
                        <span className="ml-1.5 text-xs opacity-75">
                            ({type.count})
                        </span>
                    )}
                </button>
            ))}
        </div>
    </div>
)

const CarsByBodyTypeSection = () => {
    const [bodyTypes, setBodyTypes] = useState([])
    const [selectedBodyType, setSelectedBodyType] = useState('all')
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch body types on component mount
    useEffect(() => {
        const fetchBodyTypes = async () => {
            try {
                const types = await getCarBodyTypes()
                setBodyTypes(types)
            } catch (err) {
                console.error('Error fetching body types:', err)
                setError('Failed to load body types')
            }
        }

        fetchBodyTypes()
    }, [])

    // Fetch cars when body type changes
    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true)
            setError(null)

            try {
                if (selectedBodyType === 'all') {
                    // For "all cars", we'll show a mix from different body types
                    // Get cars from the first few body types
                    const allCarsPromises = bodyTypes.slice(0, 3).map(type =>
                        getCarsByBodyType(type.slug, 4)
                    )

                    if (allCarsPromises.length > 0) {
                        const carsArrays = await Promise.all(allCarsPromises)
                        const combinedCars = carsArrays.flat()
                        // Shuffle and limit to 12 cars
                        const shuffled = combinedCars.sort(() => 0.5 - Math.random())
                        setCars(shuffled.slice(0, 12))
                    } else {
                        setCars([])
                    }
                } else {
                    const filteredCars = await getCarsByBodyType(selectedBodyType, 12)
                    setCars(filteredCars)
                }
            } catch (err) {
                console.error('Error fetching cars:', err)
                setError('Failed to load cars')
                setCars([])
            } finally {
                setLoading(false)
            }
        }

        if (bodyTypes.length > 0 || selectedBodyType === 'all') {
            fetchCars()
        }
    }, [selectedBodyType, bodyTypes])

    if (error && cars.length === 0) {
        return (
            <section aria-labelledby="cars-by-body-type-title">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="cars-by-body-type-title" className="text-3xl font-bold text-slate-800">Cars by Body Type</h2>
                </div>
                <div className="text-center py-12">
                    <div className="text-slate-500 text-lg mb-2">
                        {error}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-red-600 hover:text-red-700 font-semibold"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section aria-labelledby="cars-by-body-type-title">
            <div className="flex justify-between items-center mb-6">
                <h2 id="cars-by-body-type-title" className="text-3xl font-bold text-slate-800">Cars by Body Type</h2>
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

            {/* Body Type Filter */}
            <BodyTypeFilter
                bodyTypes={bodyTypes}
                selectedType={selectedBodyType}
                onTypeSelect={setSelectedBodyType}
                loading={loading}
            />

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full animate-pulse">
                            <div className="h-48 bg-slate-200"></div>
                            <div className="p-4">
                                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                                <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cars Grid */}
            {!loading && cars.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cars.map(car => (
                        <CarCard key={car.id} car={car} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && cars.length === 0 && selectedBodyType !== 'all' && (
                <div className="text-center py-12">
                    <div className="text-slate-500 text-lg mb-2">
                        No {selectedBodyType} cars found
                    </div>
                    <button
                        onClick={() => setSelectedBodyType('all')}
                        className="text-red-600 hover:text-red-700 font-semibold"
                    >
                        View all cars
                    </button>
                </div>
            )}

            {/* Show more link for specific body types */}
            {!loading && cars.length > 0 && selectedBodyType !== 'all' && (
                <div className="text-center mt-8">
                    <Link
                        href={`/cars?body_type=${selectedBodyType}`}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
                    >
                        View More {bodyTypes.find(type => type.slug === selectedBodyType)?.name} Cars
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            )}
        </section>
    )
}

export default CarsByBodyTypeSection