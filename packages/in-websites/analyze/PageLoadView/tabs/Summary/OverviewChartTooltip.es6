import React from 'react';

import TypeHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/TypeHeader';
import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';

import locals from './OverviewChartTooltip.mless';

export default function OverviewChartTooltip({ beacon, earliestTimestamp }) {
  const beaconRenderers = renderers[beacon.type];
  if (!beaconRenderers) {
    return <div>Unsupported beacon type: {beacon.type}</div>;
  }

  return (
    <div className={locals.tooltipWrapper}>
      <TypeHeader beacon={beacon} />
      <beaconRenderers.LeftHeader beacon={beacon} earliestTimestamp={earliestTimestamp} />
    </div>
  );
}
