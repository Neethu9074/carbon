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
  pink2: '#FF3A8B',
  pink3: '#FF58A9',
  pink4: '#FF6CC7',

  'purple_light': '#A526BB',
  'purple_light2': '#C344D9',
  'purple_light3': '#E162F7',
  'purple_light4': '#FF80FF',

  purple: '#6A3BBD',
  purple2: '#8859DB',
  purple3: '#A681F9',
  purple4: '#C49FFF',

  'slate_blue': '#3F51B5',
  'slate_blue2': '#5D6FD3',
  'slate_blue3': '#7B8DF1',
  'slate_blue4': '#99ABFF',

  blue: '#269AF6',
  blue2: '#44B8FF',
  blue3: '#62D6FF',
  blue4: '#80F4FF',

  cyan: '#00C9E3',
  cyan2: '#1EE7FF',
  cyan3: '#3CFFFF',
  cyan4: '#5AFFFF',

  teal: '#00A696',
  teal2: '#1EC4B4',
  teal3: '#3CE2D2',
  teal4: '#5AFFF0',

  green: '#4CBB51',
  green2: '#6AD96F',
  green3: '#88F78D',
  green4: '#A6FFAB',

  'green_light': '#8BC34A',
  'green_light2': '#A9E168',
  'green_light3': '#C7FF86',
  'green_light4': '#E5FFA4',

  lime: '#D0E035',
  lime2: '#EEFE53',
  lime3: '#FFFF71',
  lime4: '#FFFF8F',

  orange: '#FF9800',
  orange2: '#FFB61E',
  orange3: '#FFD43C',
  orange4: '#FFF25A'
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
        renderClearGradient1: '#435964', //left bottom
        renderClearGradient2: '#2B3F46', //top right
        warning: colors.warning,
        critical: colors.critical,
        'default': colors.default,
        connection: metricColors.cyan,
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
        'hsl(54, 71%, 56%)',
        'hsl(263, 100%, 81%)',
        'hsl(331, 100%, 67%)'
      ],

      fillColors: [
        'hsla(205, 63%, 61%, 0.3)',
        'hsla(125, 41%, 56%, 0.3)',
        'hsla(54, 71%, 56%, 0.3)',
        'hsla(263, 100%, 81%, 0.3)',
        'hsla(331, 100%, 67%, 0.3)'
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
