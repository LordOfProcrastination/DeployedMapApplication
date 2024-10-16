import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { useLayer } from "../map/useLayer";

const emergencyshelterLayer = new VectorLayer({
  className: "emergencyshelters",
  source: new VectorSource({
    url: "./emergencyshelters.json",
    format: new GeoJSON(),
  }),
  style: emergencyshelterStyle,
});

export type EmergencyshelterProperties = {
  adresse: String;
  plasser: number;
  romnr: number;
};

export type EmergencyshelterFeature = {
  getProperties(): EmergencyshelterProperties;
} & Feature<Point>;

function emergencyshelterStyle(f: FeatureLike) {
  const feature = f as EmergencyshelterFeature;
  const emergencyshelter = feature.getProperties();
  const radius = 3 + (emergencyshelter.plasser || 0) / 700;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "red", width: 1 }),
      fill: new Fill({
        color: "lightcoral",
      }),
      radius: radius,
    }),
  });
}

function activeEmergencyshelterStyle(f: FeatureLike, resolution: number) {
  const feature = f as EmergencyshelterFeature;
  const emergencyshelter = feature.getProperties();
  const radius = 3 + (emergencyshelter.plasser || 0) / 700;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "red", width: 3 }),
      fill: new Fill({
        color: "red",
      }),
      radius: radius,
    }),
    text:
      resolution < 75
        ? new Text({
            text: emergencyshelter.adresse.toString(),
            offsetY: -15,
            font: "bold 14px sans-serif",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          })
        : undefined,
  });
}

export function EmergencyLayerCheckbox({
  setSelectedShelter,
}: {
  setSelectedShelter: (shelter: EmergencyshelterProperties | null) => void;
}) {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);
  const [activeFeature, setActiveFeature] = useState<EmergencyshelterFeature>();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();

    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === emergencyshelterLayer,
    });
    if (features.length > 0) {
      setActiveFeature(features[0] as EmergencyshelterFeature);
      setSelectedShelter(
        (features[0] as EmergencyshelterFeature).getProperties(),
      );
    } else {
      setActiveFeature(undefined);
      setSelectedShelter(null);
    }
  }

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === emergencyshelterLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as EmergencyshelterFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  useEffect(() => {
    activeFeature?.setStyle(activeEmergencyshelterStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useLayer(emergencyshelterLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("click", handleClick);
    }
    return () => map?.un("click", handleClick);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Skjul" : "Vis"} Tilfluktsrom
      </label>
    </div>
  );
}
