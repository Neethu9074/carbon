import { just } from 'reactive-observables';
import { fromJS } from 'immutable';
import React from 'react';

import { isApplicationEntity, isServiceEntity, isEndpointEntity, isAppDataEntityType } from 'in-services/entityUtils';
import { getIconTypeForEventType, getEventType, getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import { Table, Thead, Tbody, Tr, Th, Td, LoadMoreRow } from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { loadMoreRawEvents } from 'in-views/eventView/stores/rawEventListStore';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './EventsList.mless';

export default function EventsList(props) {
  const list = <List {...props} />;
  if (!props.selectedEventId) {
    return list;
  }
  return <HeightRestrictedView render={() => list} />;
}

function List({ selectedEventId, onItemClicked, rawEventList, furtherDataAvailable }) {
  const isDenseList = !!selectedEventId;
  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th />
          <Th>Title</Th>
          <Th>Start</Th>
          {!isDenseList && (
            <>
              <Th>End</Th>
              <Th>On</Th>
            </>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {rawEventList.map(event => (
          <Tr
            key={event.id}
            size="compact"
            active={event.id === selectedEventId}
            onClick={() => onItemClicked(event.id)}
          >
            <Td>
              <Icon
                event={fromJS({
                  ...event,
                  problem: {
                    severity: event.severity
                  }
                })}
              />
            </Td>
            <Td>
              <span className={locals.text}>{event.title}</span>
            </Td>
            <Td>
              <span className={locals.text}>{formatDateTime(event.start)}</span>
            </Td>
            {!isDenseList && (
              <>
                <Td>
                  <span className={locals.text}>{event.state === 'open' ? 'active' : formatDateTime(event.end)}</span>
                </Td>

                <Td>
                  <On rawEvent={event} />
                </Td>
              </>
            )}
          </Tr>
        ))}

        {furtherDataAvailable && <LoadMoreRow loadMore={loadMoreRawEvents} size="compact" cols={1} />}
      </Tbody>
    </Table>
  );
}

const Icon = connectTo(
  props => ({
    color: getColorForEventAtFocusedMomentAsStream(props.event, 'day')
  }),
  function Icon({ event, color }) {
    const iconType = getIconTypeForEventType(getEventType(event), true);
    return (
      <SvgIcon
        className={locals.icon}
        style={{
          fill: color
        }}
        type={iconType}
        size="xxs"
      />
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
      <div className={locals.entityWrapper}>
        {app20IconType ? (
          <SvgIcon className={locals.entityIcon} type={app20IconType} size="xxs" />
        ) : (
          <PluginIcon className={locals.entityIcon} size="xxs" snapshot={entity} />
        )}
        <div className={locals.title}>{label}</div>
      </div>
    );
  }
);
