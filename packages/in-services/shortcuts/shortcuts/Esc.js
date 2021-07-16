/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { togglePresets, presetsVisible$ } from 'in-components/SearchBar/stores/presetsVisibility';
import { activeDialogs$, close } from 'in-components/DialogPresenter/store';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { clearSelectedSnapshotId } from 'in-stores/snapshot';
import { disableTvMode } from 'in-components/WithTvMode';

let navigationParameters;
navigationParameters$.subscribe(_navigationParameters => (navigationParameters = _navigationParameters));

export default function onPressed() {
  disableTvMode();

  if (!navigationParameters) {
    return;
  }

  if (checkIfDashboardisOpen()) {
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

function goToRootOfView() {
  mutateUrl(navParams => {
    navParams.pathname = navParams.pathname.replace(/^\/([a-z]+)\/.*/i, (all, view) => `/${view}`);
    return navParams;
  });
}
