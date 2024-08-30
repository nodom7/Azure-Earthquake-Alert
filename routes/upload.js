const express = require('express');
const router = express.Router();
const { fetchJSONData } = require('../services/apiService');
const { getAlertStatus, getManualEarthquake } = require('../services/earthquakeService');
const uploadJsonToBlob = require('../services/blobService');

router.post('/fetch-and-upload', async (req, res) => {
    try {
        const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
        const jsonData = await fetchJSONData(url);
        const jsonObject = JSON.parse(jsonData);
        const featuresArray = jsonObject.features;

        const eqCount = featuresArray.length;
        console.log(eqCount + " Earthquakes in the last hour");

        for (let i = 0; i < eqCount; i++) {
            const earthquake = featuresArray[i];
            const properties = earthquake.properties;

            const place = properties.place;
            const magnitude = properties.mag;
            const alert = getAlertStatus(properties);

            console.log(`${i + 1}. (Location): ${place} (Magnitude): ${magnitude} (Alert): ${alert}`);
        }

        const manualEarthquake = await getManualEarthquake(); // You may need to pass a `readInput` function if required.
        featuresArray.push(manualEarthquake);

        await uploadJsonToBlob(JSON.stringify(jsonObject), `earthquakes-${Date.now()}.json`);
        res.send('Data fetched and uploaded successfully');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send('Failed to fetch and upload data');
    }
});

module.exports = router;
