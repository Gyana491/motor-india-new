import Link from "next/link";
import dynamic from "next/dynamic";

// Import the ColorCarousel component with dynamic loading and no SSR
const ColorCarousel = dynamic(() => import("../components/ColorCarousel"), {
  ssr: false,
});

async function getModelColors(brand, model) {
  try {
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, "-");
    const response = await fetch(
      `${process.env.BACKEND}/wp-json/api/car?slug=${slug}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    return data.posts[0]?.images?.colors || {};
  } catch (error) {
    console.error("Error fetching colors:", error);
    return {};
  }
}

export default async function ColorsPage({ params }) {
  const { brand, model } = params;
  const colorData = await getModelColors(brand, model);

  // Convert object to array for easier handling
  const colors = Object.values(colorData)
    .filter((color) => color && color.url && color.alt)
    .map((color) => ({
      name: color.alt,
      hexcode: color.hexcode || "#CCCCCC",
      url: color.url,
    }));

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
        {brand} {model} Colors
      </h1>

      {colors.length > 0 ? (
        <>
          {/* Color Carousel Section */}
          <ColorCarousel colors={colors} brand={brand} model={model} />

          {/* Color Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Color Information</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="mb-4">
                The {brand} {model} is available in {colors.length} stunning
                colors to suit your personal style and preferences.
              </p>

              <p className="mb-6">
                Color availability may vary by variant and location. Please
                check with your nearest dealership for the most up-to-date
                information on color options and any associated costs.
              </p>

              {/* Available Colors Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: color.hexcode }}
                    ></div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            Color information for {brand} {model} is currently unavailable.
          </p>
          <Link
            href={`/cars/${brand}/${model}`}
            className="text-red-600 hover:underline mt-4 inline-block"
          >
            Return to {model} Overview
          </Link>
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ params }) {
  const { brand, model } = params;

  return {
    title: `${brand} ${model} Colors - All Color Options | Motor India`,
    description: `Explore all ${brand} ${model} color options with images. View the ${model} in different colors before making your purchase decision.`,
    openGraph: {
      title: `${brand} ${model} - All Color Options`,
      description: `See the ${brand} ${model} in all available colors with high-quality images.`,
    },
  };
}
