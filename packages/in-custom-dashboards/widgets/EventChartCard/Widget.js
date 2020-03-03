import React from 'react';

import DraggableLightCard from 'in-custom-dashboards/widgets/TopListWidget/DraggableLightCard';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';

export default function EventChartCardWidget({ config }) {
  return (
    <DraggableLightCard
      title="Events"
      icon="lib_events_inverted"
      useMaxAvailableHeight
      fullListViewLinkTitle="All Events"
      fullListView$={getEventsViewFilteredBy({})}
    >
      <ChartWidget config={config} customHeight={250} />
    </DraggableLightCard>
  );
}
