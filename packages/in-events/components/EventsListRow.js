import { just } from 'reactive-observables';
import { fromJS } from 'immutable';
import React from 'react';

import { isApplicationEntity, isServiceEntity, isEndpointEntity, isAppDataEntityType } from 'in-services/entityUtils';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import EventsListRowDense from 'in-events/components/EventsListRowDense';
import getApplication from 'in-subscription/application/getApplication';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import EventIcon from 'in-events/components/EventIcon';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './EventsListRow.mless';

export default function EventRow({ selectedEventId, onItemClicked, isDenseList, event }) {
  const active = event.id === selectedEventId;
  const onClick = () => onItemClicked(event.id);

  if (isDenseList) {
    return <EventsListRowDense key={event.id} event={event} active={active} onClick={onClick} />;
  }

  return (
    <Tr key={event.id} size="compact" active={active} onClick={onClick}>
      <Td>
        <EventIcon
          event={fromJS({
            ...event,
            problem: {
              severity: event.severity
            }
          })}
        />
      </Td>
      <Td>
        <div className={locals.title}>{event.title}</div>
      </Td>
      <Td>
        <span className={locals.text}>{formatDateTime(event.start)}</span>
      </Td>
      <>
        <Td>
          <span className={locals.text}>{event.state === 'open' ? 'active' : formatDateTime(event.end)}</span>
        </Td>

        <Td>
          <On rawEvent={event} />
        </Td>
      </>
    </Tr>
  );
}

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
