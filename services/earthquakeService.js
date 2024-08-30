function getAlertStatus(properties) {
    const alert = properties.alert;
    return alert ? alert : "No Alert";
}

async function getManualEarthquake(readInput) {  
    const place = await readInput('Enter the location: ');
    const magnitude = parseFloat(await readInput('Enter the magnitude: '));
    const alert = await readInput('Enter the alert status (or leave blank for "No Alert"): ') || "No Alert";
    const id = `manual-${Date.now()}`;
    const timestamp = Date.now();

    return {
        type: 'Feature',
        properties: {
            place: place,
            mag: magnitude,
            alert: alert,
            time: timestamp
        },
        geometry: {
            type: 'Point',
            coordinates: [0, 0] // Dummy coordinates
        },
        id: id
    };
}

module.exports = { getAlertStatus, getManualEarthquake };
