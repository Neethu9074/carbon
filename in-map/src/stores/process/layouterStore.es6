import * as ro from 'reactive-observables';

import FR from 'in-map/src/3DSceneObjects/process/layoutingStrategies/FruchtermannReingold';


export const currentLayoutingStrategy$ = ro.create();

export function setLayoutingStrategy(newScene) {
  currentLayoutingStrategy$.emit(newScene);
}

setLayoutingStrategy(new FR());
