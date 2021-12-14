import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import esriConfig from "@arcgis/core/config";
import './UserMap.css';

const UserMap = () => {

    const mapDiv = useRef(null);

    useEffect(() => {
        esriConfig.apiKey = "AAPK445b17b023f9440aa2213838c5521ee36GsXRZpxGdn8Kp4ccanvzmycWR08vmAxcQxqqwempljZ_jX4o95h-sxhKi96aAv3";

        if (mapDiv.current) {

          const map = new Map({
                basemap: "arcgis-navigation",
                
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