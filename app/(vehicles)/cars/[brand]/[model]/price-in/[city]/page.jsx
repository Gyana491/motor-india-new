import Link from "next/link";
import { calculateCarOnRoadPrice } from "@/app/utils/calculateCarRTOTax";
import VariantPriceList from "./VariantPriceList";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
    const { brand, model, city } = params;
    const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
    const capitalizedModel = model.charAt(0).toUpperCase() + model.slice(1);
    const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

    const title = `${capitalizedBrand} ${capitalizedModel} On-Road Price in ${capitalizedCity} - Variants, Ex-Showroom Price`;
    const description = `Get the latest on-road price for ${capitalizedBrand} ${capitalizedModel} in ${capitalizedCity}. Includes ex-showroom price, RTO, insurance for all variants. Check out the best deals and offers.`;

    return {
        title,
        description,
        keywords: [`${brand} ${model}`, `on-road price`, city, `${brand} ${model} price ${city}`, 'car price', 'ex-showroom price', 'variants'],
        openGraph: {
            title,
            description,
            images: [
                {
                    url: '/assets/motor-india-logo.png', // Replace with a relevant image if available
                    width: 800,
                    height: 600,
                    alt: `${capitalizedBrand} ${capitalizedModel} in ${capitalizedCity}`,
                },
            ],
            siteName: 'Motor India', // Replace with your actual site name
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/assets/motor-india-logo.png'], // Replace with a relevant image if available
        },
    };
}

function ErrorBoundary({ error }) {
    return (
        <div className="text-center py-8">
            <h2 className="text-red-600 text-xl font-semibold mb-2">Something went wrong!</h2>
            <p className="text-gray-600">{error.message}</p>
        </div>
    );
}

function Loading() {
    return (
        <div className="text-center py-8">
            <p className="text-gray-600">Loading variant prices...</p>
        </div>
    );
}

async function getModelVariants(brand, model) {
    try {
        const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, "-");
        const response = await fetch(
            `${process.env.BACKEND}/wp-json/api/car?slug=${slug}`,
            { cache: "no-store" }
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

async function getState(city) {
    try {
        const response = await fetch(`${process.env.RTO_API}/wp-json/api/v1/cities?name=${city}`);
        const data = await response.json();
        return data ? data.state.toLowerCase() : 'maharashtra';
    } catch (error) {
        console.error('Error fetching state:', error);
        return 'maharashtra';
    }
}

export default async function onRoadPricePage({ params }) {
    const { brand, model, city } = params;
    const variants = await getModelVariants(brand, model);
    const state = await getState(city);

    // Calculate on-road prices for all variants
    const variantsWithPrices = await Promise.all(
        variants.map(async (variant) => {
            try {
                const slug = variant.slug || `${brand}-${model}-${variant["variant-name"] || variant.variant_name || variant.name}`.toLowerCase().replace(/\s+/g, "-");
                const onRoadPriceDetails = await calculateCarOnRoadPrice(slug, state);
                return {
                    ...variant,
                    onRoadPriceDetails
                };
            } catch (error) {
                console.error(`Error calculating on-road price for variant:`, error);
                return {
                    ...variant,
                    onRoadPriceDetails: null
                };
            }
        })
    );    try {
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
                </div>                <h1 className="text-3xl font-bold mb-6">
                    {brand.charAt(0).toUpperCase() + brand.slice(1)} {model.charAt(0).toUpperCase() + model.slice(1)} On-Road Price in {city.charAt(0).toUpperCase() + city.slice(1)}
                </h1>

                <div className="prose max-w-none mb-6">
                    <p>
                        Looking for the most accurate and up-to-date on-road price for the {brand} {model} in {city}? You&apos;ve come to the right place!
                        We provide a comprehensive breakdown of the {brand} {model} price in {city}, including ex-showroom costs, RTO charges, insurance, and other applicable taxes.
                        Understanding the on-road price is crucial before making your car purchase, and we aim to make this information easily accessible for you.
                    </p>
                    <p>
                        The {brand} {model} is a popular choice for many car buyers, known for its features, performance, and style.
                        Prices can vary across different cities due to local taxes and charges. Our detailed price list for {city} will help you compare the on-road price of different {brand} {model} variants.
                        Explore the ex-showroom price and the final on-road cost to plan your budget effectively.
                    </p>
                    <p>
                        Stay informed about the latest {brand} {model} on-road price in {city}. We regularly update our prices to ensure you have the most current information.
                        Whether you&apos;re considering the base model or a top-end variant, find all the pricing details you need right here.
                        Don&apos;t forget to check out available financing options and offers that might be applicable in {city} for your new {brand} {model}.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4">{brand.charAt(0).toUpperCase() + brand.slice(1)} {model.charAt(0).toUpperCase() + model.slice(1)} Price Range in {city.charAt(0).toUpperCase() + city.slice(1)}</h2>
                    {variantsWithPrices.length > 0 && (                        <div className="text-lg">
                            <p>
                                The {brand.charAt(0).toUpperCase() + brand.slice(1)} {model.charAt(0).toUpperCase() + model.slice(1)} price in {city.charAt(0).toUpperCase() + city.slice(1)} starts from{' '}
                                <span className="font-semibold">₹{(Math.min(...variantsWithPrices.map(v => v.onRoadPriceDetails?.exShowroomPrice || 0)) / 100000).toFixed(2)} Lakh</span>{' '}
                                and goes up to{' '}
                                <span className="font-semibold">₹{(Math.max(...variantsWithPrices.map(v => v.onRoadPriceDetails?.exShowroomPrice || 0)) / 100000).toFixed(2)} Lakh</span>{' '}
                                (Ex-showroom Price).
                            </p>
                            <p className="mt-2 text-gray-600">
                                On-road prices may vary based on RTO charges, insurance, and other local taxes applicable in {city.charAt(0).toUpperCase() + city.slice(1)}.
                            </p>
                        </div>
                    )}
                </div>

                <Suspense fallback={<Loading />}>
                    <VariantPriceList
                        variants={variantsWithPrices}
                        brand={brand}
                        model={model}
                        city={city}
                    />
                </Suspense>
            </main>
        );
    } catch (error) {
        return <ErrorBoundary error={error} />;
    }
}