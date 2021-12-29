import * as locator from "@arcgis/core/rest/locator";

const locatorUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";


export const addressesToCoordinates = (addresses) => {
    const coordinates = [];

    for (const addr in addresses) {
        locator.addressToLocations(
        locatorUrl, {
        address: {
            "address": addr
        }
        }).then((results) => {
        coordinates.push({
            x: results[0].location.x,
            y: results[0].location.y
        });
        });
    }
    return coordinates;
};