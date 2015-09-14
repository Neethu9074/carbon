/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/night/config.json');

var common = require('./common');

var colors = {
  white: '#FFFFFF',
  black: '#121416',
  darkGrey: '#20272C',
  grey: '#44535D',
  highlight: '#9FFFFF',
  default: '#667B86',
  warning: '#FFD823',
  danger: '#FF4229'
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

module.exports = _.defaultsDeep({
  sidebar: {
    background: 'rgba(47, 67, 76, 0.95)'
  },
  footer: {
    height: 50
  },
  map: {
    colors: {
      renderClearGradient1: '#435964', //left bottom
      renderClearGradient2: '#2B3F46', //top right
      warning: colors.warning,
      critical: colors.danger,
      default: colors.default,
      layer: '#8ea2ad',
      connection: metricColors.cyan,
      unknownStatus: colors.grey,
      zones: [
        '#27AF90',
        metricColors.orange,
        '#7CBEF2',
        '#BBCE24',
        metricColors.cyan,
        metricColors.slate_blue,
        metricColors.lime,
        metricColors.purple,
        metricColors.teal
      ]
    },
    metricColors: metricColors,
    stickyNotes: {
      nodeHightlightBackgroundColor: colors.darkGrey
    },
    tooltips: {
      font: colors.white,
      background: colors.black,
      critical: colors.warning,
      danger: colors.danger
    }
  }
}, base, common);
