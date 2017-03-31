import { goToRootOfView, PATH_NAMES, navigationParameters$, closeCurrentHelpIfOpen } from 'in-stores/navigation';
import { activeDialog$, close } from 'in-components/DialogPresenter/store';
import { clearSelectedSnapshotId } from 'in-stores/snapshot';

let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => navigationParameters = _navigationParameters);

let activeDialog;
activeDialog$.subscribe(_activeDialog => activeDialog = _activeDialog);

export default function onPressed() {
  if (!navigationParameters) {
    return;
  }

  if (checkIfHelpTextIsOpen()) {
    closeCurrentHelpIfOpen();
  } else if (activeDialog != null) {
    close();
  } else if (checkIfDashboardisOpen()) {
    goToRootOfView();
  } else if (checkIfSidebarInMapisOpen()) {
    clearSelectedSnapshotId();
  }
}

function checkIfDashboardisOpen() {
  return /.*\/dashboard\/?.*/i.test(navigationParameters.pathname);
}

function checkIfSidebarInMapisOpen() {
  return 'snapshotId' in navigationParameters.query && navigationParameters.pathname !== PATH_NAMES.DASHBOARD;
}

function checkIfHelpTextIsOpen() {
  return 'help' in navigationParameters.query;
}
