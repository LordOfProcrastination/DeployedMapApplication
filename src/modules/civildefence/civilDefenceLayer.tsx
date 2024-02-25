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

type CivilDefenceProperties = {
  navn: string;
};

const civilDefenceSource = new VectorSource<CivilDefenceFeature>({
  url: "/kws2100-publishing-a-map-application-StaffanPedersen/public/civildefencedistricts.json",
  format: new GeoJSON(),
});

type CivilDefenceFeature = Feature<Polygon> & {
  getProperties(): CivilDefenceProperties;
};

const civilDefenceLayer = new VectorLayer({
  source: civilDefenceSource,
});

export function CivilDefenceCheckbox({
  map,
  setLayers,
}: {
  map: Map;
  setLayers: Dispatch<SetStateAction<Layer[]>>;
}) {
  const [checked, setChecked] = useState(false);
  const overlay = useMemo(() => new Overlay({}), []);
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
  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const clickedDistrict = civilDefenceSource.getFeaturesAtCoordinate(
      e.coordinate,
    ) as CivilDefenceFeature[];
    if (clickedDistrict.length === 1) {
      setSelectedDistrict(clickedDistrict[0]);
      overlay.setPosition(e.coordinate);
    } else {
      setSelectedDistrict(undefined);
      overlay.setPosition(undefined);
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, civilDefenceLayer]);
      map.on("click", handleClick);
    }
    return () => {
      map.un("click", handleClick);
      setLayers((old) => old.filter((l) => l !== civilDefenceLayer));
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
        {checked ? "Hide" : "Show"} Civil Defence layer
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
