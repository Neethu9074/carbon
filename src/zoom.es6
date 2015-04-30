'use strict';

// max zoom units in the 3D map => design zoom levels
export const zoomUnitToLevel = {
  70: 100,
  100: 50,
  100000: 25
};

export const maxZoomUnitsInMap = Object.keys(zoomUnitToLevel)
  .map(n => parseInt(n, 10))
  .sort((a, b) => a > b);

export const zoomLevelsInDesign = Object.keys(zoomUnitToLevel)
  .map(k => zoomUnitToLevel[k]);

export function getZoomLevel(zoomUnit) {
  for (let i = 0, len = maxZoomUnitsInMap.length; i < len; i++) {
    if (zoomUnit <= maxZoomUnitsInMap[i]) {
      return zoomUnitToLevel[maxZoomUnitsInMap[i]];
    }
  }
  return zoomUnitToLevel[maxZoomUnitsInMap[maxZoomUnitsInMap.length - 1]];
}
