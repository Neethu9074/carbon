/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RawEvent, TimeConfig } from '@instana/types';
import { Link } from '@instana/components';
import { t } from '@instana/i18n-react';

import { WidgetProps, ColumnDefinitionItem } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error doesn't contain type file
import getRawEvents from 'in-subscription/getRawEvents';
import TypographyWithTooltip from 'in-plg/components/TypographyWithTooltip/TypographyWithTooltip';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import HealthIcon from 'in-components/health/HealthIcon/HealthIcon';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { formatDateTime } from 'in-services/formatters/date';
import { getEventType, EVENT_TYPES } from 'in-stores/events';
import { openEventsAtServerTime$ } from 'in-stores/events';
import { concatQueries } from 'in-events/utils';

export default connectTo(() => ({
  openEventsAtServerTime: openEventsAtServerTime$
}))(function IncidentsWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: WidgetProps) {
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const fullListViewHref = getEventsViewFilteredBy({
    eventTypeFilter: 'incident',
    timeConfig
  });

  const getHeaders = () => {
    return [
      {
        header: t('in-plg:welcomepage.component.incidentsWidget.title'),
        key: 'title'
      },
      {
        header: t('in-plg:welcomepage.component.incidentsWidget.on'),
        key: 'on'
      },
      {
        header: t('in-plg:welcomepage.component.incidentsWidget.started'),
        key: 'started'
      },
      {
        header: t('in-plg:welcomepage.component.incidentsWidget.end'),
        key: 'end'
      },
      {
        header: t('in-plg:welcomepage.component.incidentsWidget.severity'),
        key: 'health'
      }
    ];
  };

  function getIncidentData({ query, timeConfig }: { query: string; timeConfig: TimeConfig }) {
    return getRawEvents({
      timeConfig: timeConfig,
      query: concatQueries(query, 'incident'),
      pagination: {
        cursor: null,
        retrievalSize: 30
      },
      order: {
        by: 'start',
        direction: 'DESC'
      }
    });
  }

  function formatDisplayDateTime(timestamp: number) {
    return formatDateTime(timestamp);
  }

  function getEndValue(item: RawEvent) {
    const eventType = getEventType(item);
    const isChangeEvent = eventType === EVENT_TYPES.CHANGE;
    const end = item.end || Date.now();
    const start = item.start;

    if (item.state === 'open') {
      return t('in-plg:welcomepage.component.incidentsWidget.active');
    }
    if (isChangeEvent) {
      return formatDisplayDateTime(end);
    }
    return start !== end ? formatDisplayDateTime(end) : valueMissingPlaceholder;
  }

  const { location, createHref } = useNavigation();
  const eventsPath = '/events';

  function onItemClicked(eventId: string) {
    const eventsListLocation = { ...location, pathname: eventsPath };
    setOrDeleteMatrixKey(eventsListLocation, eventsPath, 'eventId', eventId);
    return createHref(eventsListLocation);
  }

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'title',
      getContent({ item }) {
        return <Link href={onItemClicked(item?.id)}>{item?.title ?? ''}</Link>;
      }
    },
    {
      key: 'on',
      getContent({ item }) {
        return <TypographyWithTooltip content={item?.entityLabel ?? ''} />;
      }
    },
    {
      key: 'started',
      getContent({ item }) {
        return <TypographyWithTooltip content={formatDisplayDateTime(item?.start) as string} />;
      }
    },
    {
      key: 'end',
      getContent({ item }) {
        return <TypographyWithTooltip content={getEndValue(item) as string} />;
      }
    },
    {
      key: 'health',
      getContent({ item }) {
        return <HealthIcon severity={item?.severity} iconSize="xs" />;
      }
    }
  ];

  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions,
    headers: getHeaders()
  };

  return (
    <DatatableWrapper
      {...generalProps}
      tableType="incidentsWidget"
      getItems={getIncidentData}
      viewAll
      href={fullListViewHref}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.incidentsWidget.searchPlaceholderLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.incidentsWidget.viewAllLabel')}
    />
  );
});
