import {goToMap, PATH_NAMES, navigationParameters$} from 'in-stores/navigation';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';


let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => navigationParameters = _navigationParameters);


export default function onPressed() {
  const isDashboardOpen = checkIfDashboardisOpen();
  const isSidebarInMapOpen = checkIfSidebarInMapisOpen();

  if (isDashboardOpen) {
    goToMap();
  } else if (isSidebarInMapOpen) {
    clearSelectedSnapshotId();
  }
}

function checkIfDashboardisOpen() {
  return navigationParameters &&
         navigationParameters.pathname === PATH_NAMES.DASHBOARD;
}


function checkIfSidebarInMapisOpen() {
  return navigationParameters &&
         'snapshotId' in navigationParameters.query &&
         navigationParameters.pathname !== PATH_NAMES.DASHBOARD;
}
