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
      fontFamily: '\'Open Sans\', sans-serif',
      fontColor: '#fcfcfc',
      backgroundColor: '#0D1217'
    },
    zIndex: {
      stickyNotes: 1,
      header: 2,
      footer: 2,
      sidebar: 2,
      flyOutNotifications: 3,
      notificationCenter: 4,
      detailPane: 5
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
        renderClearColor: colors.bunker,
        zones: [
          '#80bff0',
          '#31ad90',
          '#e9d17d',
          '#7BD7D5'
        ]
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
