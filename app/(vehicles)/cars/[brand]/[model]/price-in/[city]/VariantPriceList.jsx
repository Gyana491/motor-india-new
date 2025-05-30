'use client';

import { useState } from "react";

export default function VariantPriceList({ variants, brand, model, city }) {
    const [selectedFuelType, setSelectedFuelType] = useState("All");
    const [selectedTransmission, setSelectedTransmission] = useState("All");
    const [expandedVariants, setExpandedVariants] = useState({});

    const toggleVariant = (variantId) => {
        setExpandedVariants(prev => ({
            ...prev,
            [variantId]: !prev[variantId]
        }));
    };

    // Get unique fuel types and transmission types
    const fuelTypes = ["All", ...new Set(variants.filter(v => v["fuel-type"]).map(v => v["fuel-type"]))];
    const transmissionTypes = ["All", ...new Set(variants.filter(v => v.transmission).map(v => v.transmission))];

    // Filter variants based on selected filters
    const filteredVariants = variants.filter(variant => {
        const matchesFuel = selectedFuelType === "All" || variant["fuel-type"] === selectedFuelType;
        const matchesTransmission = selectedTransmission === "All" || variant.transmission === selectedTransmission;
        return matchesFuel && matchesTransmission;
    });

    const formatPriceForDisplay = (price) => {
        if (typeof price !== 'number' || isNaN(price)) return 'N/A';
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    };
    
    return (
        <>
            {/* Fuel Type Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {fuelTypes.map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 font-medium ${
                            selectedFuelType === type
                                ? "text-red-600 border-b-2 border-red-600"
                                : "text-gray-600 hover:text-red-600"
                        }`}
                        onClick={() => setSelectedFuelType(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Transmission Filter */}
            <div className="flex gap-4 mb-6">
                {transmissionTypes.map((type) => (
                    <label key={type} className="inline-flex items-center gap-2">
                        <input
                            type="radio"
                            name="transmission"
                            value={type}
                            checked={selectedTransmission === type}
                            onChange={(e) => setSelectedTransmission(e.target.value)}
                            className="form-radio text-red-600"
                        />
                        <span className="text-gray-700">{type}</span>
                    </label>
                ))}
            </div>

            {/* Variants List */}
            <div className="space-y-4">
                {filteredVariants.map((variant, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200">
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleVariant(index)}
                        >
                            <div>
                                <h3 className="font-medium text-lg flex items-center gap-2">
                                    {variant["variant-name"] || variant.variant_name || variant.name}
                                    {index === 0 && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Base Model</span>}
                                </h3>
                                <div className="mt-2 flex items-baseline gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Ex-Showroom</p>
                                        <p className="font-semibold text-md">
                                            {formatPriceForDisplay(variant.price)}
                                        </p>
                                    </div>
                                    {variant.onRoadPriceDetails && (
                                        <div>
                                            <p className="text-sm text-gray-500">On-Road Price</p>
                                            <p className="font-bold text-md text-red-600">
                                                {formatPriceForDisplay(variant.onRoadPriceDetails.totalOnRoadPrice)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <svg
                                className={`w-6 h-6 transition-transform ${
                                    expandedVariants[index] ? "transform rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>

                        {expandedVariants[index] && (
                            <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                                <div className="flex gap-2 mb-3 text-xs">
                                    {variant["fuel-type"] && 
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                            {variant["fuel-type"]}
                                        </span>
                                    }
                                    {variant.transmission &&
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                            {variant.transmission}
                                        </span>
                                    }
                                </div>

                                {variant.onRoadPriceDetails ? (
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">Ex-Showroom Price</p>
                                            <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.exShowroomPrice)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">RTO</p>
                                            <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.rtoTax)}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">Insurance</p>
                                            <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.insurance)}</p>
                                        </div>
                                        {variant.onRoadPriceDetails.tcs > 0 && (
                                            <div className="flex justify-between">
                                                <p className="text-gray-600">TCS</p>
                                                <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.tcs)}</p>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <p className="text-gray-600">Others</p>
                                            <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.hypothecationCharges + variant.onRoadPriceDetails.fastagCharges)}</p>
                                        </div>
                                        
                                        {/* Optional Price - Placeholder if data becomes available */}
                                        {/* <div className="flex justify-between">
                                            <p className="text-gray-600">Optional</p>
                                            <p className="font-medium">{formatPriceForDisplay(variant.onRoadPriceDetails.optionalCharges || 0)}</p>
                                        </div> */}

                                        <div className="pt-3 mt-3 border-t border-dashed">
                                            <div className="flex justify-between items-center">
                                                <p className="text-gray-700 font-semibold">On-Road Price in {city}:</p>
                                                <p className="text-lg font-bold text-red-600">
                                                    {formatPriceForDisplay(variant.onRoadPriceDetails.totalOnRoadPrice)}*
                                                </p>
                                            </div>
                                            <div className="text-right mt-1">
                                                <button className="text-xs text-blue-600 hover:underline">Report Incorrect Price</button>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-dashed">
                                             <div className="flex justify-between items-center">
                                                <p className="text-gray-600">EMI: {formatPriceForDisplay(variant.onRoadPriceDetails.totalOnRoadPrice / 60)}/mo <span className="text-xs">(approx. for 5 years)</span></p>
                                                <button className="text-sm text-blue-600 hover:underline font-medium">EMI Calculator</button>
                                             </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-red-500 font-medium">Price details not available.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredVariants.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-xl">No variants available for the selected filters.</p>
                </div>
            )}
        </>
    );
}