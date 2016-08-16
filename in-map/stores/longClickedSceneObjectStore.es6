import * as ro from 'reactive-observables';


export const longClickedSceneObject$ = ro.create();

export function set(newLongClickedSceneObject) {
  longClickedSceneObject$.emit(newLongClickedSceneObject);
}
