import React from 'react';

import { isTwoZeroBetaPhase, twoZeroAppDataEnabled, twoZeroModeEnabled } from 'in-services/featureFlags';

export default function VersionSwitcherFlyout() {
  if (!isTwoZeroBetaPhase) {
    return null;
  }

  return (
    <div>
      Hello from VersionSwitcherFlyout!
    </div>
  );
}
