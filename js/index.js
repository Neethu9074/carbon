'use strict';

var colors = {
  cyan: '#2dfffe',
  razzmatazz: '#e50066',
  easternBlue: '#1d90a9',
  governorBay: '#3d2dcf',
  toryBlue: '#0b5cad',
  dodgerBlue: '#15aafe',
  black: '#000000',
  mineShaft: '#202020',
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
        colors.cyan,
        colors.razzmatazz,
        colors.easternBlue,
        colors.governorBay,
        colors.toryBlue,
        colors.dodgerBlue
      ]
    },
    map: {
      colors: {
        renderClearColor: colors.black,
        ambientColor: colors.mineShaft,
        groundColor: colors.cyan,
        lightColor: colors.cyan,
        midColor: colors.orient,
        error: colors.redBerry,
        warning: colors.gold,
        connectionColor: colors.flushOrange
      }
    }
  },
  day: {
    map: {
      colors: {
        renderClearColor: colors.flushOrange,
        ambientColor: colors.gold,
        groundColor: colors.redBerry,
        lightColor: colors.orient,
        midColor: colors.cyan,
        error: colors.cyan,
        warning: colors.mineShaft,
        connectionColor: colors.black
      }
    }
  }
};
