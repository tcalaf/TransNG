import './UserMap.css';
import React, { useRef, useEffect, useState, useCallback } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import { getRoutesLayers, newTruckGraphic } from './utils';

/* props.data (required) structure: [{
    supply: supplyDbObj,
    truck: truckDbObj,
    demands: [demandDbObj]
  }]
  */
const UserMap = (props) => {
    const mapDiv = useRef(null);
    const [view, setView] = useState(null);

    // Init map parameters.
    useEffect(() => {
        const supplies = props.data.map(x => x.supply);
        const suppliesGraphics = supplies.map((x) => {
        return newTruckGraphic(
            JSON.parse(x.current_place),
            (Date.parse(x.start_date) < Date.now()) ? "red" : "green",
            x)
        });
        getRoutesLayers(props.data).then((routeLayers) => {
            setView(new MapView({
                container: mapDiv.current,
                map: new Map({
                    basemap: "arcgis-navigation",
                    layers: [
                        new GraphicsLayer({
                            id: "Trucks Points",
                            graphics: suppliesGraphics
                        })
                    ].concat(routeLayers)
                }),
                scale: 1000000,
                center: [-118.475, 34.026],
            }));
        });
    }, []);

    return <div className="mapDiv" ref={mapDiv}></div>;
}

export default UserMap;