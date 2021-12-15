import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import './UserMap.css';
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry"
const features = [
  new Graphic(
    {
      geometry: {
        type: "point",
        x: -118.475,
        y: 34.026,
      },
      symbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        style: "square",
        color: "blue",
        size: "1118px",  // pixels
        outline: {  // autocasts as new SimpleLineSymbol()
          color: [ 255, 0, 0 ],
          width: 3  // points
        }
      },
      attributes: {
        ObjectID: 1
      }
    }
  )
];

const UserMap = () => {
    const mapDiv = useRef(null);

    useEffect(() => {
        esriConfig.apiKey = "AAPK445b17b023f9440aa2213838c5521ee36GsXRZpxGdn8Kp4ccanvzmycWR08vmAxcQxqqwempljZ_jX4o95h-sxhKi96aAv3";
        
        if (mapDiv.current) {

          const trucksLayer = new FeatureLayer({
            source: features,
            objectIdField: "ObjectID"
          });

          const map = new Map({
            basemap: "arcgis-navigation",
            layers: [trucksLayer]
          });
          
          const view = new MapView({
            container: mapDiv.current,
            map: map,
            scale: 1000000,
            center: [-118.475, 34.026],
          });
          
        }
      }, []);
    
      return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;