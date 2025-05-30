async function getVariantDetails(slug) {
    const response = await fetch(`https://cdn.motorindia.in/wp-json/api/variant?slug=${slug}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch variant details: ${response.status}`);
    }

    return response.json();
}

// Standard RTO tax rates for different states
const RTO_TAX_RATES = {
    'Maharashtra': 0.11, // 11%
    'Delhi': 0.10, // 10%
    'Karnataka': 0.13, // 13%
    'Tamil Nadu': 0.13, // 13%
    'Gujarat': 0.12, // 12%
    // Add more states as needed
};

// Default tax rate if state is not found
const DEFAULT_TAX_RATE = 0.11; // 11%

// Utility function to calculate RTO price
async function calculateCarRTOPrice(slug, state = 'Maharashtra') {
    const variantDetails = await getVariantDetails(slug);
    const { price, attributes, insurance } = variantDetails;

    // Helper function to get attribute value by slug
    function getAttributeValue(attributeSlug) {
        const attr = attributes.find(a => a.attribute_slug === attributeSlug);
        return attr ? attr.attribute_values[0] : null;
    }

    const fuelType = getAttributeValue('pa_fuel-type');
    const engineSize = Number(getAttributeValue('pa_engine-size')) || 0;

    const tcsPercentage = 1;

    let rtoPercentage;

    switch (state.toLowerCase()) {
        case 'andhra-pradesh':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Electric vehicles are exempt
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 1000000 ? 12 : 14;
            } else {
                rtoPercentage = 12; // Default for other fuel types
            }
            break;
        case 'arunachal-pradesh':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Electric vehicles are exempt
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 500000 ? 4 : 6;
            } else {
                rtoPercentage = 4; // Default for other fuel types
            }
            break;
        case 'assam':
            if (fuelType === 'electric') {
                rtoPercentage = 4; // Lower rate for electric vehicles
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = 10;
            } else {
                rtoPercentage = 10; // Default for other fuel types
            }
            break;
        case 'bihar':
            if (fuelType === 'electric') {
                rtoPercentage = 4; // Electric vehicles
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 1000000 ? 7 : 9;
            } else {
                rtoPercentage = 7; // Default for other fuel types
            }
            break;
        case 'chhattisgarh':
            if (fuelType === 'electric') {
                rtoPercentage = 7; // Electric vehicles
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 1000000 ? 7 : 9;
            } else {
                rtoPercentage = 7; // Default for other fuel types
            }
            break;
        case 'delhi':
            if (fuelType === 'electric') {
                rtoPercentage = 8; // Electric vehicles
            } else if (fuelType === 'diesel') {
                if (price <= 600000) {
                    rtoPercentage = 5;
                } else if (price <= 1000000) {
                    rtoPercentage = 8.75;
                } else {
                    rtoPercentage = 12.5;
                }
            } else if (fuelType === 'petrol' || fuelType === 'cng') {
                if (price <= 600000) {
                    rtoPercentage = 4;
                } else if (price <= 1000000) {
                    rtoPercentage = 7;
                } else {
                    rtoPercentage = 10;
                }
            } else {
                rtoPercentage = 7; // Default for other fuel types
            }
            break;
        case 'goa':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Electric vehicles are exempt
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 1000000) {
                    rtoPercentage = 9;
                } else if (price <= 2000000) {
                    rtoPercentage = 11;
                } else {
                    rtoPercentage = 12;
                }
            } else {
                rtoPercentage = 9; // Default for other fuel types
            }
            break;
        case 'gujarat':
            if (fuelType === 'electric') {
                rtoPercentage = 1; // Electric vehicles
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = 6;
            } else {
                rtoPercentage = 6; // Default for other fuel types
            }
            break;
        case 'haryana':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Electric vehicles are exempt
            } else if (fuelType === 'diesel') {
                if (price <= 600000) {
                    rtoPercentage = 5;
                } else if (price <= 2000000) {
                    rtoPercentage = 7.5;
                } else {
                    rtoPercentage = 10;
                }
            } else if (fuelType === 'petrol' || fuelType === 'cng') {
                if (price <= 600000) {
                    rtoPercentage = 4;
                } else if (price <= 2000000) {
                    rtoPercentage = 6;
                } else {
                    rtoPercentage = 8;
                }
            } else {
                rtoPercentage = 6; // Default for other fuel types
            }
            break;
        case 'himachal-pradesh':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Electric vehicles are exempt
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 500000 ? 3 : 5;
            } else {
                rtoPercentage = 3; // Default for other fuel types
            }
            break;
        case 'jharkhand':
            if (fuelType === 'electric') {
                rtoPercentage = 4; // Electric vehicles
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                rtoPercentage = price <= 1500000 ? 6 : 15;
            } else {
                rtoPercentage = 6; // Default for other fuel types
            }
            break;
        case 'karnataka':            let baseTax;
            if (fuelType === 'electric') {
                if (price <= 1000000) {
                    baseTax = 5;
                } else if (price <= 1500000) {
                    baseTax = 9;
                } else if (price <= 2500000) {
                    baseTax = 15;
                } else {
                    baseTax = 10;
                }
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 500000) {
                    baseTax = 13;
                } else if (price <= 1000000) {
                    baseTax = 14;
                } else if (price <= 2000000) {
                    baseTax = 17;
                } else {
                    baseTax = 18;
                }
            } else {
                baseTax = 13; // Default for other fuel types
            }
            
            // Calculate additional cess (11% of base tax)
            const cess = (baseTax * 11) / 100;
            rtoPercentage = baseTax + cess;
            break;
        case 'kerala':
            if (fuelType === 'electric') {
                if (price <= 1500000) {
                    rtoPercentage = 5;
                } else if (price <= 2000000) {
                    rtoPercentage = 8;
                } else {
                    rtoPercentage = 10;
                }
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 500000) {
                    rtoPercentage = 9;
                } else if (price <= 1000000) {
                    rtoPercentage = 11;
                } else if (price <= 1500000) {
                    rtoPercentage = 13;
                } else if (price <= 2000000) {
                    rtoPercentage = 16;
                } else {
                    rtoPercentage = 21;
                }
            } else {
                rtoPercentage = 9; // Default for other fuel types
            }
            break;
        case 'madhya-pradesh':
            if (fuelType === 'electric') {
                rtoPercentage = 4; // Electric vehicles
            } else if (fuelType === 'diesel') {
                if (price <= 1000000) {
                    rtoPercentage = 10;
                } else if (price <= 2000000) {
                    rtoPercentage = 12;
                } else {
                    rtoPercentage = 16;
                }
            } else if (fuelType === 'cng') {
                // Apply 1% exemption for factory-fitted CNG vehicles
                if (price <= 1000000) {
                    rtoPercentage = 7; // 8% - 1%
                } else if (price <= 2000000) {
                    rtoPercentage = 9; // 10% - 1%
                } else {
                    rtoPercentage = 13; // 14% - 1%
                }
            } else if (fuelType === 'petrol') {
                if (price <= 1000000) {
                    rtoPercentage = 8;
                } else if (price <= 2000000) {
                    rtoPercentage = 10;
                } else {
                    rtoPercentage = 14;
                }
            } else {
                rtoPercentage = 8; // Default for other fuel types
            }
            break;
        case 'maharashtra':
            // Define RTO percentages for Maharashtra based on fuel type and price range
            if (fuelType === 'petrol') {
                if (price <= 1000000) {
                    rtoPercentage = 11;
                } else if (price <= 2000000) {
                    rtoPercentage = 12;
                } else {
                    rtoPercentage = 13;
                }
            } else if (fuelType === 'diesel') {
                if (price <= 1000000) {
                    rtoPercentage = 13;
                } else if (price <= 2000000) {
                    rtoPercentage = 14;
                } else {
                    rtoPercentage = 15;
                }
            } else if (fuelType === 'cng') {
                rtoPercentage = 7;
            } else if (fuelType === 'electric') {
                rtoPercentage = 0; // Concession/Exempt
            } else {
                rtoPercentage = 10; // Default for unknown fuel types
            }
            break;
        case 'manipur':
            if (price <= 300000) {
                rtoPercentage = 3;
            } else if (price <= 600000) {
                rtoPercentage = 4;
            } else if (price <= 1000000) {
                rtoPercentage = 5;
            } else if (price <= 1500000) {
                rtoPercentage = 6;
            } else if (price <= 2000000) {
                rtoPercentage = 7;
            } else {
                rtoPercentage = 8;
            }
            break;
        case 'meghalaya':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Registration fees waived for EVs
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 300000) {
                    rtoPercentage = 4;
                } else if (price <= 1500000) {
                    rtoPercentage = 6;
                } else if (price <= 2000000) {
                    rtoPercentage = 8;
                } else {
                    rtoPercentage = 10;
                }
            } else {
                rtoPercentage = 4; // Default for other fuel types
            }
            break;
        case 'mizoram':
            rtoPercentage = 7;
            break;
        case 'nagaland':
            rtoPercentage = 5; // Flat 5% for all vehicles
            break;        case 'odisha':
            // Define RTO percentages for Odisha based on vehicle cost (2025 rates)
            if (price < 500000) {
                rtoPercentage = 6;
            } else if (price <= 1000000) {
                rtoPercentage = 8;
            } else if (price <= 2000000) {
                rtoPercentage = 10;
            } else if (price <= 4000000) {
                rtoPercentage = 12;
            } else {
                rtoPercentage = 20;
            }
            break;
        case 'punjab':
            if (price <= 1500000) {
                rtoPercentage = 9.5;
            } else if (price <= 2500000) {
                rtoPercentage = 12;
            } else {
                rtoPercentage = 13;
            }
            break;
        case 'rajasthan':
            // Define RTO percentages for Rajasthan based on engine capacity and fuel type
            let baseRtoTax;
            if (engineSize <= 800) {
                baseRtoTax = fuelType === 'diesel' ? (price * 8) / 100 : (price * 6) / 100;
            } else if (engineSize <= 1200) {
                baseRtoTax = fuelType === 'diesel' ? (price * 11) / 100 : (price * 9) / 100;
            } else {
                baseRtoTax = fuelType === 'diesel' ? (price * 12) / 100 : (price * 10) / 100;
            }

            // Add 12.5% surcharge to the calculated road tax
            const surcharge = (baseRtoTax * 12.5) / 100;
            return baseRtoTax + surcharge;
        case 'sikkim':
            if (fuelType === 'electric') {
                rtoPercentage = 0; // Full exemption for EVs as per Oct 2024 notification
            } else {
                // Fixed tax amounts based on engine capacity
                let fixedTax;
                if (engineSize < 900) {
                    fixedTax = 1000;
                } else if (engineSize <= 1490) {
                    fixedTax = 1200;
                } else if (engineSize <= 2000) {
                    fixedTax = 2500;
                } else {
                    fixedTax = 3000;
                }
                // Convert fixed amount to equivalent percentage for the calculation
                rtoPercentage = (fixedTax / price) * 100;
            }
            break;
        case 'tamil-nadu':
            if (fuelType === 'electric') {
                rtoPercentage = 5;
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 500000) {
                    rtoPercentage = 12;
                } else if (price <= 1000000) {
                    rtoPercentage = 13;
                } else if (price <= 2000000) {
                    rtoPercentage = 18;
                } else {
                    rtoPercentage = 20;
                }
            } else {
                rtoPercentage = 12; // Default for other fuel types
            }
            return price <= 1000000 ? 
                (price * rtoPercentage) / 100 : 
                (price * rtoPercentage) / 100 + (price * tcsPercentage) / 100;
        case 'telangana':
            if (fuelType === 'electric') {
                if (price <= 1000000) {
                    rtoPercentage = 11;
                } else if (price <= 2000000) {
                    rtoPercentage = 14;
                } else {
                    rtoPercentage = 15;
                }
            } else if (fuelType === 'petrol' || fuelType === 'diesel' || fuelType === 'cng') {
                if (price <= 500000) {
                    rtoPercentage = 13;
                } else if (price <= 1000000) {
                    rtoPercentage = 14;
                } else if (price <= 2000000) {
                    rtoPercentage = 17;
                } else {
                    rtoPercentage = 18;
                }
            } else {
                rtoPercentage = 13; // Default for other fuel types
            }
            break;
        case 'tripura':
            let fixedTax;
            if (price <= 300000) {
                fixedTax = 4100;
            } else if (price <= 500000) {
                fixedTax = 4800;
            } else if (price <= 1000000) {
                fixedTax = 6900;
            } else if (price <= 1500000) {
                fixedTax = 7550;
            } else {
                fixedTax = 8250;
            }
            // Convert fixed amount to equivalent percentage for calculation
            rtoPercentage = (fixedTax / price) * 100;
            break;
        case 'uttar-pradesh':
            if (fuelType === 'electric') {
                rtoPercentage = 0;
            } else if (fuelType === 'diesel') {
                rtoPercentage = price <= 1000000 ? 10 : 11;
            } else if (fuelType === 'petrol' || fuelType === 'cng') {
                rtoPercentage = price <= 1000000 ? 8 : 10;
            } else {
                rtoPercentage = 8; // Default for other fuel types
            }
            break;
        case 'uttarakhand':
            // Base tax rate based on price
            if (price <= 500000) {
                rtoPercentage = 8;
            } else if (price <= 1000000) {
                rtoPercentage = 9;
            } else {
                rtoPercentage = 10;
            }
            
            // Calculate base tax with TCS if applicable
            let totalTax = price <= 1000000 ? 
                (price * rtoPercentage) / 100 : 
                (price * rtoPercentage) / 100 + (price * tcsPercentage) / 100;
            
            // Add green tax for non-electric vehicles
            if (fuelType === 'diesel') {
                totalTax += 3000;
            } else if (fuelType === 'petrol' || fuelType === 'cng') {
                totalTax += 1500;
            }
            
            return totalTax;
            break;
        case 'west-bengal':
            if (fuelType === 'electric') {
                rtoPercentage = 2; // Flat ~2% for EVs
            } else if (fuelType === 'diesel') {
                // Base rate + 2.5% diesel surcharge
                if (price <= 600000) {
                    rtoPercentage = 7.5; // 5% + 2.5%
                } else if (price <= 1000000) {
                    rtoPercentage = 12.5; // 10% + 2.5%
                } else if (price <= 2000000) {
                    rtoPercentage = 14.5; // 12% + 2.5%
                } else {
                    rtoPercentage = 16.5; // 14% + 2.5%
                }
            } else if (fuelType === 'petrol' || fuelType === 'cng') {
                if (price <= 600000) {
                    rtoPercentage = 5;
                } else if (price <= 1000000) {
                    rtoPercentage = 10;
                } else if (price <= 2000000) {
                    rtoPercentage = 12;
                } else {
                    rtoPercentage = 14;
                }
            } else {
                rtoPercentage = 5; // Default for other fuel types
            }

            return price <= 1000000 ? 
                (price * rtoPercentage) / 100 : 
                (price * rtoPercentage) / 100 + (price * tcsPercentage) / 100;
        default:
            rtoPercentage = 10;
            return price <= 1000000 ? 
                (price * rtoPercentage) / 100 : 
                (price * rtoPercentage) / 100 + (price * tcsPercentage) / 100;
    }

    // Calculate RTO price with TCS charges for states without explicit returns
    return price <= 1000000 ? 
        (price * rtoPercentage) / 100 : 
        (price * rtoPercentage) / 100 + (price * tcsPercentage) / 100;
}

async function calculateCarOnRoadPrice(slug, state = 'maharashtra') {
    try {
        // Convert state to lowercase and handle hyphens
        state = state.toLowerCase().replace(/\s+/g, '-');
        
        const variantDetails = await getVariantDetails(slug);
        if (!variantDetails) {
            throw new Error('Failed to fetch variant details');
        }        const { price, insurance } = variantDetails;
        if (!price) {
            throw new Error('Price information not available');
        }        const rtoTax = await calculateCarRTOPrice(slug, state);
        // Add 1% TCS for vehicles above 10 lakhs
        const tcsAmount = Number(price) > 1000000 ? (Number(price) * 0.01) : 0;
        // Fixed costs
        const hypothecationCharges = 1500;
        const fastagCharges = 500;
        const totalPrice = Number(price) + Number(rtoTax) + Number(insurance || 0) + tcsAmount + hypothecationCharges + fastagCharges;        return {
            exShowroomPrice: Number(price),
            rtoTax: Number(rtoTax),
            insurance: Number(insurance || 0),
            tcs: tcsAmount,
            hypothecationCharges: hypothecationCharges,
            fastagCharges: fastagCharges,
            totalOnRoadPrice: totalPrice
        };
    } catch (error) {
        throw new Error(`Error calculating on-road price: ${error.message}`);
    }
}

// Export both functions
module.exports = {
    calculateCarOnRoadPrice,
    calculateCarRTOPrice
};