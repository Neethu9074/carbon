'use strict';

var colors = {
  white: '#FFFFFF',
  black: '#121416',
  darkGrey: '#20272C',
  grey: '#44535D',
  highlight: '#9FFFFF',
  default: '#829EB1',
  warning: '#FFD823',
  critical: '#FF4229'
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
    map: {
      colors: {
        renderClearGradient1: colors.darkGrey,
        renderClearGradient2: colors.grey,
        warning: colors.warning,
        critical: colors.critical,
        default: colors.default,
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
