/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/night/config.json');

var common = require('./common');

var colors = {
  white: '#FFFFFF',
  black: '#121416',
  darkGrey: '#20272C',
  warning: '#FFD823',
  danger: '#FF4229'
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
