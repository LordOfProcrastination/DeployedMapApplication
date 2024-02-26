import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  EmergencyshelterFeature,
  EmergencyshelterProperties,
} from "./emergencyshelterCheckbox";
import { MapContext } from "../map/mapContext";

type EmergencyshelterVectorLayer = VectorLayer<
  VectorSource<EmergencyshelterFeature>
>;

export type Props = {
  shelter: EmergencyshelterProperties | null;
  onClose: () => void;
};
export const EmergencyShelterAside: React.FC<Props> = ({
  shelter,
  onClose,
}) => (
  <aside>
    <h2>{shelter?.adresse}</h2>
    <p>Places: {shelter?.plasser}</p>
    <p>Room Number: {shelter?.romnr}</p>
    <button onClick={onClose}>Close</button>
  </aside>
);
