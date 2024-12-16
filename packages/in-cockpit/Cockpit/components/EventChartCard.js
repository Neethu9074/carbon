/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ChartWidget from 'promise-loader?global,cockpit!in-custom-dashboards/widgets/Chart/Widget';
import React from 'react';

import { just } from '@instana/observables';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import DraggableLightCard from 'in-cockpit/widgets/TopListWidget/DraggableLightCard';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { outlineForColor, carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

const DeferredChartWidget = createAsyncViewComponent(ChartWidget);
export default function EventChartCardWidget({ config }) {
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const fullListViewHref = getEventsViewFilteredBy({});
  const getHref = highlightedTime =>
    just(
      getEventsViewFilteredBy({
        timeConfig: highlightedTime
      })
    );

  return (
    <DraggableLightCard
      {...config}
      icon={config.cardIcon}
      useMaxAvailableHeight
      fullListViewLinkTitle={t('in-cockpit:component.eventChartCard.allEvents')}
      fullListView={fullListViewHref}
    >
      <DeferredChartWidget
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
              getHref$: getHref
            }
          ]
        }}
        customHeight={250}
      />
    </DraggableLightCard>
  );
}
