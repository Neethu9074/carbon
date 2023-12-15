/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import DraggableLightCard from 'in-cockpit/widgets/TopListWidget/DraggableLightCard';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { outlineForColor, carbonAlert } from 'in-themes/chartColors';
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
import { t } from 'in-i18n';

export default function EventChartCardWidget({ config }) {
  const fullListViewHref = useObservable(getEventsViewFilteredBy({}), []);
  return (
    <DraggableLightCard
      {...config}
      icon={config.cardIcon}
      useMaxAvailableHeight
      fullListViewLinkTitle={t('in-cockpit:component.eventChartCard.allEvents')}
      fullListView={fullListViewHref}
    >
      <ChartWidget
        config={{
          y1: {
            colors: [carbonAlert.orange40, carbonAlert.red60, carbonAlert.yellow30],
            outlineForColor: outlineForColor,
            formatter: 'number.compact',
            renderer: 'stackedBar',
            metrics: [
              {
                dynamicFocusQuery: 'event.type:incident ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: t('in-cockpit:component.eventChartCard.incidents'),
                source: 'EVENT'
              },
              {
                dynamicFocusQuery: 'event.severity:10 event.type:issue ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: t('in-cockpit:component.eventChartCard.critical'),
                source: 'EVENT'
              },
              {
                dynamicFocusQuery: 'event.severity:5 event.type:issue ',
                metric: 'eventCount',
                timeShift: 0,
                aggregation: 'DISTINCT_COUNT',
                label: t('in-cockpit:component.eventChartCard.warning'),
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
              label: t('in-cockpit:component.eventChartCard.viewEvents'),
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
