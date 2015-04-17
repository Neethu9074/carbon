'use strict';

var chartColors = {
  cyan: '#2dfffe',
  razzmatazz: '#e50066',
  easternBlue: '#1d90a9',
  governorBay: '#3d2dcf',
  toryBlue: '#0b5cad',
  dodgerBlue: '#15aafe'
};
var mapColors = {
  black: '#000000',
  mineShaft: '#202020',
  cyan: '#2dfffe',
  orient: '#015473',
  redBerry: '#880000',
  gold: '#ffd000',
  flushOrange: '#ff8000'
};

// first level is the color theme's name
exports.consts = {
  night: {
    common: {
      fontFamily: 'sans-serif',
      fontColor: '#ddd'
    },
    charts: {
      defaultPalette: [
        chartColors.cyan,
        chartColors.razzmatazz,
        chartColors.easternBlue,
        chartColors.governorBay,
        chartColors.toryBlue,
        chartColors.dodgerBlue
      ]
    },
    map: {
      colors: {
        renderClearColor: mapColors.black,
        ambientColor: mapColors.mineShaft,
        groundColor: mapColors.cyan,
        lightColor: mapColors.cyan,
        midColor: mapColors.orient,
        error: mapColors.redBerry,
        warning: mapColors.gold,
        connectionColor: mapColors.flushOrange
      }
    }
  }
};
