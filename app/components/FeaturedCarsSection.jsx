'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

const BodyTypeFilter = ({ bodyTypes, selectedType, onTypeSelect }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Filter by Body Type</h3>
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onTypeSelect('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedType === 'all'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600'
                }`}
            >
                All Cars
            </button>
            {bodyTypes.map(type => (
                <button
                    key={type.id}
                    onClick={() => onTypeSelect(type.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedType === type.slug
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-red-600 hover:text-red-600'
                    }`}
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

const FeaturedCarsSection = ({ featuredCars, bodyTypes }) => {
    const [selectedBodyType, setSelectedBodyType] = useState('all')
    
    // Filter cars based on selected body type
    const filteredCars = selectedBodyType === 'all' 
        ? featuredCars 
        : featuredCars.filter(car => 
            car.bodyType?.toLowerCase() === selectedBodyType.toLowerCase()
        )
    
    if (!featuredCars || featuredCars.length === 0) {
        return null
    }
    
    return (
        <section aria-labelledby="featured-cars-title">
            <div className="flex justify-between items-center mb-6">
                <h2 id="featured-cars-title" className="text-3xl font-bold text-slate-800">Featured Cars</h2>
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
            />
            
            {/* Cars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
            
            {/* Show message if no cars match filter */}
            {filteredCars.length === 0 && selectedBodyType !== 'all' && (
                <div className="text-center py-12">
                    <div className="text-slate-500 text-lg mb-2">
                        No {selectedBodyType} cars found
                    </div>
                    <button
                        onClick={() => setSelectedBodyType('all')}
                        className="text-red-600 hover:text-red-700 font-semibold"
                    >
                        View all featured cars
                    </button>
                </div>
            )}
        </section>
    )
}

export default FeaturedCarsSection