/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/day/config.json');

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
        right: {r: 0.469, g: 0.54, b: 0.57},
        top: {r: 0.687, g: 0.76, b: 0.79}
      },
      cubeBasicColor: '#60747c',
      clearColor: '#879ea6',
      warning: colors.warning,
      critical: colors.danger,
      groundDots: '#c4cfd3'
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
