/* eslint-env node */
/* eslint-disable no-var */

var defaultsDeep = require('lodash/defaultsDeep');

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
  white,
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


module.exports = defaultsDeep({
  common: {
    fontColor: '#fcfcfc',
    backgroundColor: '#0D1217',
    highlightColor: '#94eced',
    subtleText: '#ccc',
    panelBackgroundColor: '#2d4047',
    textfieldBackgroundColor: '#435b65',
    textfieldForegroundColor: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  tenantSwitcher: {
    headlineBackgroundColor: '#435b65',
    headlineBorderColor: '#2d4048',
    fontColor: '#fff',
    linkHoverColor: '#6c8087',
    linkColor: '#fff',
    triangleColor: '#6b7f88',
    tagColor: '#62c0ec'
  },
  fontFamilySansSerif: '-apple-system, BlinkMacSystemFont, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontFamilySerif: 'Georgia, "Times New Roman", Times, serif',
  fontFamilyMonospace: 'Menlo, Monaco, Consolas, "Courier New", monospace',
  chart: {
    strokeColors: [
      '#5da6da',
      '#61bd68',
      '#decf3f',
      '#c39eff',
      '#ff57a8',
      '#ff9800',
      '#d03035',
      '#d0e035',
      '#9999cc',
      '#965742'
    ],
    fillColors: [
      'rgba(93, 166, 218, 0.3)',
      'rgba(97, 189, 104, 0.3)',
      'rgba(222, 207, 63, 0.3)',
      'rgba(195, 158, 255, 0.3)',
      'rgba(255, 87, 168, 0.3)',
      'rgba(255, 152, 0, 0.3)',
      'rgba(208, 48, 53, 0.3)',
      'rgba(208, 224, 53, 0.3)',
      'rgba(153, 153, 204, 0.3)',
      'rgba(150, 87, 66, 0.3)'
    ]
  },
  sidebar: {
    width: 342,
    header: {
      background: grey5,
      plugin: grey1,
      heading: white,
      defaultButtonBackground: grey1,
      defaultButtonText: white,
      defaultButtonBackgroundHightlight: grey2,
      defaultButtonTextHighlight: white
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
      background: grey6
    },
    tags: {
      border: grey0,
      borderHighlight: '#dce3e6',
      text: grey5,
      textHighlight: white,
      backgroundHighlight: grey5
    },
    keyValuePopup: {
      width: '600px',
      border: grey0,
      title: grey4,
      text: grey1
    },
    background: white,
    problemStart: grey6
  },
  collapsible: {
    line: grey0,
    header: {
      closedText: 'rgba(107, 128, 136, 0.5)',
      openedText: grey1
    }
  },
  datepicker: {
    matte: grey3,
    highlight: '#fff'
  },
  timeline: {
    timeRangeLabel: white,
    background: grey5,
    line: grey3,
    timepicker: {
      timeRangePicker: {
        buttonBackground: grey1,
        buttonForeground: white,
        buttonBackgroundHighlight: white,
        buttonForegroundHighlight: grey1
      },
      fixedTimeWindowPicker: {

      },
      panelBorder: grey3,
      selection: {
        icon: cyan,
        heading: white,
        text: grey1,
        textSelected: '#C3DAF6'
      }
    }
  },
  filterbar: {
    background: grey6,
    metrics: {
      collapsible: {
        line: grey5,
        textOpened: white,
        textClosed: grey1
      },
      leaf: {
        text: grey1,
        textHighlight: white,
        backgroundHighlight: grey5
      }
    },
    nodes: {
      text: grey1,
      textHighlight: white,
      backgroundHighlight: grey5
    },
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
      listHeader: white
    },
    tags: {
      border: grey5,
      text: white,
      backgroundHighlight: grey5,
      noTagsDefinedText: grey1
    }
  },
  menu: {
    background: grey6,
    sectionLine: grey5,
    sectionLabelHighlight: white,
    sectionLabel: cyan,
    signoutLabel: grey1
  },
  notificationCenter: {
    background: grey6,
    backgroundHighlight: grey5,
    statusBarBackground: grey6
  },
  settings: {
    heading: {
      text: white,
      background: grey6
    },
    background: grey6,
    sectionLine: grey3,
    entryText: white,
    helpText: grey1,
    closeButtonColor: grey6
  },
  dashboard: {
    background: white,
    header: {
      background: grey6,
      backToMapButtonLabel: grey1,
      backToMapButtonLabelHighlight: white,
      backToMapButtonIcon: cyan,
      backToMapButtonIconHighlight: white,
      breadcrumb: {
        text: grey1,
        textHover: white
      }
    },
    tabs: {
      text: grey1,
      textHighlight: grey5,
      line: grey0
    },
    charts: {
      roolupIndicatior: {
        text: grey1,
        backgroundHighlight: grey0
      }
    }
  },
  mapViewSwitcher: {
    background: grey1,
    backgroundHover: grey3,
    backgroundHighlight: white,
    label: white,
    labelHighlight: grey6
  },
  helpDialog: {
    background: white,
    text: grey1
  },
  health,
  footer: {
    height: 36,
    heightExpanded: 97,
    heightOpen: 171
  },
  header: {
    height: 40
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: {r: 0.78, g: 0.84, b: 0.87},
        top: {r: 0.957, g: 0.97, b: 0.98}
      },
      cubeBasicColor: '#e9edef',
      layerBasicColor: '#e9edef',
      clearColor: '#445b63',
      warning: health[5],
      critical: health[10],
      groundDots: '#809199'
    },
    stickyNotes: {
      nodeHightlightBackgroundColor: grey5,
      processGroups: {
        fontColor: grey3
      }
    },
    tooltips: {
      font: white,
      background: grey6,
      critical: health[5],
      danger: health[10]
    }
  }
}, common);
