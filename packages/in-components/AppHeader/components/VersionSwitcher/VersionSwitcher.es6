import React from 'react';

import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import { setIn } from 'in-services/settings';

import locals from './VersionSwitcher.mless';

function switchVersion() {
  setIn('v2Enabled', !twoZeroModeEnabled);
  window.location.hash += `?v2=${!twoZeroModeEnabled}`;
  window.location.reload();
}

export default function VersionSwitcher() {
  return (
    <Button size="compact" className={locals.versionSwitcher} onClick={() => switchVersion()}>
      {twoZeroModeEnabled ? 'Go back to Instana 1.0' : 'Try Instana 2.0 now!'}
    </Button>
  );
}
