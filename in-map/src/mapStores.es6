import * as ro from 'reactive-observables';

const roSpec = {emitLatestOnSubscribe: true};

export const longClickedSceneObject = ro.create(roSpec);
export const selectedSceneObject = ro.create(roSpec);
export const cursorPosition = ro.create(roSpec);
export const nodeMaxPower = ro.create(roSpec);
export const currentScene = ro.create(roSpec);
export const iconSize = ro.create(roSpec);

// the simple currentTooltip store is handled via 3D collision calculation
// if an object was found the store is set. There is no connection between 2D div elements and 3D calculations
// so the 3D scene can't figure out if a 2D element was hovered. For that information we need a second
// store to keep the information if a 2D element was hovered.
export const currentTooltip = ro.create(roSpec);
export const currentTooltip2D = ro.create(roSpec);

nodeMaxPower.emit(1);
