'use strict';

var colors = {
  cyan: '#2dfffe',
  razzmatazz: '#e50066',
  easternBlue: '#1d90a9',
  governorBay: '#3d2dcf',
  toryBlue: '#0b5cad',
  dodgerBlue: '#15aafe',
  bunker: '#0d1217'
};

// first level is the color theme's name
exports.consts = {
  night: {
    common: {
      fontFamily: 'sans-serif',
      fontColor: '#ddd'
    },
    charts: {
      areaChart: {
        area1: colors.cyan,
        background: colors.mineShaft
      },

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
        renderClearColor: colors.bunker
      }
    }
  },
  day: {
    map: {
      colors: {
      }
    }
  }
};
