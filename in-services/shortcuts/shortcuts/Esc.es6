import { goToRootOfView, PATH_NAMES, navigationParameters$, closeCurrentHelpIfOpen } from 'in-stores/navigation';
import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { activeDialog$, close } from 'in-components/DialogPresenter/store';
import { clearSelectedSnapshotId } from 'in-stores/snapshot';

let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => (navigationParameters = _navigationParameters));

export default function onPressed() {
  if (!navigationParameters) {
    return;
  }
  if (checkIfHelpTextIsOpen()) {
    closeCurrentHelpIfOpen();
  } else if (checkIfDashboardisOpen()) {
    goToRootOfView();
  } else if (checkIfSidebarInMapisOpen()) {
    clearSelectedSnapshotId();
  }

  activeDialog$.once(activeDialog => {
    if (activeDialog != null) {
      close();
    }
  });

  presetsVisible$.once(isVisible => {
    if (isVisible) {
      togglePresets();
    }
  });
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
