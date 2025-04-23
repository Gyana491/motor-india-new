"use client";

import { useState } from "react";

export default function VariantFilters({
  fuelTypes,
  transmissionTypes,
  initialVariants,
  onFilterChange,
}) {
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedPriceSort, setSelectedPriceSort] = useState("all");

  const handleFilterChange = (filterType, value) => {
    // Update the local state based on filter type
    if (filterType === "fuelType") {
      setSelectedFuelType(value);
    } else if (filterType === "transmission") {
      setSelectedTransmission(value);
    } else if (filterType === "price") {
      setSelectedPriceSort(value);
    }

    // Apply filters to variants
    let filteredVariants = [...initialVariants];

    // Apply fuel type filter
    if ((filterType === "fuelType" ? value : selectedFuelType) !== "all") {
      filteredVariants = filteredVariants.filter(
        (variant) =>
          variant["fuel-type"] ===
          (filterType === "fuelType" ? value : selectedFuelType)
      );
    }

    // Apply transmission filter
    if (
      (filterType === "transmission" ? value : selectedTransmission) !== "all"
    ) {
      filteredVariants = filteredVariants.filter(
        (variant) =>
          variant.transmission ===
          (filterType === "transmission" ? value : selectedTransmission)
      );
    }

    // Apply price sorting
    if ((filterType === "price" ? value : selectedPriceSort) !== "all") {
      if ((filterType === "price" ? value : selectedPriceSort) === "low") {
        filteredVariants.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (
        (filterType === "price" ? value : selectedPriceSort) === "high"
      ) {
        filteredVariants.sort((a, b) => (b.price || 0) - (a.price || 0));
      }
    }

    // Send the filtered variants back to the parent component
    onFilterChange(filteredVariants);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-8">
      <h2 className="text-lg font-semibold mb-4">Filter Comparison Table</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fuel Type</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedFuelType}
            onChange={(e) => handleFilterChange("fuelType", e.target.value)}
          >
            <option value="all">All Fuel Types</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Transmission
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedTransmission}
            onChange={(e) => handleFilterChange("transmission", e.target.value)}
          >
            <option value="all">All Transmissions</option>
            {transmissionTypes.map((transmission) => (
              <option key={transmission} value={transmission}>
                {transmission}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Price Range
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedPriceSort}
            onChange={(e) => handleFilterChange("price", e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
