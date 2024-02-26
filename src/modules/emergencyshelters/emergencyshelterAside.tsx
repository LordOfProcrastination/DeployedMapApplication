import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import React from "react";
import {
  EmergencyshelterFeature,
  EmergencyshelterProperties,
} from "./emergencyshelterCheckbox";

export type Props = {
  shelter: EmergencyshelterProperties | null;
  onClose: () => void;
  className: string;
};
export function EmergencyShelterAside({ shelter, onClose, className }: Props) {
  return (
    <aside className={className}>
      <h2>{shelter?.adresse}</h2>
      <p>Plass: {shelter?.plasser}</p>
      <p>Rom Nummer: {shelter?.romnr}</p>
      <button onClick={onClose}>Lukk</button>
    </aside>
  );
}
