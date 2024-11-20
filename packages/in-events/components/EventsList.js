/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import {
  Table,
  TableHorizontalIndicatorRow,
  TableLoadingSkeletonRows,
  SortableTh,
  Thead,
  Tbody,
  Tr,
  Th,
  TableLoadMoreRow
} from '@instana/legacy';
import { DataTable as CarbonDataTable } from '@instana/components';
import { Card } from '@instana/components';

import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import { aqmDataGridEventTableEnabled, carbonTableEnabled } from 'in-services/featureFlags';
import useTimeConfigUpdatingScale from 'in-events/components/useTimeConfigUpdatingScale';
import EventsTable from 'in-events/components/EventsPage/EventsTable/EventsTable';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { manuallyCloseEventEnabled } from 'in-services/featureFlags';
import EmptyEventList from 'in-events/components/EmptyEventsList';
import EventListRow from 'in-events/components/EventsListRow';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './EventsList.mless';

export default function EventsList(props) {
  const list = <List {...props} />;
  if (!props.selectedEventId) {
    return list;
  }
  return <HeightRestrictedView render={() => list} />;
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
    headers,
    isPreview,
    title,
    cardHeader,
    leftHeaderContent,
    isCustomDashboard,
    orderBy,
    orderDirection,
    disableCard = false
  } = props;

  const canCloseManually = manuallyCloseEventEnabled && role?.canManuallyCloseIssue;
  const isDenseList = !!selectedEventId;
  let cols = 0;

  if (isDenseList) {
    cols = 2;
  } else {
    cols = canCloseManually ? 7 : 6;
  }

  const timeScale = useTimeConfigUpdatingScale(timeConfig);
  const filteredRawEventList = filterManuallyClosedEventsByTimeScale(rawEventList, timeScale);

  if (aqmDataGridEventTableEnabled && eventType == 'issue') {
    return (
      <EventsTable
        onItemClicked={onItemClicked}
        rawEvents={filteredRawEventList}
        eventType={eventType}
        isDenseList={isDenseList}
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

  if (carbonTableEnabled) {
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
            isDisplayColumn(headers, 'icon') && { key: 'icon' },
            isDisplayColumn(headers, 'title') && {
              header: t('in-events:headerVulnerability'),
              key: 'title',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'entityLabel') && {
              header: t('in-events:headerReportedOn'),
              key: 'entityLabel'
            },
            isDisplayColumn(headers, 'started') && {
              header: t('in-events:headerReportedDate'),
              key: 'started',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'cvssScore') && {
              header: t('in-events:headerCvssScore'),
              key: 'cvssScore'
            },
            isDisplayColumn(headers, 'state') && {
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
            isDisplayColumn(headers, 'icon') && { key: 'icon' },
            isDisplayColumn(headers, 'title') && {
              header: t('in-events:headerTitle'),
              key: 'title',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.title ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'entityLabel') && {
              header: t('in-events:headerOn'),
              key: 'entityLabel'
            },
            isDisplayColumn(headers, 'started') && {
              header: t('in-events:headerStarted'),
              key: 'started',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.started ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'ended') && {
              header: t('in-events:headerEnd'),
              key: 'ended',
              isSortable: !isPreview,
              sortDirection: orderBy === sortingMapper.ended ? orderDirection : 'NONE'
            },
            isDisplayColumn(headers, 'timeline') && {
              header: t('in-events:headerTimeline'),
              key: 'timeline'
            },
            canCloseManually &&
              isDisplayColumn(headers, 'state') && {
                header: t('in-events:headerState'),
                key: 'state',
                isSortable: !isPreview,
                sortDirection: orderBy === sortingMapper.state ? orderDirection : 'NONE'
              },
            headers &&
              isDisplayColumn(headers, 'duration') && {
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
        headers,
        onItemClicked
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

  if (!isDenseList) {
    const titleWidth = 45;
    return (
      <Card title={title ?? null} header={cardHeader ?? null} leftHeaderContent={leftHeaderContent ?? null}>
        <div
          className={classNames({
            [locals.widgetCard]: isCustomDashboard
          })}
        >
          <Table fixedLayout={!isCustomDashboard && eventType !== 'cve_issue'}>
            <Thead>
              <Tr size="compact">
                <Th useMinimumAmountOfHorizontalSpace />
                {eventType === 'cve_issue' ? (
                  <>
                    {isDisplayColumn(headers, 'title') && (
                      <SortableColumn {...props} technicalName="problem.problemText" sortable={!isPreview}>
                        {t('in-events:headerVulnerability')}
                      </SortableColumn>
                    )}
                    {isDisplayColumn(headers, 'entityLabel') && <Th>{t('in-events:headerReportedOn')}</Th>}
                    {isDisplayColumn(headers, 'started') && (
                      <SortableColumn {...props} technicalName="start" sortable={!isPreview}>
                        {t('in-events:headerReportedDate')}
                      </SortableColumn>
                    )}
                    {isDisplayColumn(headers, 'cvssScore') && <Th>{t('in-events:headerCvssScore')}</Th>}
                    {isDisplayColumn(headers, 'state') && (
                      <SortableColumn {...props} technicalName="state" sortable={!isPreview}>
                        {t('in-events:headerStatus')}
                      </SortableColumn>
                    )}
                  </>
                ) : isDenseList ? (
                  <SortableColumn {...props} technicalName="start">
                    {t('in-events:headerStarted')}
                  </SortableColumn>
                ) : (
                  <>
                    {isDisplayColumn(headers, 'title') && (
                      <SortableColumn
                        {...props}
                        technicalName="problem.problemText"
                        sortable={!isPreview}
                        width={titleWidth}
                      >
                        {t('in-events:headerTitle')}
                      </SortableColumn>
                    )}
                    {isDisplayColumn(headers, 'entityLabel') && <Th>{t('in-events:headerOn')}</Th>}
                    {isDisplayColumn(headers, 'started') && (
                      <SortableColumn {...props} technicalName="start" sortable={!isPreview}>
                        {t('in-events:headerStarted')}
                      </SortableColumn>
                    )}
                    {isDisplayColumn(headers, 'ended') && (
                      <SortableColumn {...props} technicalName="end" sortable={!isPreview}>
                        {t('in-events:headerEnd')}
                      </SortableColumn>
                    )}
                    {isDisplayColumn(headers, 'timeline') && (
                      <Th className={locals.timelineColumn}>{t('in-events:headerTimeline')}</Th>
                    )}
                    {canCloseManually && isDisplayColumn(headers, 'state') && (
                      <SortableColumn {...props} technicalName="state" sortable={!isPreview}>
                        {t('in-events:headerState')}
                      </SortableColumn>
                    )}
                    {headers && isDisplayColumn(headers, 'duration') && <Th>{t('in-events:titleDuration')}</Th>}
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
              {filteredRawEventList.map(event => (
                <EventListRow
                  key={event.id}
                  state={event.state}
                  selectedEventId={selectedEventId}
                  onItemClicked={onItemClicked}
                  isDenseList={isDenseList}
                  event={event}
                  timeScale={timeScale}
                  timeConfig={timeConfig}
                  headers={headers}
                  isPreview={isPreview}
                />
              ))}
              {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
              <TableHorizontalIndicatorRow cols={cols} progress={progress} />
              {progress.loading && <TableLoadingSkeletonRows cols={headers ? headers.length + 1 : cols} />}
            </Tbody>
          </Table>
        </div>
      </Card>
    );
  } else {
    return (
      <Table fixedLayout>
        <Thead>
          <Tr size="compact">
            <Th useMinimumAmountOfHorizontalSpace />
            {isDenseList ? (
              <SortableColumn {...props} technicalName="start">
                {t('in-events:headerStarted')}
              </SortableColumn>
            ) : (
              <>
                <SortableColumn {...props} technicalName="problem.problemText">
                  {t('in-events:headerTitle')}
                </SortableColumn>
                <Th>{t('in-events:headerOn')}</Th>
                <SortableColumn {...props} technicalName="start">
                  {t('in-events:headerStarted')}
                </SortableColumn>
                <SortableColumn {...props} technicalName="end">
                  {t('in-events:headerEnd')}
                </SortableColumn>
                <Th className={locals.timelineColumn}>{t('in-events:headerTimeline')}</Th>
                {canCloseManually && (
                  <SortableColumn {...props} technicalName="state">
                    {t('in-events:headerState')}
                  </SortableColumn>
                )}
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
          {filteredRawEventList.map(event => (
            <EventListRow
              key={event.id}
              selectedEventId={selectedEventId}
              onItemClicked={onItemClicked}
              isDenseList={isDenseList}
              event={event}
              timeScale={timeScale}
              timeConfig={timeConfig}
            />
          ))}

          {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
          <TableHorizontalIndicatorRow cols={cols} progress={progress} />
          {progress.loading && <TableLoadingSkeletonRows cols={cols} />}
        </Tbody>
      </Table>
    );
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

function SortableColumn({ children, orderBy, orderDirection, onChange, technicalName, sortable, width }) {
  if (!sortable) {
    return <Th>{children}</Th>;
  }
  return (
    <SortableTh
      isSortedByThisColumn={orderBy === technicalName}
      sortDirection={orderDirection}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onChange({
          orderBy: technicalName,
          orderDirection: orderBy === technicalName ? (orderDirection === 'ASC' ? 'DESC' : 'ASC') : 'ASC'
        });
      }}
      width={width ?? undefined}
    >
      {children}
    </SortableTh>
  );
}

export function isDisplayColumn(headers, item) {
  if (!headers) {
    return true;
  }
  return headers.length > 0 && headers.includes(item);
}
