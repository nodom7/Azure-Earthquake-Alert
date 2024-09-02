const express = require('express');
const router = express.Router();
const { fetchJSONData } = require('../services/apiService');
const { getAlertStatus, getManualEarthquake } = require('../services/earthquakeService');
const uploadJsonToBlob = require('../services/blobService');

router.get('/', function(req, res, next) {
  console.log('GET route accessed');
  res.send('teststring');
});

router.post('/fetch-and-upload', async (req, res) => {
  console.log('POST /fetch-and-upload route accessed');
  try {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
    
    console.log('Fetching JSON data...');
    const jsonData = await fetchJSONData(url);
    console.log('JSON data fetched successfully');

    const jsonObject = JSON.parse(jsonData);
    const featuresArray = jsonObject.features;
    
    const eqCount = featuresArray.length;
    console.log(eqCount + " Earthquakes in the last hour");
    
    featuresArray.forEach((earthquake, i) => {
      const { place, mag: magnitude } = earthquake.properties;
      const alert = getAlertStatus(earthquake.properties);
      console.log(`${i + 1}. (Location): ${place} (Magnitude): ${magnitude} (Alert): ${alert}`);
    });
    
    console.log('Uploading to blob storage...');
    await uploadJsonToBlob(JSON.stringify(jsonObject), `earthquakes-${Date.now()}.json`);
    console.log('Upload completed');

    res.send('Data fetched and uploaded successfully');
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Failed to fetch and upload data');
  }
});

module.exports = router;