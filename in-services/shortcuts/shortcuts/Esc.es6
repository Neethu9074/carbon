import {goToMap, PATH_NAMES, navigationParameters$, closeHelpIfOpen} from 'in-stores/navigation';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';


let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => navigationParameters = _navigationParameters);


export default function onPressed() {
  if (!navigationParameters) {
    return;
  }

  const isSidebarInMapOpen = checkIfSidebarInMapisOpen();
  const isDashboardOpen = checkIfDashboardisOpen();

  if (isDashboardOpen) {
    checkIfHelpTextIsOpen() ?
      closeHelpIfOpen() :
      goToMap();
  } else if (isSidebarInMapOpen) {
    clearSelectedSnapshotId();
  }
}

function checkIfDashboardisOpen() {
  return navigationParameters.pathname === PATH_NAMES.DASHBOARD;
}


function checkIfSidebarInMapisOpen() {
  return 'snapshotId' in navigationParameters.query &&
         navigationParameters.pathname !== PATH_NAMES.DASHBOARD;
}

function checkIfHelpTextIsOpen() {
  return 'help' in navigationParameters.query;
}
