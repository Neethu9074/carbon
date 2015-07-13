'use strict';

import * as ro from 'reactive-observables';


const roSpec = {emitLatestOnSubscribe: true};
export const selectedSceneObject = ro.create(roSpec);
export const longClickedSceneObject = ro.create(roSpec);
