import { goToRootOfView, navigationParameters$, closeCurrentHelpIfOpen } from 'in-stores/navigation';
import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { activeDialogs$, close } from 'in-components/DialogPresenter/store';
import { disableTvMode } from 'in-new-components/WithTvMode';
import { clearSelectedSnapshotId } from 'in-stores/snapshot';

let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => (navigationParameters = _navigationParameters));

export default function onPressed() {
  disableTvMode();

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

  activeDialogs$.once(activeDialogs => {
    if (activeDialogs.length > 0) {
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
  return 'snapshotId' in navigationParameters.query && navigationParameters.pathname !== '/dasboard';
}

function checkIfHelpTextIsOpen() {
  return 'help' in navigationParameters.query;
}
