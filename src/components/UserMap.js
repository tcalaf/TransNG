import './UserMap.css';
import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { getRouteLayersFeatures, newTruckGraphic } from './utils';

/* data (required) structure: [{
    supply: supplyDbObj,
    truck: truckDbObj,
    demands: [demandDbObj]
  }]
  */
const UserMap = ({visible, data}) => {
    const mapDiv = useRef(null);
    const trucksLayer = useRef(new GraphicsLayer());
    const routesLayer = useRef(new GraphicsLayer());
    const view = useRef(new MapView({
        container: mapDiv.current,
        map: new Map({
            basemap: "arcgis-navigation",
            layers: [trucksLayer.current, routesLayer.current]
        }),
        scale: 1000000,
        center: [-118.475, 34.026],
    }));

    useEffect(() => {
        console.log("map mount")
    }, []);

    useEffect(() => {
        console.log("map props rerender")

        if (!visible)
            return;

        const suppliesGraphics = data.map((x) => {
            return newTruckGraphic(
                JSON.parse(x.supply.current_place),
                (Date.parse(x.supply.start_date) < Date.now()) ? "red" : "green",
                x.supply
            );
        });
        trucksLayer.current.removeAll();
        trucksLayer.current.addMany(suppliesGraphics);

        async function buildRouteLayer() {
           const routeFeatures = await getRouteLayersFeatures(data);
           routesLayer.current.removeAll();
           routesLayer.current.addMany(routeFeatures);
        }
        buildRouteLayer();
    }, [data, visible]);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;