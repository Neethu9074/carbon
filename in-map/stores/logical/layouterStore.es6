import * as ro from 'reactive-observables';

import FruchtermannReingold from 'in-map/misc/logical/layoutingStrategies/FruchtermannReingold';


export const currentLayoutingStrategy$ = ro.create();

export function setLayoutingStrategy(newScene) {
  currentLayoutingStrategy$.emit(newScene);
}

setLayoutingStrategy(FruchtermannReingold);
