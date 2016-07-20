import {goToRootOfView, PATH_NAMES, navigationParameters$, closeCurrentHelpIfOpen} from 'in-stores/navigation';
import {clearSelectedSnapshotId} from 'in-stores/snapshot';


let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => navigationParameters = _navigationParameters);


export default function onPressed() {
  if (!navigationParameters) {
    return;
  }

  const isSidebarInMapOpen = checkIfSidebarInMapisOpen();
  const isDashboardOpen = checkIfDashboardisOpen();
  const isHelpTextOpen = checkIfHelpTextIsOpen();

  if (isHelpTextOpen) {
    closeCurrentHelpIfOpen();
  } else if (isDashboardOpen) {
    goToRootOfView();
  } else if (isSidebarInMapOpen) {
    clearSelectedSnapshotId();
  }
}

function checkIfDashboardisOpen() {
  return /.*\/dashboard\/?.*/i.test(navigationParameters.pathname);
}


function checkIfSidebarInMapisOpen() {
  return 'snapshotId' in navigationParameters.query &&
         navigationParameters.pathname !== PATH_NAMES.DASHBOARD;
}

function checkIfHelpTextIsOpen() {
  return 'help' in navigationParameters.query;
}
