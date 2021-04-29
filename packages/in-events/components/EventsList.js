/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import React from 'react';

import {
  Table,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  SortableTh,
  Thead,
  Tbody,
  Tr,
  Th,
  LoadMoreRow
} from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import HighlightedTimeframeMarkerRow from 'in-events/components/HighlightedTimeframeMarkerRow';
import useTimeConfigUpdatingScale from 'in-services/hooks/useTimeConfigUpdatingScale';
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
    isPresentingHighlightedTimeframe
  } = props;
  const isDenseList = !!selectedEventId;
  const cols = isDenseList ? 2 : 6;

  const timeScale = useTimeConfigUpdatingScale(props.timeConfig);

  if (!progress.loading && rawEventList.length === 0) {
    return (
      <EmptyEventList
        eventType={eventType}
        isDenseList={isDenseList}
        isPresentingHighlightedTimeframe={isPresentingHighlightedTimeframe}
        cols={cols}
      />
    );
  }

  if (!isDenseList) {
    return (
      <Card>
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
              />
            ))}

            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
            <HorizontalIndicatorRow cols={cols} progress={progress} />
            {progress.loading && <LoadingSkeletonRows cols={cols} />}
          </Tbody>
        </Table>
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
            />
          ))}

          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={cols} />}
          <HorizontalIndicatorRow cols={cols} progress={progress} />
          {progress.loading && <LoadingSkeletonRows cols={cols} />}
        </Tbody>
      </Table>
    );
  }
}

function SortableColumn({ children, orderBy, orderDirection, onChange, technicalName }) {
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
