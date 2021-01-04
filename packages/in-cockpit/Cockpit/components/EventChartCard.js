import theme from 'in-themes';
import React from 'react';

import DraggableLightCard from 'in-cockpit/widgets/TopListWidget/DraggableLightCard';
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
      <ChartWidget
        config={{
          y1: {
            colors: [theme.lib.colors.orange800, theme.lib.colors.red800, theme.lib.colors.yellow800],
            formatter: 'number.compact',
            renderer: 'stackedBar',
            metrics: [
              {
                dynamicFocusQuery: 'event.type:incident ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: 'Incidents',
                source: 'EVENT'
              },
              {
                dynamicFocusQuery: 'event.severity:10 event.type:issue ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: 'Critical',
                source: 'EVENT'
              },
              {
                dynamicFocusQuery: 'event.severity:5 event.type:issue ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: 'Warning',
                source: 'EVENT'
              }
            ]
          },
          y2: {
            formatter: 'number.compact',
            renderer: 'line',
            metrics: []
          },
          type: 'TIME_SERIES',
          primaryContextMenuAction: 'showEvents',
          additionalContextMenuButtons: [
            {
              name: 'showEvents',
              icon: 'lib_events_inverted',
              label: 'View Events',
              getHref$: highlightedTime =>
                getEventsViewFilteredBy({
                  timeConfig: highlightedTime
                })
            }
          ]
        }}
        customHeight={250}
      />
    </DraggableLightCard>
  );
}
