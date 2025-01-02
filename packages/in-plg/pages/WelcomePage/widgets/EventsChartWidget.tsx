/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton, DashboardTile, NoDataTile, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error file needs to be converted
import ChartWidget from 'in-custom-dashboards/widgets/Chart/Widget';
//@ts-expect-error file needs to be converted
import getRawEvents from 'in-subscription/getRawEvents';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { DashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';
import { carbonAlert, outlineForColor } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './EventsChartWidget.mless';

export default function EventsChartWidget({
  sectionLabel,
  header,
  dragAndDropConfigs
}: DashboardTileParamProps): JSX.Element {
  const EventsfullListViewHref = useObservable(getEventsViewFilteredBy({}), []);
  const timeConfig: TimeConfig = useTimeConfig();
  const tableData: any = useObservable(
    getRawEvents({
      timeConfig,
      query: ' ',
      pagination: {
        cursor: null,
        retrievalSize: 200
      },
      order: {
        by: 'start',
        direction: 'DESC'
      }
    }),
    []
  );
  let isNoDataAvailable = true;
  if (tableData) {
    isNoDataAvailable = !tableData.progress.loading && tableData.data.items.length === 0;
  }

  const viewLabel = `${t('in-plg:welcomepage.viewAll')} ${t('in-plg:welcomepage.component.eventWidget.viewAllLabel')}`;
  return (
    <section aria-label={sectionLabel} role="region">
      <DashboardTile
        dragAndDropConfigs={dragAndDropConfigs}
        header={header}
        handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')}
        size="xs"
      >
        <div className={locals.eventsChartWrapper}>
          <Stack distribution="spaceBetween">
            {isNoDataAvailable ? (
              <NoDataAvailable />
            ) : (
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
                      getHref$: (highlightedTime: TimeConfig) =>
                        getEventsViewFilteredBy({
                          timeConfig: highlightedTime
                        })
                    }
                  ]
                }}
                customHeight={250}
              />
            )}
          </Stack>
        </div>
        <div className={locals.eventsChartBottomSection}>
          <DashboardButton
            size="md"
            kind="ghost"
            iconSize="s"
            icon="lib_arrow_right"
            iconStyle={locals.viewAllButtonArrowIcon}
            href={EventsfullListViewHref ? EventsfullListViewHref : '/#/events'}
            ariaLabel={viewLabel}
            iconDescription={viewLabel}
            disabled={isNoDataAvailable}
          >
            {viewLabel}
          </DashboardButton>
        </div>
      </DashboardTile>
    </section>
  );
}
function NoDataAvailable() {
  return (
    <NoDataTile
      header={t('in-plg:welcomepage.noData.eventsWidget.header')}
      description={t('in-plg:welcomepage.noData.eventsWidget.description')}
    />
  );
}
