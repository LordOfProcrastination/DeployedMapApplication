import React, { useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";

const civilDefenceLayer = new VectorLayer({
  source: new VectorSource({
    url: "civlildefencedistrict.json",
    format: new GeoJSON(),
  }),
});

type CivilDefenceProperties = {
  navn: string;
};

export function CivilDefenceCheckbox() {
  const [checked, setChecked] = useState(false);

  useLayer(civilDefenceLayer, checked);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show Civil Defence Districts
      </label>
    </div>
  );
}
