import './UserMap.css';
import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { getRouteLayersFeatures, getTrucksGraphics, newTruckGraphic } from './utils';

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
        center: [26.10298000000006, 44.43429000000003],
    }));

    useEffect(() => {
        console.log("map moun")
    }, []);

    useEffect(() => {
        console.log("map props rerender ", visible, data)

        if (!visible)
            return;

        async function initMap() {
            const routeFeatures = await getRouteLayersFeatures(data);
            routesLayer.current.removeAll();
            routesLayer.current.addMany(routeFeatures);
            console.log("aa\n", routeFeatures)

            const suppliesGraphics = getTrucksGraphics(data, routesLayer.current.graphics.toArray());
            console.log("trucks", suppliesGraphics)
            trucksLayer.current.removeAll();
            trucksLayer.current.addMany(suppliesGraphics);
            console.log("bb", trucksLayer)
        }
    
        initMap();
    }, [data, visible]);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;