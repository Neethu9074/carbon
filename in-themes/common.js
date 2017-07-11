/* eslint-env node */
/* eslint-disable strict */

'use strict';

let zIndex = 1;

module.exports = {
  zIndex: {
    map: zIndex++,
    stickyNotes: zIndex++,
    viewControls: zIndex++,
    sidebar: zIndex++,
    fullscreenView: zIndex++,
    footer: zIndex++,
    fullscreenViewOverlayTimeline: zIndex++,
    footerSelectedTimeNotification: zIndex++,
    footerTimePicker: zIndex++,
    mapNotes: zIndex++,

    searchMenu: zIndex++,
    searchBar: zIndex++,
    searchSuggestions: zIndex++,
    header: zIndex++,
    viewSwitcher: zIndex++,
    accountMenu: zIndex++,

    detailPopupPresenter: zIndex++,
    graphView: zIndex++,
    toast: zIndex++,
    tooltips: zIndex++,
    maintenanceNote: zIndex++,
    messageFlyout: zIndex++,
    backdrop: zIndex++,
    dialog: zIndex++,
    subMenu: zIndex++,
  }
};
