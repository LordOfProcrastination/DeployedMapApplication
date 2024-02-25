import React, { useContext, useState } from "react";
import { MapContext } from "../map/mapContext";

export function EmergencyLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show emergencyshelters
      </label>
    </div>
  );
}
