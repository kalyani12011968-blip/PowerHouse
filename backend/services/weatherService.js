async function getWeather(
    latitude,
    longitude
) {

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        "&current=temperature_2m,precipitation,rain";

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Weather API request failed"
        );
    }

    return await response.json();
}

module.exports = {
    getWeather
};