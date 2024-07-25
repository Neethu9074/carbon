/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardTile, Link, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error file needs to be converted
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { DashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';
import { carbonAlert, outlineForColor } from 'in-themes/chartColors';
import { t } from 'in-i18n';

import locals from './EventsChartWidget.mless';

export default function EventsChardWidget({
  sectionLabel,
  header,
  dragAndDropConfigs
}: DashboardTileParamProps): JSX.Element {
  const EventsfullListViewHref = useObservable(getEventsViewFilteredBy({}), []);
  return (
    <section aria-label={sectionLabel} role="region">
      <DashboardTile
        dragAndDropConfigs={dragAndDropConfigs}
        header={header}
        handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')}
        size="xs"
      >
        <div className={locals.eventsChartWrapper}>
          <Stack distribution="spaceBetween" align="start">
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
                      label: t('in-plg:welcomepage.component.eventWidget.incidents'),
                      source: 'EVENT'
                    },
                    {
                      dynamicFocusQuery: 'event.severity:10 event.type:issue ',
                      metric: 'eventCount',
                      timeShift: 0,
                      aggregation: 'DISTINCT_COUNT',
                      label: t('in-plg:welcomepage.component.eventWidget.critical'),
                      source: 'EVENT'
                    },
                    {
                      dynamicFocusQuery: 'event.severity:5 event.type:issue ',
                      metric: 'eventCount',
                      timeShift: 0,
                      aggregation: 'DISTINCT_COUNT',
                      label: t('in-plg:welcomepage.component.eventWidget.warning'),
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
                    label: t('in-plg:welcomepage.component.eventWidget.viewEvents'),
                    getHref$: (highlightedTime: any) =>
                      getEventsViewFilteredBy({
                        timeConfig: highlightedTime
                      })
                  }
                ]
              }}
              customHeight={250}
            />
          </Stack>
        </div>
        <div className={locals.eventsChartBottomSection}>
          <Link
            href={EventsfullListViewHref ? EventsfullListViewHref : '/#/events'}
            linkIconType="lib_arrow_right"
          >{`${t('in-plg:welcomepage.viewAll')} ${header}`}</Link>
        </div>
      </DashboardTile>
    </section>
  );
}
