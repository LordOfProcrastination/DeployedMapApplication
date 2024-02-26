import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { EmergencyshelterFeature } from "./emergencyshelterCheckbox";
import { MapContext } from "../map/mapContext";

type EmergencyshelterVectorLayer = VectorLayer<
  VectorSource<EmergencyshelterFeature>
>;

interface EmergencyshelterProperties {
  addresse: string;
  plasser: number;
}

function useEmergencyshelterFeatures() {
  const { map, layers } = useContext(MapContext);
  const layer = layers.find(
    (l) => l.getClassName() === "emergency shelters",
  ) as EmergencyshelterVectorLayer;
  const [features, setFeatures] = useState<EmergencyshelterFeature[]>();
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );
  const visibleFeatures = useMemo(
    () =>
      features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleSourceChange() {
    setFeatures(layer?.getSource()?.getFeatures());
  }

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    map.getView().on("change", handleSourceChange);
    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  useEffect(() => {
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, [map]);
  return { layer, features, visibleFeatures };
}

export function EmergencyshelterAside() {
  const { visibleFeatures } = useEmergencyshelterFeatures();
  return (
    <aside className={visibleFeatures?.length ? "visible" : "hidden"}>
      <div>
        <h2>Emergency Shelters</h2>
        <ul>
          {visibleFeatures?.map((k) => (
            <li>{k.getProperties().adresse.toString()}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
