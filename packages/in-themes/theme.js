/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable strict */

'use strict';

// zIndex start at 100, because some components need to raise their content above
// sibling content. This is typically achieved by adding zIndex: 1. We start at
// zIndex 100 to avoid any conflicts.
let zIndex = 100;

module.exports = {
  zIndex: {
    timeline: zIndex++,
    overlaysInContentArea: zIndex++,
    // a select box can be within an overlay
    selectBoxFlyouts: zIndex++,
    mapOverlayControls: zIndex++,
    stickyHeader: (zIndex += 20),
    overlaysBehindSidebar: ++zIndex,
    detailPopupPresenter: ++zIndex,
    graphView: ++zIndex,
    slideInView: ++zIndex,
    mainNavigationBackground: ++zIndex,
    mainNavigation: ++zIndex,
    dialog: ++zIndex,
    tvMode: ++zIndex,
    overlays: ++zIndex,
    messageFlyout: ++zIndex,
    tooltips: ++zIndex
  },
  fontColor: '#222627',
  fontFamilySansSerif:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMonospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  links: {
    decoration: 'none',
    hover: {
      decoration: 'underline'
    }
  },
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
    ]
  },
  maxWidth: 1500,
  mainNavigationWidth: '4.5rem',
  grid: {
    gutter: 24,
    columns: 12
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: { r: 0.78, g: 0.84, b: 0.87 },
        top: { r: 0.957, g: 0.97, b: 0.98 }
      }
    }
  },

  lib: buildLib()
};

function buildLib() {
  const lib = {
    colors: {
      // black & white
      white: '#FFFFFF',
      black: '#000000',

      // neutral
      N050: '#FAFBFC',
      N100: '#F7F9FA',
      N200: '#F2F6F7',
      N300: '#DFE4E8',
      N400: '#D4D8DB',
      N500: '#6A7C8F',
      N600Light: '#637282',
      N700Medium: '#47525D',
      N800Dark: '#3C444D',
      N900Primary: '#1B2733',

      // chart
      pink800: '#E62E8A',
      purple800: '#BF73E6',
      deepPurple800: '#8257D9',
      indigo800: '#4D4DBF',
      blue800: '#2483B3',
      fadedBlue800: 'rgba(36,131,179,0.08)',

      lightBlue800: '#17A1E6',
      cyan800: '#00CCCC',
      fadedCyan800: 'rgba(0, 204, 204, 0.1)',
      teal800: '#00B3B3',
      fadedTeal800: 'rgba(0, 179, 179, 0.11)',
      green800: '#39BF7C',
      lime800: '#ADCC14',
      slushGreen800: '#4596A4',

      // Endpoint Colors
      batch: '#4FD3F8',
      database: '#EF914D',
      http: '#549EF8',
      messaging: '#69B116',
      rpc: '#93BEDC',
      event: '#69B116',

      // navy
      navy800: '#475E66',
      navy900: '#031F29',

      // health
      yellow800: '#FFC600',
      orange800: '#FF8C19',
      red800: '#FF4040',

      transparent: 'rgba(255, 255, 255, 0)',

      chart: {}
    },

    shapes: {
      radius_small: '2px',
      radius_medium: '3px',
      radius_large: '5px',
      radius_round: '50%'
    },

    shadows: {
      subtle: '0px 1px 4px 0px rgba(0, 0, 0, 0.16)',
      pronounced: '0px 2px 5px 0px rgba(0, 0, 0, 0.24)',
      strong: '0px 3px 10px 0px rgba(0, 0, 0, 0.24)',
      soft: '0px 0px 25px 0px rgba(0, 0, 0, 0.3)'
    },

    typography: {
      lineHeight: 1.15,
      h900: {
        fontSize: '5.375rem',
        fontWeight: 300
      },
      h800: {
        fontSize: '3.5rem',
        fontWeight: 400
      },
      h700: {
        fontSize: '2.375rem',
        fontWeight: 300
      },
      h600: {
        fontSize: '2.125rem',
        fontWeight: 300
      },
      h500: {
        fontSize: '1.625rem',
        fontWeight: 200
      },
      h400: {
        fontSize: '1.5rem',
        fontWeight: 500
      },
      h300: {
        fontSize: '1.375rem'
      },
      h200: {
        fontSize: '1rem'
      },
      h100: {
        fontSize: '0.75rem'
      },
      bodyLarge: {
        fontSize: '1rem'
      },
      bodyBold: {
        fontSize: '0.875rem',
        fontWeight: 'bold'
      },
      body: {
        fontSize: '0.875rem'
      },
      bodySmall: {
        fontSize: '0.75rem'
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500
      }
    }
  };

  // primary
  lib.colors.primary1 = lib.colors.teal800;
  lib.colors.primary2 = lib.colors.blue800;

  // success & failure
  lib.colors.success = lib.colors.green800;
  lib.colors.failure = lib.colors.red800;
  lib.colors.warning = lib.colors.yellow800;

  // table
  lib.colors.tableRowSelectedOdd = lib.colors.fadedTeal800;
  lib.colors.tableRowSelectedEven = lib.colors.fadedCyan800;

  // stroke colors
  lib.colors.chart.strokeColors100 = [
    lib.colors.lightBlue800,
    lib.colors.green800,
    lib.colors.orange800,
    lib.colors.deepPurple800,
    lib.colors.cyan800,
    lib.colors.lime800,
    lib.colors.pink800,
    lib.colors.teal800,
    lib.colors.purple800,
    lib.colors.indigo800,
    lib.colors.batch,
    lib.colors.database,
    lib.colors.http,
    lib.colors.messaging,
    lib.colors.rpc,
    lib.colors.event,
    lib.colors.red800
  ];

  lib.colors.chart.strokeColors25 = lib.colors.chart.strokeColors100.map(hex => addTransparency(hex, 0.05));
  lib.colors.chart.strokeColors50 = lib.colors.chart.strokeColors100.map(hex => addTransparency(hex, 0.15));

  // self
  lib.colors.chart.self100 = lib.colors.N500;
  lib.colors.chart.self25 = addTransparency(lib.colors.chart.self100, 0.05);

  lib.colors.chartSelection = 'rgba(75, 165, 210, 0.2)';
  lib.colors.timeShift = lib.colors.N400;

  lib.colors.primary240 = addTransparency(lib.colors.blue800, 0.4);
  lib.colors.lightPrimary240 = addTransparency(lib.colors.lightBlue800, 0.4);
  lib.colors.success40 = addTransparency(lib.colors.success, 0.4);
  lib.colors.failure10 = addTransparency(lib.colors.failure, 0.1);

  return lib;
}

function addTransparency(hex, opacity) {
  const rgb = hexToRGB(hex);
  rgb.r = 255 * (1 - opacity) + rgb.r * opacity;
  rgb.g = 255 * (1 - opacity) + rgb.g * opacity;
  rgb.b = 255 * (1 - opacity) + rgb.b * opacity;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function rgbToHex(r, g, b) {
  const hex = (r << 16) ^ (g << 8) ^ (b << 0);
  return '#' + ('000000' + hex.toString(16)).slice(-6);
}

function hexToRGB(style) {
  const color = /^#([0-9a-f]{6})$/i.exec(style);
  let hex = parseInt(color[1], 16);

  hex = Math.floor(hex);

  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return { r, g, b };
}
