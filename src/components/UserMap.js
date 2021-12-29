import './UserMap.css';
import React, { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import PopupTemplate from "@arcgis/core/PopupTemplate";

const newTruckGraphic = (coords, color, attributes = {}) => {
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
    const [supplies, setSupplies] = useState(null);
    const [view, setView] = useState(null);

    // Init map parameters.
    useEffect(() => {
      const newSupplies = getDBSupplies();

      setSupplies(newSupplies);
      setView(new MapView({
        container: mapDiv.current,
        map: new Map({
          basemap: "arcgis-navigation",
          layers: [
            new GraphicsLayer({
              id: "Trucks Points",
              graphics: newSupplies
            })
          ]
        }),
        scale: 1000000,
        center: [-118.475, 34.026],
      }));
    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;