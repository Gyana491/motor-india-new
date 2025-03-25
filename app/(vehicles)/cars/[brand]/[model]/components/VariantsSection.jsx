'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function VariantsSection({ variants, brand, model }) {
  const [fuelFilter, setFuelFilter] = useState('all');
  const [transmissionFilter, setTransmissionFilter] = useState('all');
  
  // Extract unique fuel types and transmissions
  const fuelTypes = useMemo(() => {
    return ['all', ...new Set(variants
      .filter(v => v && v['fuel-type'])
      .map(v => v['fuel-type']))];
  }, [variants]);
  
  const transmissionTypes = useMemo(() => {
    return ['all', ...new Set(variants
      .filter(v => v && v.transmission)
      .map(v => v.transmission))];
  }, [variants]);
  
  // Filter variants based on selected filters
  const filteredVariants = useMemo(() => {
    return variants.filter(variant => {
      const matchesFuel = fuelFilter === 'all' || variant['fuel-type'] === fuelFilter;
      const matchesTransmission = transmissionFilter === 'all' || variant.transmission === transmissionFilter;
      return matchesFuel && matchesTransmission;
    });
  }, [variants, fuelFilter, transmissionFilter]);
  
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Popular Variants</h2>
        <Link 
          href={`/cars/${brand}/${model}/variants`}
          className="text-red-600 hover:text-red-700"
        >
          View All Variants
        </Link>
      </div>
      
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Fuel Type</label>
          <select 
            value={fuelFilter}
            onChange={(e) => setFuelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {fuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>
                {fuel === 'all' ? 'All Fuel Types' : fuel}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Transmission</label>
          <select 
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {transmissionTypes.map(transmission => (
              <option key={transmission} value={transmission}>
                {transmission === 'all' ? 'All Transmissions' : transmission}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Variants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariants.length > 0 ? (
          filteredVariants
            .slice(0, 6)
            .map((variant, index) => (
              <Link
                key={index}
                href={`/cars/${brand}/${model}/${(variant.variant_name).toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{variant['variant-name'] || 'Variant'}</h3>
                <div className="space-y-2">
                  <p className="text-red-600 font-bold">₹ {((variant.price || 0) / 100000).toFixed(2)} Lakh*</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {variant['fuel-type'] || 'N/A'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                      {variant.transmission || 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mileage: {variant.mileage || 'Not Available'}
                  </p>
                </div>
              </Link>
            ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No variants match your selected filters.</p>
          </div>
        )}
      </div>
    </section>
  );
} 