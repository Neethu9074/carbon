/* eslint-env node */
/* eslint-disable no-var */

var defaultsDeep = require('lodash/defaultsDeep');
var common = require('./common');

module.exports = defaultsDeep(
  {
    common: {
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
    fontFamilySansSerif:
      '-apple-system, BlinkMacSystemFont, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
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
      ]
    },
    map: {
      colors: {
        cubeColorFalloffValues: {
          right: { r: 0.78, g: 0.84, b: 0.87 },
          top: { r: 0.957, g: 0.97, b: 0.98 }
        }
      }
    }
  },
  common
);
