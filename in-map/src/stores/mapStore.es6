

import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const cursorPosition = ro.create(roSpec);
export const iconSize = ro.create(roSpec);
export const currentScene = ro.create(roSpec);
export const selectedSceneObject = ro.create(roSpec);
export const longClickedSceneObject = ro.create(roSpec);
export const currentTooltip = ro.create(roSpec);
