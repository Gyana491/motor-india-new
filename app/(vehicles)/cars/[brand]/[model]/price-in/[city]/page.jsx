export default async function onRoadPricePage({ params }) {
    
    console.log("Params:", params);
    const { brand, model, city } = await params;

    return (
        <>
        {city}
        </>
    );
}