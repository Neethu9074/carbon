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
    footer: zIndex++,
    fullscreenView: zIndex++,
    footerSelectedTimeNotification: zIndex++,
    mapNotes: zIndex++,

    searchMenu: zIndex++,
    searchBar: zIndex++,
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
    temporaryNotification: zIndex++
  }
};
