import * as locator from "@arcgis/core/rest/locator";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor";
import * as route from "@arcgis/core/rest/route";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const locatorUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
const fleetRoutingUrl = "https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblemSync/GPServer/EditVehicleRoutingProblem";
const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

export const addressesToCoordinates = async (addresses) => {
  const coordinates = [];
  for (const addr of addresses) {
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

export const getTrucksGraphics = (data, routeGraphics) => {
	const trucks = [];
  const now = Date.now();

	for (let i = 0; i < data.length; i++) {
    const route = routeGraphics[i];
    const elapsedTimeRatio = (now - route.attributes.StartTime) / (route.attributes.TotalTime * 60000);
    const pos = (route.attributes.StartTime > now) ? 0 : Math.min(Math.floor((route.geometry.paths[0].length-1) * elapsedTimeRatio), route.geometry.paths[0].length-1);
		
    trucks.push(newTruckGraphic(
			{x: route.geometry.paths[0][pos][0], y: route.geometry.paths[0][pos][1]},
			(Date.parse(data[i].supply.start_date) < Date.now()) ? "red" : "green",
		  data[i].supply
		));
	}
	return trucks;
}

// supply is data from db, demands is array of demands as from db
export const fetchRouteDetails = async (supply, truck, demands=[]) => {
	const locations = [supply.start_place, supply.finish_place];
	for (const d of demands) {
		locations.push(d.start_place);
		locations.push(d.finish_place);
	}
	const coords = await addressesToCoordinates(locations);

	const depots = [
		{
			attributes: {Name: supply.start_place+"_supply"},
			geometry: {type: "point", ...coords[0]}
		},
		{
			attributes: {Name: supply.finish_place+"_supply"},
			geometry: {type: "point", ...coords[1]}
		}
	];
	const order_pairs = [];
	const orders = [{
		attributes: {
      Name: supply.finish_place+"_end_depot",
      RouteName: "Route 1",
      TimeWindowEnd1: Date.parse(supply.finish_date),
      AssignmentRule: 5
    },
		geometry: {type: "point", ...coords[1]}
	}];

	for (let i = 2; i < locations.length; i = i + 2) {
		order_pairs.push({
			attributes: {
				FirstOrderName: locations[i]+"_demand_"+supply.demands[i/2-1].demand_id,
				SecondOrderName: locations[i+1]+"_demand_"+supply.demands[i/2-1].demand_id
			}
		});

		orders.push({
			attributes: {
				Name: locations[i]+"_demand_"+supply.demands[i/2-1].demand_id,
				DeliveryQuantities: null,
				PickupQuantities: `${demands[i/2-1].goods_weight} ${demands[i/2-1].goods_length} ${demands[i/2-1].goods_width} ${demands[i/2-1].goods_height} ${demands[i/2-1].goods_volume}`,
        TimeWindowStart1: Date.parse(demands[i/2-1].start_date),
        TimeWindowEnd1: Date.parse(demands[i/2-1].start_max_date),
      },
			geometry: {type: "point", ...coords[i]}
		});
		orders.push({
			attributes: {
				Name: locations[i+1]+"_demand_"+supply.demands[i/2-1].demand_id,
				PickupQuantities: null,
				DeliveryQuantities: `${demands[i/2-1].goods_weight} ${demands[i/2-1].goods_length} ${demands[i/2-1].goods_width} ${demands[i/2-1].goods_height} ${demands[i/2-1].goods_volume}`,
        TimeWindowStart1: Date.parse(demands[i/2-1].finish_date),
        TimeWindowEnd1: Date.parse(demands[i/2-1].finish_max_date),
      },
			geometry: {type: "point", ...coords[i+1]}
		});
  	}

	const routes = new FeatureSet({
		features: [{
			attributes: {
				Name: "Route 1",
				Description: "vehicle 1",
				StartDepotName: supply.start_place+"_supply",
				EndDepotName: supply.finish_place+"_supply",
				Capacities: `${truck.max_weight} ${truck.length} ${truck.width} ${truck.height} ${truck.max_volume}`,
				EarliestStartTime: Date.parse(supply.start_date),
				LatestStartTime: Date.parse(supply.start_date)
			}
		}]
	});

	const params = {
		orders: new FeatureSet({features: orders}),
		depots: new FeatureSet({features: depots}),
		routes,
		order_pairs: new FeatureSet({features: order_pairs}),
		default_date: Date.parse(supply.start_date)
	};
	const a = await geoprocessor.execute(fleetRoutingUrl, params);
  console.log("AAAA", a);
  return a;
}

export const getDrivingDistance = async (coords) => {
	const r = await route.solve(routeUrl, new RouteParameters({
		stops: new FeatureSet({
      features: coords.map((c) => {
        return {geometry: new Point(c)}
      })
    })
	}));
	return r.routeResults[0].route.attributes.Total_Kilometers;
}

export const getContractCost = async (supply, demand) => {
  const coords = await addressesToCoordinates([supply.start_place, demand.start_place, demand.finish_place]);
  const d1 = await getDrivingDistance(coords.slice(0, 2));
  const d2 = await getDrivingDistance(coords.slice(1));
  return d1*supply.empty_price_per_km + d2*supply.full_price_per_km;
}

export const truckCanAcceptNewDemand = async (supply, truck, demands, newDemand) => {
  const response = await fetchRouteDetails(
    {...supply, demands: supply.demands.concat({demand_id: newDemand.id})},
    truck,
    demands.concat(newDemand)
  );

  if (response.results[2].value.features[0].attributes.TotalViolationTime > 0)
    return false;

  for (let i = 0; i < response.results[1].value.features.length; i += 1) {
    const f = response.results[1].value.features[i];
    if (f.attributes.Name == newDemand.start_place+"_demand_"+newDemand.id) {
      if (f.attributes.RouteName === "Route 1")
        return true;
      else
        return false;
    }
  }
  return false;
}

export const canGenerateContract = async (supply, truck, demands, newDemand) => {
  const canAccept = await truckCanAcceptNewDemand(supply, truck, demands, newDemand);
  if (!canAccept)
    return null;

  const cost = await getContractCost(supply, newDemand);
  if (cost > newDemand.max_budget)
    return null;

  return cost;
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const getRouteLayerFeatures = (features) => {
  for (let f of features) {
    f.symbol = {
      type: "simple-line",
      color: [getRandomInt(200), getRandomInt(200), getRandomInt(200), 0.75],
      width: "4px"
    }
  }
  return features;
}

export const getRouteLayersFeatures = async (data) => {
  let features = [];
  for (let i = 0; i < data.length; i++) {
    const result = await fetchRouteDetails(data[i].supply, data[i].truck, data[i].demands);
    features = features.concat(getRouteLayerFeatures(result.results[2].value.features));
  }
  return features;
}
