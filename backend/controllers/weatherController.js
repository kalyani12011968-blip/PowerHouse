const {
    getWeather
} = require("../services/weatherService");

async function weather(req, res, next) {

    try {

        const {
            latitude,
            longitude
        } = req.query;

        if (!latitude || !longitude) {

            return res.status(400).json({
                success: false,
                message:
                    "latitude and longitude required"
            });
        }

        const data =
            await getWeather(
                latitude,
                longitude
            );

        res.json({
            success: true,
            data
        });

    } catch (error) {

        next(error);
    }
}

module.exports = {
    weather
};