import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { infraExploreEnabled } from 'in-infrastructure/Explore/services/featureFlags';
import { useBeeInstant$, setUseBeeInstant } from 'in-stores/metric/beeInstant';
import useObservable from 'in-hooks/useObservable';
import Toggle from 'in-components/form/Toggle';
import Tooltip from 'in-components/Tooltip';

export default function UseBeeInstantToggle({ theme }) {
  const internalVisible = useObservable(isInternalVisible$, []) || false;
  const useBeeInstant = useObservable(useBeeInstant$, []) || false;

  if (!infraExploreEnabled) {
    return;
  }

  if (!internalVisible) {
    return;
  }

  return (
    <Tooltip themeStyle={theme} content={tooltipContent()} align="bottomMiddle">
      <DashboardHeaderButton darkTheme={theme === 'dark'} outlineOnly onClick={() => setUseBeeInstant(!useBeeInstant)}>
        <div>Use BeeInstana</div>
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
