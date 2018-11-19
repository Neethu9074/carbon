import 'ammap3/ammap/ammap.js';
import 'ammap3/ammap/themes/light.js';

// We want to provide the world map synchronoysly.
import 'ammap3/ammap/maps/js/worldLow.js';

import * as mapLoaders from 'in-new-components/AmMap/mapLoaders';
import { emptyObject } from 'in-services/fixedObjects';

// A 128x256 path with the lower half being empty. This ensures that the image will be center aligned when positioning.
// How is this accomplished? By adding an M0,256 instructions to the end of the path.
export const centerAlignedLocationPointer =
  'M85.6,46.5c0,12.8-10.5,23.3-23.4,23.3c-12.9,0-23.4-10.4-23.4-23.3c0-12.9,10.5-23.3,23.4-23.3 C75.2,23.3,85.6,33.7,85.6,46.5 M109.9,46.5C109.9,20.8,88.9,0,63.1,0C37.3,0,16.4,20.8,16.4,46.5c0,11.3,4.1,21.7,10.8,29.7 l36,51.7l36.5-52.5c1.3-1.6,2.5-3.4,3.6-5.2l0.4-0.5h-0.1C107.6,63,109.9,55,109.9,46.5M0,256';
export const amCharts = window.AmCharts;
export const worldLowMap = amCharts.maps.worldLow;

export function loadMapAsynchronously(name, { minimumSuccessDelay = 0 } = emptyObject) {
  if (mapLoaders[name]) {
    const dataPromise = mapLoaders[name]().then(() => amCharts.maps[name]);
    if (minimumSuccessDelay > 0) {
      return Promise.all([dataPromise, getTimeoutPromise(minimumSuccessDelay)]).then(([result]) => result);
    }
    return dataPromise;
  }
  return Promise.reject(new Error(`Unknown map ${name}.`));
}

function getTimeoutPromise(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export function setDataProvider({ map, dataProvider, projection = 'mercator' }) {
  map.dataProvider = dataProvider;
  map.validateData();
  map.setProjection(projection);
  map.validateNow();
}
