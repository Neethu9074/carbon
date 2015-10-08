/*eslint-env node*/
/*eslint-disable no-var*/

var _ = require('lodash');
var base = require('instana-ui-theme/dist/night/config.json');

var common = require('./common');

var white = '#ffffff';
var grey0 = '#eef2f4';
var grey1 = '#6b8088';
var grey2 = '#576e76';
var grey3 = '#435b64';
var grey4 = '#3b4d55';
var grey5 = '#2d4048';
var grey6 = '#203036';
var cyan = '#9fffff';
var health = [
  grey0,
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
      background: grey5,
      plugin: grey1,
      heading: white,
      defaultButtonBackground: grey1,
      defaultButtonText: white,
      defaultButtonBackgroundHightlight: grey0,
      defaultButtonTextHighlight: grey6
    },
    discriptionList: {
      title: grey5,
      text: grey1
    },
    list: {
      background: grey0,
      text: grey5
    },
    viewDashboardButton: {
      background: grey6
    },
    tabs: {
      background: grey1,
      backgroundHighlight: white,
      backgroundHover: grey0,
      line: grey0
    },
    tags: {
      border: grey0,
      text: grey5,
      backgroundHighlight: '#FF0000'
    },
    background: white,
    problemStart: grey6
  },
  collapsible: {
    header: {
      closedText: grey0,
      openedText: grey3
    },
    line: grey0
  },
  timeline: {
    changeTimeButton: cyan,
    timeRangeLabel: white,
    background: grey5,
    serverTime: grey1,
    line: grey3
  },
  filterbar: {
    background: grey6,
    controls: {
      label: white,
      labelHighlight: cyan,
      background: {
        regular: grey1,
        regularHover: grey3,
        active: grey5,
        activeHover: grey6
      },
      closeButtonIcon: cyan,
      closeButtonIconHighlight: white,
      closeButtonLabel: white,
      closeButtonLabelHighlight: white,
      resetButtonIcon: cyan,
      resetButtonIconHighlight: white,
      resetButtonLabel: grey1,
      resetButtonLabelHighlight: white,
      listHeader: white,
      metricsLabel: white,
      metricsLabelBackgroundHighlight: grey5
    }
  },
  menu: {
    background: grey6,
    sectionLine: grey5,
    sectionLabelHighlight: white,
    sectionLabel: cyan,
    signoutLabel: grey1
  },
  settings: {
    heading: {
      text: grey0,
      background: grey6
    },
    background: grey5,
    sectionLine: grey3,
    entryText: grey0,
    helpText: grey1
  },
  dashboard: {
    background: white,
    header: {
      background: grey6,
      backToMapButtonLabel: grey1,
      backToMapButtonLabelHighlight: white,
      backToMapButtonIcon: cyan,
      backToMapButtonIconHighlight: white
    },
    tabs: {
      text: grey1,
      textHighlight: grey5,
      line: grey0
    }
  },
  mapViewSwitcher: {
    background: grey1,
    backgroundHighlight: white,
    label: white,
    labelHighlight: grey6
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
      warning: health[5],
      critical: health[10],
      groundDots: '#809199'
    },
    stickyNotes: {
      nodeHightlightBackgroundColor: grey5
    },
    tooltips: {
      font: white,
      background: '#000000',
      critical: health[5],
      danger: health[10]
    }
  }
}, base, common);
