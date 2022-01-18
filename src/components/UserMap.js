import './UserMap.css';
import React, { useRef, useEffect, useState, useCallback } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { fetchRouteDetails, getContractCost, getDBSupplies, newTruckGraphic, truckArrivesOnTime } from './utils';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const getRouteLayer = (features) => {
  const routeLayer = new GraphicsLayer();
  for (let f of features) {
    f.symbol = {
      type: "simple-line",
      color: [getRandomInt(200), getRandomInt(200), getRandomInt(200), 0.75],
      width: "4px"
    }
  }
  routeLayer.addMany(features);
  return routeLayer;
}

const UserMap = () => {
    const mapDiv = useRef(null);
    const [view, setView] = useState(null);

    // Init map parameters.
    useEffect(() => {
      const supplies = getDBSupplies();
      const suppliesGraphics = supplies.map((x) => {
        return newTruckGraphic(
          JSON.parse(x.current_place),
          (Date.parse(x.start_date) < Date.now()) ? "red" : "green",
          x)
      });

      truckArrivesOnTime(supplies[0], [], [{
        start_place: "Beverly Hills",
        finish_place: "Inglewood",
        goods_weight: 20,
        goods_length: 10,
        goods_width: 5,
        goods_height: 2,
        goods_volume: 100,
        start_date: "26 Dec 2021 15:00:00",
        start_max_date: "26 Dec 2021 18:00:00",
        finish_date: "26 Dec 2021 21:00:00",
        finish_max_date: "26 Dec 2021 23:59:00",
      }]).then((val) => {
        console.log(val);
      })
      
      fetchRouteDetails(supplies[0], [{
        start_place: "Beverly Hills",
        finish_place: "Inglewood",
        goods_weight: 20,
        goods_length: 10,
        goods_width: 5,
        goods_height: 2,
        goods_volume: 100,
        start_date: "26 Dec 2021 15:00:00",
        start_max_date: "26 Dec 2021 18:00:00",
        finish_date: "26 Dec 2021 21:00:00",
        finish_max_date: "26 Dec 2021 23:59:00",
      }]).then((val) => {
        console.log(val)
        setView(new MapView({
          container: mapDiv.current,
          map: new Map({
            basemap: "arcgis-navigation",
            layers: [
              new GraphicsLayer({
                id: "Trucks Points",
                graphics: suppliesGraphics
              }),
              getRouteLayer(val.results[2].value.features)
            ]
          }),
          scale: 1000000,
          center: [-118.475, 34.026],
        }));
      });

      getContractCost(supplies[0], {start_place: "Beverly Hills", finish_place: "Inglewood"}).then((aaa) => {
        console.log(aaa)
      });

    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;