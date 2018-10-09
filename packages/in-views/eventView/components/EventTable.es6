import React from 'react';

import {
  getEvent,
  getIconTypeForEventType,
  getEventType,
  getColorForEventAtFocusedMomentAsStream
} from 'in-stores/events';
import { furtherDataAvailable$, rawEventList$, loadMoreRawEvents } from 'in-views/eventView/stores/rawEventListStore';
import { focusEvent, clearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { sortDirection$ } from 'in-views/eventView/stores/sortDirection';
import getApplication from 'in-subscription/application/getApplication';
import { isLoading$ } from 'in-views/eventView/stores/isLoadingStore';
import { sortBy$, setSortBy } from 'in-views/eventView/stores/sortBy';
import getEndpoint from 'in-subscription/application/getEndpoint';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import { selectedEventId$ } from 'in-stores/events';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import LazyTable from 'in-components/LazyTable';
import { just } from 'reactive-observables';
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

    const rows = events.map((rawEvent, i) => {
      return {
        key: i,
        eventId: rawEvent.id,
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
          event: getEvent(row.eventId)
        })}
        sortBy$={sortBy$}
        sortDirection$={sortDirection$}
        furtherDataAvailable$={furtherDataAvailable$}
        isLoading$={isLoading$}
        onSortingChanged={setSortBy}
        onRowClicked={row => (row.eventId === selectedEventId ? clearSelectedEvent() : focusEvent(row.eventId))}
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
  props => {
    if (props.rawEvent.entityType === 'App20') {
      return {
        entity: getApplication({ id: props.rawEvent.entityId }),
        app20IconType: just('app_application')
      };
    } else if (props.rawEvent.entityType === 'Service20') {
      return {
        entity: getServiceLabel({ id: props.rawEvent.entityId }),
        app20IconType: just('app_service')
      };
    } else if (props.rawEvent.entityType === 'Endpoint20') {
      return {
        entity: getEndpoint({
          id: props.rawEvent.entityId,
          filter: {
            timeConfig: getTimeConfigAtMoment(props.rawEvent.triggeringTime || props.rawEvent.start)
          }
        }),
        app20IconType: just('app_endpoint')
      };
    } else {
      return {
        entity: getSnapshot(
          props.rawEvent.entityId,
          getTimeConfigAtMoment(props.rawEvent.triggeringTime || props.rawEvent.start)
        )
      };
    }
  },
  function On({ rawEvent, entity, app20IconType }) {
    if (!entity || (entity.progress && entity.progress.loading) || (entity.errors && entity.errors.length > 0)) {
      return null;
    }

    let label;
    if (
      rawEvent.entityType === 'App20' ||
      rawEvent.entityType === 'Service20' ||
      rawEvent.entityType === 'Endpoint20'
    ) {
      label = entity.data.label;
    } else {
      label = getLabel(entity);
    }
    return (
      <div className={`${block}__entity-wrapper`}>
        {app20IconType ? (
          <SvgIcon className={`${block}__entity-icon`} type={app20IconType} height={14} color="#000" />
        ) : (
          <PluginIcon className={`${block}__entity-icon`} dimension={14} color="#000" snapshot={entity} />
        )}
        <div className={`${block}__title`}>{label}</div>
      </div>
    );
  }
);
