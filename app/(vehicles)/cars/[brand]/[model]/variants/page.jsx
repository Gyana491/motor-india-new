import Link from "next/link";
import Image from "next/image";
import ComparisonTable from "../components/ComparisonTable";

async function getModelVariants(brand, model) {
  try {
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, "-");
    const response = await fetch(
      `${process.env.BACKEND}/wp-json/api/car?slug=${slug}`,
      {
        next: { 
          revalidate: 300 // Revalidate every 5 minutes
        },
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return data.posts[0]?.variants || [];
  } catch (error) {
    console.error("Error fetching variants:", error);
    return [];
  }
}

export default async function VariantsPage({ params }) {
  const { brand, model } = params;

  // Fetch all variants data
  let allVariants = await getModelVariants(brand, model);

  // Group all variants by fuel type for display in cards
  const variantsByFuelType = allVariants.reduce((acc, variant) => {
    const fuelType = variant["fuel-type"] || "Other";
    if (!acc[fuelType]) {
      acc[fuelType] = [];
    }
    acc[fuelType].push(variant);
    return acc;
  }, {});

  // Get all unique fuel types for filtering
  const fuelTypes = [
    ...new Set(
      allVariants.filter((v) => v && v["fuel-type"]).map((v) => v["fuel-type"])
    ),
  ];

  // Get unique transmission types for filtering
  const transmissionTypes = [
    ...new Set(
      allVariants.filter((v) => v && v.transmission).map((v) => v.transmission)
    ),
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/cars/${brand}/${model}`}
          className="text-red-600 hover:underline flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to {model} Overview
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        {brand} {model} Variants
      </h1>

      {/* Variants by Fuel Type - Always show all variants */}
      {Object.entries(variantsByFuelType).length > 0 ? (
        Object.entries(variantsByFuelType).map(([fuelType, fuelVariants]) => (
          <div key={fuelType} className="mb-10 hidden">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              {fuelType} Variants
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fuelVariants.map((variant, index) => (
                <Link
                  key={index}
                  href={`/cars/${brand}/${model}/${
                    variant.variant_name?.toLowerCase().replace(/\s+/g, "-") ||
                    variant.name?.toLowerCase().replace(/\s+/g, "-")
                  }`}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold mb-2">
                    {variant["variant-name"] ||
                      variant.variant_name ||
                      variant.name ||
                      "Variant"}
                  </h3>
                  <div className="space-y-3">
                    <p className="text-red-600 font-bold text-xl">
                      ₹ {((variant.price || 0) / 100000).toFixed(2)} Lakh*
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {variant["fuel-type"] || "N/A"}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {variant.transmission || "N/A"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Mileage</p>
                        <p className="font-medium">
                          {variant.mileage || "Not Available"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Engine</p>
                        <p className="font-medium">
                          {variant.engine ||
                            variant["engine-type"] ||
                            "Standard"}
                        </p>
                      </div>
                    </div>

                    <button className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-xl">No variants available.</p>
        </div>
      )}

      {/* Client-side comparison table with filters */}
      <ComparisonTable
        allVariants={allVariants}
        fuelTypes={fuelTypes}
        transmissionTypes={transmissionTypes}
        brand={brand}
        model={model}
      />
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { brand, model } = params;

  return {
    title: `${brand} ${model} Variants, Prices & Specifications | Motor India`,
    description: `Compare all ${brand} ${model} variants with prices, specifications, features, mileage and more. Find the best ${model} variant for your needs.`,
    openGraph: {
      title: `${brand} ${model} - All Variants Comparison`,
      description: `Explore all ${brand} ${model} variants with detailed specifications, prices and features.`,
    },
  };
}
