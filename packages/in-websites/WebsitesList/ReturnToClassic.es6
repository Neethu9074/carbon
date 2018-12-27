import React from 'react';

import { oneZeroWebsiteMonitoringEnabled } from 'in-services/featureFlags';
import { websitePath } from 'in-stores/navigation/paths/mainPaths';
import { returnToClassicTracker } from 'in-websites/tracker';
import { getView } from 'in-stores/navigation/navigation';
import Button from 'in-new-components/Button';

import locals from './ReturnToClassic.mless';

export default function ReturnToClassic() {
  if (!oneZeroWebsiteMonitoringEnabled) {
    return null;
  }

  return (
    <div className={locals.wrapper}>
      <span>Classic website monitoring is still available should you need to access your historic data.</span>

      <Button onClick={() => returnToClassicTracker()} href$={getView(websitePath)} kind="primaryv2" size="compact">
        Return to classic
      </Button>
    </div>
  );
}
