/* eslint-env node */
/* eslint-disable strict */

'use strict';

let zIndex = 1;

module.exports = {
  zIndex: {
    viewControls: zIndex++,
    sidebar: zIndex++,
    fullscreenView: zIndex++,
    footer: zIndex++,
    fullscreenViewOverlayTimeline: zIndex++,
    footerTimePicker: zIndex++,
    mapNotes: zIndex++,
    searchMenu: zIndex++,
    searchBar: zIndex++,
    searchSuggestions: zIndex++,
    fullscreenViewOverlaySearchBar: zIndex++,
    header: zIndex++,
    viewSwitcher: zIndex++,
    detailPopupPresenter: zIndex++,
    graphView: zIndex++,
    tooltips: zIndex++,
    dialog: zIndex++,
    subMenu: zIndex++,
    messageFlyout: zIndex++
  },
  common: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
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
    ]
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
