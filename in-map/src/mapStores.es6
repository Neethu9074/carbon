import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const longClickedSceneObject = ro.create(roSpec);
export const cursorPosition = ro.create(roSpec);
export const currentTooltip = ro.create(roSpec);
export const nodeMaxPower = ro.create(roSpec);
export const currentScene = ro.create(roSpec);

nodeMaxPower.emit(1);
