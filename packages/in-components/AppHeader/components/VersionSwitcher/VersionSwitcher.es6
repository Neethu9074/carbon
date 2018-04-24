import React from 'react';

import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import { setIn } from 'in-services/settings';

const parentBlock = 'in-app-header';

function switchVersion() {
  setIn('v2Enabled', !twoZeroModeEnabled);
  window.location.hash += `?v2=${!twoZeroModeEnabled}`;
  window.location.reload();
}

export default function VersionSwitcher() {
  return (
    <Button size="compact" color="#06b7ba" className={`${parentBlock}__early`} onClick={() => switchVersion()}>
      {twoZeroModeEnabled ? 'Go back to Instana 1.0' : 'Try Instana 2.0 now!'}
    </Button>
  );
}
