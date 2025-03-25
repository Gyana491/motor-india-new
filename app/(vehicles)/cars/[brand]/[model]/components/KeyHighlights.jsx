export default function KeyHighlights({ keySpecs, variants, price, body_type, isOffRoader }) {
  // Helper function to display mileage with fallback
  function displayMileage(mileageValue) {
    return mileageValue || 'Not Available';
  }
  
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Key Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <span className="p-3 bg-red-100 text-red-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <h3 className="text-lg font-semibold">Performance</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Mileage</span>
              <span className="font-medium">{displayMileage(keySpecs.mileage)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Transmission</span>
              <span className="font-medium">
                {Array.isArray(variants) && variants.length > 0 && variants[0].transmission ? 
                  variants[0].transmission : 'Manual/Auto'}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <span className="p-3 bg-red-100 text-red-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h3 className="text-lg font-semibold">Price Range</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Starting</span>
              <span className="font-medium">{price.min_price_formatted}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Top End</span>
              <span className="font-medium">{price.max_price_formatted}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <span className="p-3 bg-red-100 text-red-600 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h3 className="text-lg font-semibold">Key Features</h3>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              <span>Multiple Airbags</span>
            </li>
            {isOffRoader && (
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                <span>4x4 Capability</span>
              </li>
            )}
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              <span>{body_type === "SUV" ? "High Ground Clearance" : "360° Camera"}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
} 