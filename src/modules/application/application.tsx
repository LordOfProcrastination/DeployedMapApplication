import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { EmergencyLayerCheckbox } from "../emergencyshelters/emergencyshelterCheckbox";
import { CivilDefenceCheckbox } from "../civildefence/civilDefenceLayer";

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
        <CivilDefenceCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
      </main>
    </MapContext.Provider>
  );
}
