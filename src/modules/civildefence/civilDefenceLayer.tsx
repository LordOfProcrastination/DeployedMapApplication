import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature, Map, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { Fill, Stroke, Style, Text } from "ol/style";
import { reset } from "ol/transform";
type CivilDefenceProperties = {
  navn: string;
};

const civilDefenceSource = new VectorSource<CivilDefenceFeature>({
  //for deploy url: "./civildefencedistrics.json"
  url: "./civildefencedistricts.json",
  //for localhost url: "/kws2100-publishing-a-map-application-StaffanPedersen/public/civildefencedistricts.json"
  format: new GeoJSON(),
});

type CivilDefenceFeature = Feature<Polygon> & {
  getProperties(): CivilDefenceProperties;
};

const civilDefenceLayer = new VectorLayer({
  source: civilDefenceSource,
  className: "districts",
  style: (feature) => {
    const district = feature as CivilDefenceFeature;
    const { districtname } = district.getProperties();
    return new Style({
      stroke: new Stroke({
        color: "blue",
        width: 1,
      }),
      fill: new Fill({
        color: "rgba(135, 206, 235, 0.2)",
      }),
    });
  },
});
function activeCivilDefenceStyle(f: FeatureLike) {
  const feature = f as CivilDefenceFeature;
  const school = feature.getProperties();
  return new Style({
    stroke: new Stroke({
      color: "rgba(74, 181, 127)",
      width: 3,
    }),
    fill: new Fill({
      color: "rgba(133, 234, 184, 0.2)",
    }),
  });
}
function resetFeatureStyles() {
  civilDefenceSource.getFeatures().forEach((feature) => {
    feature.setStyle(undefined);
  });
}

export function CivilDefenceCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const [activeFeature, setActiveFeature] = useState<CivilDefenceFeature>();

  //Overlay text
  const overlay = useMemo(
    () =>
      new Overlay({
        offset: [10, -10], // Offset the overlay 10px to the right and 10px up
      }),
    [],
  );
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);

    return () => {
      map.removeOverlay(overlay);
    };
  }, []);
  const [selectedDistrict, setSelectedDistrict] = useState<
    CivilDefenceFeature | undefined
  >();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const hoveredDistrict = civilDefenceSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as CivilDefenceFeature[];
    if (hoveredDistrict.length === 1) {
      setSelectedDistrict(hoveredDistrict[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedDistrict(undefined);
      overlay.setPosition(undefined);
    }
    resetFeatureStyles();
    map.forEachFeatureAtPixel(
      e.pixel,
      (feature) => {
        if (feature.getGeometry()?.getType() === "Polygon") {
          const setActiveFeature = feature as CivilDefenceFeature;
          setActiveFeature.setStyle(activeCivilDefenceStyle(setActiveFeature));
          return true;
        }
      },
      {
        layerFilter: (layer) => layer === civilDefenceLayer,
      },
    );
  }
  useEffect(() => {
    let hoveredDistrict = null;
    if (checked) {
      setLayers((old) => [...old, civilDefenceLayer]);
      map.on("pointermove", handlePointerMove);
    } else {
      overlay.setPosition(undefined);
      setSelectedDistrict(undefined);
    }
    return () => {
      map.un("pointermove", handlePointerMove);
      setLayers((old) => old.filter((l) => l !== civilDefenceLayer));
      new Style();
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Skjul" : "Vis"} Sivilforsvarsdistrikter
      </label>
      <div ref={overlayRef} className={"civilDefence-overlay"}>
        {selectedDistrict && (
          <>
            {(selectedDistrict.getProperties() as CivilDefenceProperties).navn}
          </>
        )}
      </div>
    </div>
  );
}
