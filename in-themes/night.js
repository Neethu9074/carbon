/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/night/config.json');

var common = require('./common');

var white = '#ffffff';
var lightestGrey = '#dce3e6';
var lightGrey = '#6b8088';
var grey = '#435b64';
var darkGrey = '#2d4048';
var darkestGrey = '#203036';
var cyan = '#9fffff';
var health = [
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
];

module.exports = _.defaultsDeep({
  sidebar: {
    header: {
      background: darkGrey,
      plugin: lightestGrey,
      heading: white
    },
    viewDashboardButton: {
      background: darkestGrey
    },
    background: white
  },
  timeline: {
    changeTimeButton: cyan,
    timeRangeLabel: white,
    background: darkGrey,
    serverTime: lightGrey,
    line: grey
  },
  filterbar: {
    background: darkestGrey,
    controls: {
      label: white,
      labelHighlight: cyan,
      background: {
        regular: lightGrey,
        regularHover: grey,
        active: darkGrey,
        activeHover: darkestGrey
      },
      closeButtonIcon: cyan,
      closeButtonIconHighlight: white,
      closeButtonLabel: lightGrey,
      closeButtonLabelHighlight: white,
      resetButtonIcon: cyan,
      resetButtonIconHighlight: white,
      resetButtonLabel: lightGrey,
      resetButtonLabelHighlight: white,
      listHeader: white,
      metricsLabel: white,
      metricsLabelBackgroundHighlight: darkGrey
    }
  },
  health,
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
      warning: '#FF0000',
      critical: '#00FF00',
      groundDots: '#809199'
    },
    stickyNotes: {
      nodeHightlightBackgroundColor: darkGrey
    },
    tooltips: {
      font: white,
      background: '#000000',
      critical: '#FF0000',
      danger: '#00FF00'
    }
  }
}, base, common);
