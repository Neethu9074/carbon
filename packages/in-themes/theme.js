/* eslint-env node */
/* eslint-disable strict */

'use strict';

let zIndex = 1;

module.exports = {
  zIndex: {
    stickyHeader: (zIndex += 20),
    timeline: zIndex++,
    detailPopupPresenter: zIndex++,
    graphView: zIndex++,
    overlays: zIndex++,
    tooltips: zIndex++,
    dialog: zIndex++,
    subMenu: zIndex++,
    messageFlyout: zIndex++
  },
  fontColor: '#0C1415',
  fontFamilySansSerif:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontFamilyMonospace: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  links: {
    fontColor: '#2d4048',
    decoration: 'underline',
    hover: {
      fontColor: '#8c969a',
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
  app20Chart: {
    strokeColors25: ['#c6eaff', '#c5daf5', '#ffe5bf', '#e7dbf7', '#fcd8e4', '#e2efd2', '#e9edef', '#cfece6'],
    strokeColors50: ['#76ceff', '#74a5e7', '#ffc167', '#c4a9ec', '#f7a2bf', '#badb94', '#cad4d9', '#8dd2c3'],
    strokeColors100: ['#00bdff', '#1457ff', '#ff9700', '#9c6dde', '#f06392', '#8bc24a', '#a5b6be', '#3eb39a']
  },
  maxWidth: 1400,
  grid: {
    gutter: 24,
    columns: 12
  },
  footer: {
    height: 36,
    heightExpanded: 97,
    heightOpen: 171
  },
  header: {
    height: 80
  },
  map: {
    colors: {
      cubeColorFalloffValues: {
        right: { r: 0.78, g: 0.84, b: 0.87 },
        top: { r: 0.957, g: 0.97, b: 0.98 }
      }
    }
  }
};
