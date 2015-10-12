import * as ro from 'reactive-observables';

import * as views from '../views';
import {getStructure} from '../wiring';

export const view = ro.create({emitLatestOnSubscribe: true});
view.emit(views.physical);

export function setView(newActiveView) {
  view.emit(newActiveView);
}


export const viewStructure = view.transform({
  emitLatestOnSubscribe: true,

  shouldRetransform(previousView, currentView) {
    return previousView !== currentView;
  },

  transform(theView) {
    return getStructure(theView, true);
  }
});
