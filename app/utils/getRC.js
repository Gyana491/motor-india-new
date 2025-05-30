async function getVehicleDetails(vehicleNumber) {
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7,or;q=0.6,zh-CN;q=0.5,zh;q=0.4,hmn;q=0.3,zh-TW;q=0.2,bn;q=0.1,nl;q=0.1,fr;q=0.1,lg;q=0.1,hy;q=0.1,sq;q=0.1,ar;q=0.1',
    'authorization': 'Basic YzJiX2Zyb250ZW5kOko1SXRmQTk2bTJfY3lRVk00dEtOSnBYaFJ0c0NtY1h1',
    'device_category': 'WebApp',
    'origin': 'https://www.cars24.com',
    'origin_source': 'c2b-website',
    'platform': 'rto',
    'referer': 'https://www.cars24.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  };

  try {
    const response = await fetch(`https://vehicle.cars24.team/v6/vehicle-number/${vehicleNumber}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
    throw error;
  }
}

export { getVehicleDetails };
