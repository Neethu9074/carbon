import React from 'react';

import { v2UsageDurationTracker } from 'in-services/tracking/mixpanelTrackers';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import { setIn } from 'in-services/settings';

import locals from './VersionSwitcher.mless';

function switchVersion() {
  v2UsageDurationTracker.stop({ v2Was: twoZeroModeEnabled });
  setIn('v2Enabled', !twoZeroModeEnabled);
  window.location.hash = `?v2=${!twoZeroModeEnabled}`;
  window.location.reload();
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
