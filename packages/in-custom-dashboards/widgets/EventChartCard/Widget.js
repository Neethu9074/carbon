import React from 'react';

import DraggableLightCard from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';

export default function EventChartCardWidget({ config }) {
  return (
    <DraggableLightCard
      {...config}
      icon={config.cardIcon}
      useMaxAvailableHeight
      fullListViewLinkTitle="All Events"
      fullListView$={getEventsViewFilteredBy({})}
    >
      <ChartWidget config={config.chartConfig} customHeight={250} />
    </DraggableLightCard>
  );
}
