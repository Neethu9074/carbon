/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Card, TableLoadMoreRow } from '@instana/components';

import useTimeConfigUpdatingScale from 'in-events/components/useTimeConfigUpdatingScale';
import EventsTable from 'in-events/components/EventsPage/EventsTable/EventsTable';
import { aqmDataGridEventTableEnabled } from 'in-services/featureFlags';
import EmptyEventList from 'in-events/components/EmptyEventsList';
import EventListRow from 'in-events/components/EventsListRow';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventsList.mless';

export default function EventsList(props) {
  const list = <List {...props} />;
  return list;
}

function List(props) {
  const {
    selectedEventId,
    onItemClicked,
    items: rawEventList,
    canLoadMore,
    loadMore,
    progress,
    eventType,
    isPresentingHighlightedTimeframe,
    timeConfig,
    headers = [],
    isPreview,
    title,
    cardHeader,
    leftHeaderContent,
    isCustomDashboard,
    orderBy,
    orderDirection,
    disableCard = false
  } = props;

  // When NOT in custom dashboard mode, we need defaults for the headers array.
  // This is being used to generate headers for our table.
  // This change will also allow carbon table to be loaded for custom dashboards.
  let calculatedHeaders = headers;
  if (isEmpty(headers)) {
    if (eventType === 'cve_issue') {
      calculatedHeaders = ['icon', 'title', 'entityLabel', 'started', 'cvssScore', 'state'];
    } else {
      calculatedHeaders = ['icon', 'title', 'entityLabel', 'started', 'ended', 'timeline', 'state', 'duration'];
    }
  } else {
    // we need to prepend icon as the first header for custom dashboards
    if (!calculatedHeaders.includes('icon')) {
      calculatedHeaders.unshift('icon');
    }
  }

  const eventTypeSupported = eventType === 'incident' || eventType === 'issue';
  const canCloseManually = role?.canManuallyCloseIssue;
  const isDenseList = !!selectedEventId;
  let cols = 0;

  if (isDenseList) {
    cols = 2;
  } else {
    if (eventTypeSupported) {
      cols = canCloseManually ? 8 : 7;
    } else {
      cols = canCloseManually ? 7 : 6;
    }
  }

  const timeScale = useTimeConfigUpdatingScale(timeConfig);
  const filteredRawEventList = filterManuallyClosedEventsByTimeScale(rawEventList, timeScale);

  if (aqmDataGridEventTableEnabled && (eventType == 'issue' || eventType == 'incident') && !isDenseList) {
    return (
      <EventsTable
        onItemClicked={onItemClicked}
        rawEvents={filteredRawEventList}
        eventType={eventType}
        isDenseList={isDenseList}
        loading={progress.loading}
        loadMore={loadMore}
        canLoadMore={canLoadMore}
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChange={props?.onChange}
      />
    );
  }

  if (!progress.loading && filteredRawEventList.length === 0) {
    return (
      <Card title={title} header={cardHeader} leftHeaderContent={leftHeaderContent}>
        <div
          className={classNames({
            [locals.widgetCard]: isCustomDashboard
          })}
        >
          <EmptyEventList
            eventType={eventType}
            isDenseList={isDenseList}
            isPresentingHighlightedTimeframe={isPresentingHighlightedTimeframe}
            cols={cols}
          />
        </div>
      </Card>
    );
  }

  const sortedRows = filteredRawEventList;

  // Carbon interprets keys differently than the how the sorting works
  // Convert the carbon row key to the request query value expected
  const sortingMapper = {
    title: 'problem.problemText',
    started: 'start',
    state: 'state',
    ended: 'end'
  };

  const carbonHeaders = [
    ...(eventType === 'cve_issue'
      ? [
          isDisplayColumn(calculatedHeaders, 'icon') && { key: 'icon', header: '' },
          isDisplayColumn(calculatedHeaders, 'title') && {
            header: t('in-events:headerVulnerability'),
            key: 'title',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
          },
          isDisplayColumn(calculatedHeaders, 'entityLabel') && {
            header: t('in-events:headerReportedOn'),
            key: 'entityLabel'
          },
          isDisplayColumn(calculatedHeaders, 'started') && {
            header: t('in-events:headerReportedDate'),
            key: 'started',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
          },
          isDisplayColumn(calculatedHeaders, 'cvssScore') && {
            header: t('in-events:headerCvssScore'),
            key: 'cvssScore'
          },
          isDisplayColumn(calculatedHeaders, 'state') && {
            header: t('in-events:headerStatus'),
            key: 'state',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.state ? orderDirection : 'NONE'
          }
        ]
      : isDenseList
      ? [
          {
            header: t('in-events:headerStarted'),
            key: 'start'
          }
        ]
      : [
          isDisplayColumn(calculatedHeaders, 'icon') && { key: 'icon', header: '' },
          isDisplayColumn(calculatedHeaders, 'title') && {
            header: t('in-events:headerTitle'),
            key: 'title',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
          },
          isDisplayColumn(calculatedHeaders, 'entityLabel') && {
            header: t('in-events:headerOn'),
            key: 'entityLabel'
          },
          isDisplayColumn(calculatedHeaders, 'started') && {
            header: t('in-events:headerStarted'),
            key: 'started',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
          },
          isDisplayColumn(calculatedHeaders, 'ended') && {
            header: t('in-events:headerEnd'),
            key: 'ended',
            isSortable: !isPreview,
            sortDirection: orderBy === sortingMapper.ended ? orderDirection : 'NONE'
          },
          isDisplayColumn(calculatedHeaders, 'timeline') && {
            header: t('in-events:headerTimeline'),
            key: 'timeline'
          },
          canCloseManually &&
            isDisplayColumn(calculatedHeaders, 'state') && {
              header: t('in-events:headerState'),
              key: 'state',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.state ? orderDirection : 'NONE'
            },
          calculatedHeaders &&
            isDisplayColumn(calculatedHeaders, 'duration') && {
              header: t('in-events:titleDuration'),
              key: 'duration'
            }
        ]
    ).filter(Boolean)
  ];

  const carbonRows = sortedRows.map(event => ({
    id: event.id,
    ...EventListRow({
      event,
      selectedEventId,
      state: event.state,
      isDenseList,
      isPreview,
      timeScale,
      timeConfig,
      calculatedHeaders,
      onItemClicked,
      selectedType: eventType
    })
  }));

  if (!isDenseList) {
    let content = (
      <>
        {/* TODO: convert this to a carbon datagrid */}
        <CarbonDataTable
          headers={carbonHeaders}
          loading={progress.loading}
          rows={carbonRows}
          isSearchEnabled={false}
          onClickingRow={e => onItemClicked(e.id)}
          sortRow={({ sortHeaderKey }) => {
            if (['title', 'started', 'ended', 'state'].includes(sortHeaderKey)) {
              props?.onChange({
                orderBy: sortingMapper[sortHeaderKey],
                orderDirection:
                  props?.orderBy === sortingMapper[sortHeaderKey]
                    ? props?.orderDirection === 'ASC'
                      ? 'DESC'
                      : 'ASC'
                    : 'ASC'
              });
            }
          }}
        />
        {canLoadMore && (
          <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
        )}
      </>
    );
    if (disableCard) return content;
    return (
      <>
        <Card title={title ?? null} header={cardHeader ?? null} leftHeaderContent={leftHeaderContent ?? null}>
          <div
            className={classNames({
              [locals.widgetCard]: isCustomDashboard
            })}
          >
            <CarbonDataTable
              headers={carbonHeaders}
              loading={progress.loading}
              rows={carbonRows}
              isSearchEnabled={false}
              onClickingRow={isPreview ? undefined : e => onItemClicked(e.id)}
              sortRow={({ sortHeaderKey }) => {
                if (['title', 'started', 'ended', 'state'].includes(sortHeaderKey)) {
                  props?.onChange({
                    orderBy: sortingMapper[sortHeaderKey],
                    orderDirection:
                      props?.orderBy === sortingMapper[sortHeaderKey]
                        ? props?.orderDirection === 'ASC'
                          ? 'DESC'
                          : 'ASC'
                        : 'ASC'
                  });
                }
              }}
            />
            {canLoadMore && (
              <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
            )}
          </div>
        </Card>
      </>
    );
  } else {
    <>
      <CarbonDataTable
        headers={carbonHeaders}
        rows={carbonRows}
        isSearchEnabled={false}
        loading={progress.loading}
        onClickingRow={e => onItemClicked(e.id)}
        sortRow={({ sortHeaderKey }) => {
          if (['title', 'started', 'end', 'state'].includes(sortHeaderKey)) {
            props?.onChange({
              orderBy: sortingMapper[sortHeaderKey],
              orderDirection:
                props?.orderBy === sortingMapper[sortHeaderKey]
                  ? props?.orderDirection === 'ASC'
                    ? 'DESC'
                    : 'ASC'
                  : 'ASC'
            });
          }
        }}
      />
      {canLoadMore && (
        <TableLoadMoreRow className={locals.carbonLoadMore} loadMore={loadMore} cols={2} size="compact" />
      )}
    </>;
  }
}

function filterManuallyClosedEventsByTimeScale(rawEventList, timeScale) {
  return rawEventList.filter(event =>
    event.manuallyClosed
      ? event.manualCloseTimestamp <= timeScale.domainTo + 15000 &&
        event.manualCloseTimestamp >= timeScale.domainFrom - 15000
      : true
  );
}

export function isDisplayColumn(headers, item) {
  if (!headers) {
    return true;
  }
  return headers.length > 0 && headers.includes(item);
}
