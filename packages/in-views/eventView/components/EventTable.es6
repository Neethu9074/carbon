import React from 'react';

import {
  getEvent,
  getIconTypeForEventType,
  getEventType,
  getColorForEventAtFocusedMomentAsStream
} from 'in-stores/events';
import { furtherDataAvailable$, rawEventList$, loadMoreRawEvents } from 'in-views/eventView/stores/rawEventListStore';
import { focusEvent, clearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';
import { sortDirection$ } from 'in-views/eventView/stores/sortDirection';
import { isLoading$ } from 'in-views/eventView/stores/isLoadingStore';
import { sortBy$, setSortBy } from 'in-views/eventView/stores/sortBy';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { formatDateTime } from 'in-services/formatters/date';
import { selectedEventId$ } from 'in-stores/events';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import LazyTable from 'in-components/LazyTable';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './EventTable.less';

const block = 'in-event-view-event-table';

const cols = [
  {
    title: '',
    field: 'problem.severity',
    width: 35,
    nowrap: true,
    getContent(row, { event }) {
      if (!event) {
        return null;
      }
      return <Icon event={event} />;
    }
  },
  {
    title: 'Start',
    field: 'start',
    width: 135,
    getContent(row, { event }) {
      if (!event) {
        return null;
      }
      return formatDateTime(event.get('start'));
    }
  },
  {
    title: 'End',
    field: 'end',
    width: 135,
    getContent(row, { event }) {
      if (!event) {
        return null;
      }
      return event.get('state') === 'open' ? 'active' : formatDateTime(event.get('end'));
    }
  },
  {
    title: 'Title',
    field: 'problem.problemText',
    getContent(row) {
      return <div className={`${block}__title`}>{row.rawEvent.title}</div>;
    }
  },
  {
    title: 'On',
    getContent(row) {
      return <On rawEvent={row.rawEvent} />;
    }
  }
];

export default connectTo(
  {
    events: rawEventList$,
    isInfiniteLoading: isLoading$,
    selectedEventId: selectedEventId$
  },
  function EventTable({ selectedEventId, events, isInfiniteLoading }) {
    if (!events) {
      return <LoadingIndicator type="dark" />;
    }

    if (!isInfiniteLoading && events.length === 0) {
      return (
        <div className={block}>
          <p className={`${block}__no-events`}>There are no events in the selected time window.</p>
        </div>
      );
    }

    const rows = events.map(rawEvent => {
      return {
        key: rawEvent.id,
        rawEvent,
        isSelected: selectedEventId === rawEvent.id
      };
    });

    return (
      <LazyTable
        cols={cols}
        rows={rows}
        loadMoreData={loadMoreRawEvents}
        rowSubscriptions={row => ({
          event: getEvent(row.key)
        })}
        sortBy$={sortBy$}
        sortDirection$={sortDirection$}
        furtherDataAvailable$={furtherDataAvailable$}
        isLoading$={isLoading$}
        onSortingChanged={setSortBy}
        onRowClicked={row => (row.key === selectedEventId ? clearSelectedEvent() : focusEvent(row.key))}
      />
    );
  }
);

const Icon = connectTo(
  props => ({
    color: getColorForEventAtFocusedMomentAsStream(props.event)
  }),
  function Icon({ event, color }) {
    const iconType = getIconTypeForEventType(getEventType(event), true);
    return (
      <div
        style={{
          background: color
        }}
        className={`${block}__icon-cell`}
      >
        <SvgIcon className={`${block}__icon`} type={iconType} height={12} color="#40535b" />
      </div>
    );
  }
);

const On = connectTo(
  props => ({
    snapshot: getSnapshot(props.rawEvent.snapshotId, props.rawEvent.triggeringTime || props.rawEvent.start)
  }),
  function On({ snapshot }) {
    if (!snapshot) {
      return null;
    }

    return (
      <div className={`${block}__entity-wrapper`}>
        <PluginIcon className={`${block}__entity-icon`} dimension={14} color="#000" snapshot={snapshot} />
        <div className={`${block}__title`}>{getLabel(snapshot)}</div>
      </div>
    );
  }
);
