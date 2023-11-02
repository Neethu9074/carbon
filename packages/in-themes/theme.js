/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable strict */

'use strict';

const carbonColors = require('@carbon/colors');

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
  const carbonCategorical = {
    purple70: carbonColors.purple70,
    cyan50: carbonColors.cyan50,
    teal70: carbonColors.teal70,
    magenta70: carbonColors.magenta70,
    red50: carbonColors.red50,
    red90: carbonColors.red90,
    green60: carbonColors.green60,
    blue80: carbonColors.blue80,
    magenta50: carbonColors.magenta50,
    yellow50: carbonColors.yellow50,
    teal50: carbonColors.teal50,
    cyan90: carbonColors.cyan90,
    orange70: carbonColors.orange70,
    purple50: carbonColors.purple50
  };
  const carbonAlert = {
    red60: carbonColors.red60,
    green50: carbonColors.green50,
    orange40: carbonColors.orange40,
    orange60: carbonColors.orange60,
    yellow30: carbonColors.yellow30,
    yellow60: carbonColors.yellow60,
    blue70: carbonColors.blue70,
    purple50: carbonColors.purple50,
    gray60: carbonColors.gray60
  };
  const lib = {
    carbonCategorical,
    carbonAlert,
    // Certain alert colors need outlines for visual accessibility
    outlineForColor: {
      [carbonAlert.orange40]: carbonAlert.orange60,
      [carbonAlert.yellow30]: carbonAlert.yellow60
    },
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

  // carbon three color palette
  lib.colors.chart.threeColorPalette = [
    lib.carbonCategorical.magenta50,
    lib.carbonCategorical.cyan50,
    lib.carbonCategorical.purple70
  ];

  // carbon four color palette
  lib.colors.chart.fourColorPalette = [
    lib.carbonCategorical.purple70,
    lib.carbonCategorical.cyan90,
    lib.carbonCategorical.teal50,
    lib.carbonCategorical.magenta50
  ];

  // carbon five color palette
  lib.colors.chart.fiveColorPalette = [
    lib.carbonCategorical.purple70,
    lib.carbonCategorical.cyan50,
    lib.carbonCategorical.teal70,
    lib.carbonCategorical.magenta70,
    lib.carbonCategorical.red90
  ];

  // stroke colors
  lib.colors.chart.strokeColors100 = [
    lib.carbonCategorical.cyan50,
    lib.carbonCategorical.teal70,
    lib.carbonCategorical.purple70,
    lib.carbonCategorical.magenta70,
    lib.carbonCategorical.red50,
    lib.carbonCategorical.red90,
    lib.carbonCategorical.green60,
    lib.carbonCategorical.blue80,
    lib.carbonCategorical.magenta50,
    lib.carbonCategorical.yellow50,
    lib.carbonCategorical.teal50,
    lib.carbonCategorical.cyan90,
    lib.carbonCategorical.orange70,
    lib.carbonCategorical.purple50,
    lib.colors.rpc,
    lib.colors.event,
    lib.carbonAlert.red60
  ];

  lib.colors.chart.strokeColors25 = lib.colors.chart.strokeColors100.map(hex => lighten(hex, 0.05));
  lib.colors.chart.strokeColors50 = lib.colors.chart.strokeColors100.map(hex => lighten(hex, 0.15));

  // self
  lib.colors.chart.self100 = lib.colors.N500;
  lib.colors.chart.self25 = lighten(lib.colors.chart.self100, 0.05);

  lib.colors.chartSelection = 'rgba(75, 165, 210, 0.2)';
  lib.colors.timeShift = carbonColors.gray60;

  lib.colors.primary240 = lighten(lib.colors.blue800, 0.4);
  lib.colors.lightPrimary240 = lighten(lib.colors.lightBlue800, 0.4);
  lib.colors.success40 = lighten(lib.colors.success, 0.4);
  lib.colors.failure10 = lighten(lib.colors.failure, 0.1);

  return lib;
}

// this was copied over from packages/in-services/formatters/color.ts
function lighten(hex, opacity) {
  const rgb = hexToRGB(hex);
  rgb.r = 255 * (1 - opacity) + rgb.r * opacity;
  rgb.g = 255 * (1 - opacity) + rgb.g * opacity;
  rgb.b = 255 * (1 - opacity) + rgb.b * opacity;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

function hexToRGB(style) {
  const color = /^#([0-9a-f]{6})$/i.exec(style) ?? [];
  let hex = parseInt(color[1], 16);

  hex = Math.floor(hex);

  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const hex = (r << 16) ^ (g << 8) ^ (b << 0);
  return '#' + ('000000' + hex.toString(16)).slice(-6);
}
