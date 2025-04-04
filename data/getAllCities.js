export default async function getAllCities() {
    const response = await fetch("https://wordpress-1415499-5388954.cloudwaysapps.com/wp-admin/admin-ajax.php?action=get_all_cities&&posts_per_page=-1")
    const data = await response.json()
    
    if (data.success && data.data.cities) {
        return data.data.cities;
    }
    return [];
}