import React from 'react';

import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { useBeeInstant$, setUseBeeInstant } from 'in-stores/metric/beeInstant';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import useObservable from 'in-hooks/useObservable';
import Toggle from 'in-components/form/Toggle';
import Tooltip from 'in-components/Tooltip';

export default function UseBeeInstantToggle() {
  if (!instanaInternalFeaturesEnabled) {
    return;
  }

  const useBeeInstant = useObservable(useBeeInstant$, []) || false;

  return (
    <Tooltip themeStyle="light" content={tooltipContent()} align="bottomMiddle">
      <DashboardHeaderButton outlineOnly onClick={() => setUseBeeInstant(!useBeeInstant)}>
        <div>Use BeeInstant</div>
        <Toggle checked={useBeeInstant} onChange={e => setUseBeeInstant(e.target.checked)} />
      </DashboardHeaderButton>
    </Tooltip>
  );
}

function tooltipContent() {
  return (
    <div>
      Hi, Instana Dev! Hit this toggle to see metrics from BeeInstant. Some things to know:
      <ul>
        <li>This is for testing purposes</li>
        <li>This is only available in some environments (like, test pink for now)</li>
        <li>KPIs will show an aggregation over the entire selected window (rather than the latest value)</li>
        <li>All metrics use an average aggregation for now, but BeeInstant is capable of a lot more</li>
      </ul>
    </div>
  );
}
