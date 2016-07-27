import {combineLatest} from 'reactive-observables';

import createViewStructureObservable from 'in-services/subscription/view';
import {focusedMoment$} from 'in-stores/timeline';
import {view} from 'in-stores/view';


export function getViewStructure() {
  return combineLatest([view, focusedMoment$])
         .flatMap(([viewType, focusedMoment]) => {
           return createViewStructureObservable({viewType, time: focusedMoment});
         });
}
