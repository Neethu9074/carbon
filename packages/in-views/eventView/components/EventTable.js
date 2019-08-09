import { fromJS } from 'immutable';
import React from 'react';

import { furtherDataAvailable$, rawEventList$, loadMoreRawEvents } from 'in-views/eventView/stores/rawEventListStore';
import { getIconTypeForEventType, getEventType, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { isApplicationEntity, isServiceEntity, isEndpointEntity, isAppDataEntityType } from 'in-services/entityUtils';
import { focusEvent, clearSelectedEvent } from 'in-stores/navigation/paths/eventPaths';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { sortDirection$ } from 'in-views/eventView/stores/sortDirection';
import getApplication from 'in-subscription/application/getApplication';
import { isLoading$ } from 'in-views/eventView/stores/isLoadingStore';
import { sortBy$, setSortBy } from 'in-views/eventView/stores/sortBy';
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
    getContent(row) {
      return (
        <Icon
          event={fromJS({
            ...row.rawEvent,
            problem: {
              severity: row.rawEvent.severity
            }
          })}
        />
      );
    }
  },
  {
    title: 'Start',
    field: 'start',
    width: 135,
    getContent(row) {
      return formatDateTime(row.rawEvent.start);
    }
  },
  {
    title: 'End',
    field: 'end',
    width: 135,
    getContent(row) {
      return row.rawEvent.state === 'open' ? 'active' : formatDateTime(row.rawEvent.end);
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
        <SvgIcon className={`${block}__icon`} type={iconType} size="xxs" color="#40535b" />
      </div>
    );
  }
);

const On = connectTo(
  props => {
    if (isApplicationEntity(props.rawEvent.entityType)) {
      return {
        entity: getApplication({ id: props.rawEvent.entityId }),
        app20IconType: just('app_application')
      };
    } else if (isServiceEntity(props.rawEvent.entityType)) {
      return {
        entity: getServiceLabel({ id: props.rawEvent.entityId }),
        app20IconType: just('app_service')
      };
    } else if (isEndpointEntity(props.rawEvent.entityType)) {
      return {
        entity: getEndpointInfo({
          id: props.rawEvent.entityId
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
    if (isAppDataEntityType(rawEvent.entityType)) {
      label = entity.data.label;
    } else {
      label = getLabel(entity);
    }
    return (
      <div className={`${block}__entity-wrapper`}>
        {app20IconType ? (
          <SvgIcon className={`${block}__entity-icon`} type={app20IconType} size="xxs" />
        ) : (
          <PluginIcon className={`${block}__entity-icon`} size="xxs" snapshot={entity} />
        )}
        <div className={`${block}__title`}>{label}</div>
      </div>
    );
  }
);
