import './UserMap.css';
import React, { useRef, useEffect, useState, useCallback } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { fetchRouteDetails, getDBSupplies, newTruckGraphic } from './utils';

const UserMap = () => {
    const mapDiv = useRef(null);
    const [view, setView] = useState(null);

    function showRoutes(routes) {
      const routeLayer = new GraphicsLayer();
      for (let route of routes) {
        route.symbol = {
          type: "simple-line",
          color:
            route.attributes.Name === "Route 1"
              ? [50, 150, 255, 0.75]
              : [180, 69, 255, 0.75],
          width: "4px"
        }
      }
      routeLayer.addMany(routes);
      return routeLayer;
    }

    // Init map parameters.
    useEffect(() => {
      const supplies = getDBSupplies();
      const suppliesGraphics = supplies.map((x) => {
        return newTruckGraphic(
          JSON.parse(x.current_place),
          (Date.parse(x.start_date) < Date.now()) ? "red" : "green",
          x)
      });
      
      fetchRouteDetails(supplies[0], [{start_place: "Beverly Hills", finish_place: "Inglewood"}]).then((val) => {
        console.log(val);
        setView(new MapView({
          container: mapDiv.current,
          map: new Map({
            basemap: "arcgis-navigation",
            layers: [
              new GraphicsLayer({
                id: "Trucks Points",
                graphics: suppliesGraphics
              }),
              showRoutes(val.results[2].value.features)
            ]
          }),
          scale: 1000000,
          center: [-118.475, 34.026],
        }));
      });
    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;