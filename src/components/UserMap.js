import './UserMap.css';
import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { getNewDemandCost, getRouteLayersFeatures, getTrucksGraphics, newTruckGraphic, truckCanAcceptNewDemand } from './utils';

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
        const timer = setInterval(()=> {
            const trucks = [];
            const now = Date.now();
            for (let i = 0; i < trucksLayer.current.graphics.length; i += 1) {
                const route = routesLayer.current.graphics.getItemAt(i);
                const oldTruck = trucksLayer.current.graphics.getItemAt(i);

                const elapsedTimeRatio = (now - route.attributes.StartTime) / (route.attributes.TotalTime * 60000);
                const newPos = (route.attributes.StartTime > now) ? 0 : Math.min(Math.floor((route.geometry.paths[0].length-1) * elapsedTimeRatio), route.geometry.paths[0].length-1);

                trucks.push(newTruckGraphic(
                    {
                        x: route.geometry.paths[0][newPos][0],
                        y: route.geometry.paths[0][newPos][1],
                    }, 
                    oldTruck.symbol.color,
                    oldTruck.attributes
                ));
            }
            trucksLayer.current.removeAll();
            trucksLayer.current.addMany(trucks);
        }, 10000);


        return () => {
            clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        console.log("map props rerender ", visible, data)
        if (!visible)
            return;

        async function initMap() {
            const routeFeatures = await getRouteLayersFeatures(data);
            routesLayer.current.removeAll();
            routesLayer.current.addMany(routeFeatures);

            const suppliesGraphics = getTrucksGraphics(data, routesLayer.current.graphics.toArray());
            trucksLayer.current.removeAll();
            trucksLayer.current.addMany(suppliesGraphics);
        }

        initMap();
    }, [data, visible]);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;