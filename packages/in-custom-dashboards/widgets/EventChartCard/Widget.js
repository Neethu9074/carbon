import React from 'react';

import DraggableLightCard from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard';
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';

export default function EventChartCardWidget({ config }) {
  return (
    <DraggableLightCard title="Events" icon="lib_events_inverted" useMaxAvailableHeight>
      <ChartWidget config={config} />
    </DraggableLightCard>
  );
}
