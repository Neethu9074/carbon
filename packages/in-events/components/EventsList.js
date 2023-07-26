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
} from '@instana/components';
import { Card } from '@instana/components';

import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import useTimeConfigUpdatingScale from 'in-events/components/useTimeConfigUpdatingScale';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import EmptyEventList from 'in-events/components/EmptyEventsList';
import EventListRow from 'in-events/components/EventsListRow';
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
    isCustomDashboard
  } = props;

  const isDenseList = !!selectedEventId;
  const cols = isDenseList ? 2 : 6;

  const timeScale = useTimeConfigUpdatingScale(timeConfig);

  if (!progress.loading && rawEventList.length === 0) {
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

  if (!isDenseList) {
    return (
      <Card title={title ?? null} header={cardHeader ?? null} leftHeaderContent={leftHeaderContent ?? null}>
        <div
          className={classNames({
            [locals.widgetCard]: isCustomDashboard
          })}
        >
          <Table>
            <Thead>
              <Tr size="compact">
                <Th />
                {isDenseList ? (
                  <SortableColumn {...props} technicalName="start">
                    {t('in-events:headerStarted')}
                  </SortableColumn>
                ) : (
                  <>
                    {isDisplayColumn(headers, 'title') && (
                      <SortableColumn {...props} technicalName="problem.problemText" sortable={!isPreview}>
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
                    {headers && isDisplayColumn(headers, 'duration') && <Th>{t('in-events:titleDuration')}</Th>}
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
              {rawEventList.map(event => (
                <EventListRow
                  key={event.id}
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
      <Table>
        <Thead>
          <Tr size="compact">
            <Th />
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
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {isPresentingHighlightedTimeframe && <HighlightedTimeframeMarkerRow cols={cols} />}
          {rawEventList.map(event => (
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

function SortableColumn({ children, orderBy, orderDirection, onChange, technicalName, sortable }) {
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
