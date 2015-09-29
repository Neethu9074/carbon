/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/night/config.json');

var common = require('./common');

var colors = {
  white: '#ffffff',
  lightestGrey: '#dce3e6',
  lightGrey: '#6b8088',
  grey: '#435b64',
  darkGrey: '#2d4048',
  darkestGrey: '#203036',
  cyan: '#9fffff',
  health: [
    '#e3e2b8',
    '#eae18a',
    '#f1e05c',
    '#f8df2e',
    '#ffde00',
    '#ffbf08',
    '#ffa010',
    '#ff8019',
    '#ff6121',
    '#ff4229'
  ]
};

module.exports = _.defaultsDeep({
  sidebar: {
    background: 'rgb(45, 64, 72)'
  },
  footer: {
    height: 32
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: {r: 0.78, g: 0.84, b: 0.87},
        top: {r: 0.957, g: 0.97, b: 0.98}
      },
      cubeBasicColor: '#e9edef',
      clearColor: '#445b63',
      warning: colors.warning,
      critical: colors.danger,
      groundDots: '#809199'
    },
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
