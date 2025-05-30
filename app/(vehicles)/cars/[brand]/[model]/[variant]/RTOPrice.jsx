import { calculateCarOnRoadPrice } from '@/app/utils/calculateCarRTOTax';
import { cookies } from 'next/headers';

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(amount);
};


export default async function RTOPrice({ params, price }) {
  const cookieStore = cookies();
  const selectedState = (cookieStore.get('selectedState')?.value || 'maharashtra').toLowerCase();

  let slug;
  if (params) {
    const { brand, model, variant } = params;
    slug = `${brand}-${model}-${variant}`.toLowerCase().replace(/\s+/g, '-');
  } else if (price?.slug) {
    slug = price.slug;
  } else {
    throw new Error('Either params or price.slug must be provided');
  }

  try {
    const priceDetails = await calculateCarOnRoadPrice(slug, selectedState);

    return (
      <div className="rto-price-details p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Price Breakup in {selectedState.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Ex-showroom Price:</span>
            <span>{formatPrice(priceDetails.exShowroomPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>RTO Tax:</span>
            <span>{formatPrice(priceDetails.rtoTax)}</span>
          </div>          <div className="flex justify-between">
            <span>Insurance:</span>
            <span>{formatPrice(priceDetails.insurance)}</span>
          </div>          {priceDetails.tcs > 0 && (
            <div className="flex justify-between">
              <span>TCS (1%):</span>
              <span>{formatPrice(priceDetails.tcs)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Hypothecation Charges:</span>
            <span>{formatPrice(priceDetails.hypothecationCharges)}</span>
          </div>
          <div className="flex justify-between">
            <span>FASTag:</span>
            <span>{formatPrice(priceDetails.fastagCharges)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>On-Road Price:</span>
            <span>{formatPrice(priceDetails.totalOnRoadPrice)}</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="text-red-500">Error calculating price: {error.message}</div>;
  }
}

