import './UserMap.css';
import React, { useRef, useEffect, useState } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

const newTruckGraphic = (coords, color, attributes = {}, popupTemplate = {}) => {
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
    popupTemplate
  })
}

const getDBSupplies = () => {
  // TODO: replace with db call to supplies
  let supplies = [
    {
      id_truck: "smth",
      start_date: "26 Dec 2021 12:00:00",
      start_place: "aaa2",
      finish_date: "bbb",
      finish_place: "bbb2",
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

  return supplies.map((x) => {
    return newTruckGraphic(
      JSON.parse(x.current_place),
      (Date.parse(x.start_date) < Date.now()) ? "red" : "green",
      x)
  }, supplies);
}

const UserMap = (props) => {
    const mapDiv = useRef(null);
    const [supplies, setSupplies] = useState(getDBSupplies());
    const [view, setView] = useState(null);

    useEffect(() => {
      esriConfig.apiKey = "AAPK445b17b023f9440aa2213838c5521ee36GsXRZpxGdn8Kp4ccanvzmycWR08vmAxcQxqqwempljZ_jX4o95h-sxhKi96aAv3";
    }, []);

    useEffect(() => {
      if (mapDiv.current) {
        const trucksLayer = new GraphicsLayer({
          graphics: supplies,
        });

        const map = new Map({
          basemap: "arcgis-navigation",
          layers: [trucksLayer]
        });
        
        setView(new MapView({
          container: mapDiv.current,
          map: map,
          scale: 1000000,
          center: [-118.475, 34.026],
        }));
      }
    }, [supplies]);
    
    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;