import React from 'react';

import { v2UsageDurationTracker } from 'in-services/tracking/mixpanelTrackers';
import { applicationsList } from 'in-applications/navigation/paths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import { setIn } from 'in-services/settings';

import locals from './VersionSwitcher.mless';

function switchVersion() {
  v2UsageDurationTracker.stop({ v2Was: twoZeroModeEnabled });
  setIn('v2Enabled', !twoZeroModeEnabled);

  const a = document.createElement('a');
  a.href = window.location.href;

  if (!twoZeroModeEnabled) {
    a.hash = `#${applicationsList}?v2=true`;
  } else {
    a.hash = `#/?v2=false`;
  }

  // If we only change the hash, then the browser will try to update the current document's state.
  // This results in weird artifacts that we don't want to have. Instead, force a document reload
  // by setting an unused query parameter.
  a.search = `?bust=${Date.now()}`;

  window.location.href = a.href;
}

export default function VersionSwitcher() {
  return (
    <Button
      size="compact"
      kind={twoZeroModeEnabled ? 'secondary' : 'primary'}
      className={locals.versionSwitcher}
      onClick={() => switchVersion()}
    >
      {twoZeroModeEnabled ? 'Exit Applications Beta' : 'Preview Applications Beta'}
    </Button>
  );
}
