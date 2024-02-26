import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { CivilDefenceCheckbox } from "../civildefence/civilDefenceLayer";
import { EmergencyLayerCheckbox } from "../emergencyshelters/emergencyshelterCheckbox";
import { useGeographic } from "ol/proj";
import { Map, View } from "ol";

useGeographic();
const map = new Map({
  view: new View({ center: [10, 59], zoom: 8 }),
});
export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider value={{ map, layers, setLayers }}>
      <header>
        <h1>Nødsituasjonskart</h1>
      </header>
      <nav>
        <a href={"#"} onClick={handleFocusUser}>
          Focus on me
        </a>
        <EmergencyLayerCheckbox />
        <CivilDefenceCheckbox map={map} setLayers={setLayers} />
      </nav>
      <main>
        <div ref={mapRef}></div>
        <EmergencyLayerCheckbox />
      </main>
    </MapContext.Provider>
  );
}
