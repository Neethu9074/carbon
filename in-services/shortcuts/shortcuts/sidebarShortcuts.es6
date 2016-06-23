import {combineLatest} from 'reactive-observables';

import {PATH_NAMES, navigationParameters$} from 'in-stores/navigation';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';


export function register(registerShortcut, unregisterShortcut, keyCodes) {
  combineLatest([
    navigationParameters$.map(params => params.query && 'snapshotId' in params.query).distinct(),
    navigationParameters$.map(params => params.pathname !== PATH_NAMES.DASHBOARD).distinct()
  ])
  .map(([isSnapshotIdSelected, isDashboardClosed]) => isDashboardClosed && isSnapshotIdSelected)
  .distinct()
  .subscribe(subscribeToShortcut => subscribeToShortcut ?
                                      registerShortcut(keyCodes.ESC, onEscOnSidebarInMap) :
                                      unregisterShortcut(keyCodes.ESC, onEscOnSidebarInMap)
  );
}

function onEscOnSidebarInMap() {
  clearSelectedSnapshotId();
}
