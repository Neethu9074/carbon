import React from 'react';

import { Table, SortableTh, Thead, Tbody, Tr, Th, LoadMoreRow } from 'in-components/tables/sharedComponents';
import getIncidentBasedHealthInTimeFrame from 'in-events/subscriptions/getIncidentBasedHealthInTimeFrame';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import ReleaseStatusRow from 'in-events/releases/ReleaseStatusRow';
import EventListRow from 'in-events/components/EventsListRow';
import connectTo from 'in-hoc/connectTo';

export default function EventsList(props) {
  const list = <List {...props} />;
  if (!props.selectedEventId) {
    return list;
  }
  return <HeightRestrictedView render={() => list} />;
}

const List = connectTo(props => getHealthStream(props), function List(props) {
  const {
    selectedEventId,
    onItemClicked,
    items: rawEventList,
    health,
    canLoadMore,
    loadMore,
    orderBy,
    orderDirection
  } = props;
  const isDenseList = !!selectedEventId;

  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th />
          {isDenseList ? (
            <SortableColumn {...props} technicalName="start">
              Started
            </SortableColumn>
          ) : (
            <>
              <SortableColumn {...props} technicalName="problem.problemText">
                Title
              </SortableColumn>
              <SortableColumn {...props} technicalName="start">
                Started
              </SortableColumn>
              <SortableColumn {...props} technicalName="end">
                End
              </SortableColumn>
              <Th>On</Th>
            </>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {rawEventList.map(
          event =>
            event.type === 'release' ? (
              <ReleaseStatusRowPresenter
                key={event.id}
                event={event}
                orderBy={orderBy}
                cols={isDenseList ? 2 : 5}
                orderDirection={orderDirection}
                health={health}
              />
            ) : (
              <EventListRow
                key={event.id}
                selectedEventId={selectedEventId}
                onItemClicked={onItemClicked}
                isDenseList={isDenseList}
                event={event}
              />
            )
        )}

        {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={isDenseList ? 2 : 5} />}
      </Tbody>
    </Table>
  );
});

function ReleaseStatusRowPresenter({ event, orderBy, orderDirection, cols, health }) {
  return orderBy === 'start' ? (
    <ReleaseStatusRow
      rawEvent={event}
      orderDirection={orderDirection}
      cols={cols}
      healthStatus={health && health[event.start]}
    />
  ) : null;
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

function getHealthStream({ orderBy, items, timeConfig, query }) {
  let startTimeStamps = [];
  if (orderBy === 'start' && items && items.length > 0) {
    startTimeStamps = items.filter(rawEvent => rawEvent.type === 'release').map(rawEvent => rawEvent.start);
  }

  const eventType = 'event.type:incident';
  return {
    health: getIncidentBasedHealthInTimeFrame({
      timeConfig,
      query: query ? `(${query}) AND (${eventType})` : eventType,
      timestamps: startTimeStamps
    }).map(({ data }) => data || null)
  };
}
