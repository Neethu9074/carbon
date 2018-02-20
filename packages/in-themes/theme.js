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
