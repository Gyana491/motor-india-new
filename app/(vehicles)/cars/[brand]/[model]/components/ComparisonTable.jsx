"use client";

import { useState } from "react";
import Link from "next/link";
import VariantFilters from "./VariantFilters";

export default function ComparisonTable({
  allVariants,
  fuelTypes,
  transmissionTypes,
  brand,
  model,
}) {
  const [filteredVariants, setFilteredVariants] = useState(allVariants);

  const handleFilterChange = (newFilteredVariants) => {
    setFilteredVariants(newFilteredVariants);
  };

  return (
    <>
      {/* Client Component for Filters - Only affects comparison table */}
      <VariantFilters
        fuelTypes={fuelTypes}
        transmissionTypes={transmissionTypes}
        initialVariants={allVariants}
        onFilterChange={handleFilterChange}
      />

      {/* Comparison Table - Only show if variants exist */}
      {filteredVariants.length > 0 ? (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-6">Variant Comparison</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left border-b">Variant</th>
                  <th className="py-3 px-4 text-left border-b">Price</th>
                  <th className="py-3 px-4 text-left border-b">Fuel Type</th>
                  <th className="py-3 px-4 text-left border-b">Transmission</th>
                  <th className="py-3 px-4 text-left border-b">Mileage</th>
                </tr>
              </thead>
              <tbody>
                {filteredVariants.map((variant, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-3 px-4 border-b">
                      {variant["variant-name"] ||
                        variant.variant_name ||
                        variant.name ||
                        "Variant"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      ₹ {((variant.price || 0) / 100000).toFixed(2)} Lakh*
                    </td>
                    <td className="py-3 px-4 border-b">
                      {variant["fuel-type"] || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {variant.transmission || "N/A"}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {variant.mileage || "Not Available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">
            No variants match your filters. Try different filter options.
          </p>
          <button
            onClick={() => setFilteredVariants(allVariants)}
            className="text-red-600 mt-4 inline-block font-semibold"
          >
            Reset all filters
          </button>
        </div>
      )}
    </>
  );
}
