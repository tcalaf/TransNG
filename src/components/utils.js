import * as locator from "@arcgis/core/rest/locator";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";

const locatorUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
const fleetRoutingUrl = "https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblemSync/GPServer/EditVehicleRoutingProblem";

export const addressesToCoordinates = async (addresses) => {
    const coordinates = [];
    console.log(addresses)
    for (const addr of addresses) {
        console.log(addr)
        const results = await locator.addressToLocations(
            locatorUrl, {
            address: {"SingleLine": addr}
        });
        
        coordinates.push({
            x: results[0].location.x,
            y: results[0].location.y
        });
    }
    return coordinates;
};

export const newTruckGraphic = (coords, color, attributes = {}) => {
    return new Graphic({
      geometry: new Point({
        x: coords.x,
        y: coords.y,
      }),
      symbol: new SimpleMarkerSymbol({
        color,
        size: "10px",
        outline: {
          color
        }
      }),
      attributes,
      popupTemplate: new PopupTemplate({
        title: "Truck ID: {id_truck}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                label: "From",
                fieldName: "start_place",
              },
              {
                label: "To",
                fieldName: "finish_place",
              },
            ]
          },
          {
            type: "fields",
            fieldInfos: [
              {
                label: "Departure date",
                fieldName: "start_date",
              },
              {
                label: "Arrival date",
                fieldName: "finish_date",
              },
            ]
          }
        ]
      })
    })
  }
  
export const getDBSupplies = () => {
    // TODO: replace with db call to supplies
    let supplies = [
        {
        id_truck: "smth",
        start_date: "26 Dec 2021 12:00:00",
        start_place: "Malibu",
        finish_date: "22 Jan 2022 04:00:00",
        finish_place: "Los Angeles International Airport",
        current_place: '{"x": -118.475, "y": 34.026}'
        },
        {
        id_truck: "smth2",
        start_date: "20 Jan 2022 04:00:00",
        start_place: "ccc2",
        finish_date: "ddd",
        finish_place: "ddd2",
        current_place: '{"x": -118.475, "y": 34.526}'
        }
    ];

    return supplies;
}


// supply is data from db
export const getNewSupplyRouteDetails = async (supply) => {
    const depotsCoords = await addressesToCoordinates([supply.start_place, supply.finish_place]);
    const depots = new FeatureSet({
        features: [
            {
                attributes: {Name: supply.start_place},
                geometry: {type: "point", ...depotsCoords[0]}
            }, {
                attributes: {Name: supply.finish_place},
                geometry: {type: "point", ...depotsCoords[1]}
            }
        ]
    });

    const orders = new FeatureSet({
        features: [
          {
            attributes: {Name: supply.finish_place},
            geometry: {type: "point", ...depotsCoords[1]}
          }
        ],
      });

      const routes = new FeatureSet({
        features: [
          {
            attributes: {
              Name: "Route 1",
              Description: "vehicle 1",
              StartDepotName: supply.start_place,
              EndDepotName: supply.finish_place,
              Capacities: "4",
              MaxOrderCount: 3,
              MaxTotalTime: 60,
            }
          }
        ]
      });


      const params = {
        orders,
        depots,
        routes
      };

    return await geoprocessor.execute(fleetRoutingUrl, params);
}