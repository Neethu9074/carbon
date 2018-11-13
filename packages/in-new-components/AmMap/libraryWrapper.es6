import 'ammap3/ammap/ammap.js';
import 'ammap3/ammap/themes/light.js';

// We want to provide the world map synchronoysly.
import 'ammap3/ammap/maps/js/worldLow.js';

import * as mapLoaders from 'in-new-components/AmMap/mapLoaders';
import { emptyObject } from 'in-services/fixedObjects';

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
