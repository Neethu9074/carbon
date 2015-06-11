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

var metricColors = {
  pink: '#ED1C63',
  'purple_light': '#A526BB',
  purple: '#6A3BBD',
  'slate_blue': '#3F51B5',
  blue: '#269AF6',
  cyan: '#00C9E3',
  teal: '#00A696',
  green: '#4CBB51',
  'green_light': '#8BC34A',
  lime: '#D0E035',
  orange: '#FF9800'
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
      sidebar: 2,
      header: 3,
      footer: 3,
      notificationCenter: 5,
      detailPane: 5,
      flyOutNotifications: 6
    },
    map: {
      colors: {
        renderClearGradient1: colors.darkGrey,
        renderClearGradient2: colors.grey,
        warning: colors.warning,
        critical: colors.critical,
        default: colors.default,
        connection: colors.highlight,
        unknownStatus: colors.grey,
        zones: [
          metricColors.orange,
          metricColors.cyan,
          metricColors.slate_blue,
          metricColors.purple,
          metricColors.lime,
          metricColors.teal
        ]
      },
      metricColors: metricColors
    },
    chart: {
      strokeColors: [
        'hsl(205, 63%, 61%)',
        'hsl(125, 41%, 56%)',
        'hsl(54, 71%, 56%)'
      ],

      fillColors: [
        'hsla(205, 63%, 61%, 0.3)',
        'hsla(125, 41%, 56%, 0.3)',
        'hsla(54, 71%, 56%, 0.3)'
      ]
    }
  },
  day: {
    map: {
      colors: {
      }
    }
  }
};
