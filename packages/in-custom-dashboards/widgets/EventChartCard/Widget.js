import React from 'react';

import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
import LightCard from 'in-new-components/Card/LightCard';

export default function EventChartCardWidget({ config }) {
  return (
    <LightCard title="Events" icon="lib_events_inverted" useMaxAvailableHeight>
      <ChartWidget config={config} />
    </LightCard>
  );
}
