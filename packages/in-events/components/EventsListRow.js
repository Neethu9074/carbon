/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import {
  isApplicationEntity,
  isServiceEntity,
  isEndpointEntity,
  isAppDataEntityType,
  isWebsiteEntityType
} from 'in-services/entityUtils';
import { getEventType, EVENT_TYPES, getEventSeverityLabelWithEventType } from 'in-stores/events';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import EventsListRowDense from 'in-events/components/EventsListRowDense';
import getApplication from 'in-subscription/application/getApplication';
import { Tr, Td } from 'in-components/tables/sharedComponents';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { formatDateTime } from 'in-services/formatters/date';
import getWebsite from 'in-subscription/website/getWebsite';
import EventIcon from 'in-events/components/EventIcon';
import PluginIcon from 'in-components/PluginIcon';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './EventsListRow.mless';

export default function EventRow({ selectedEventId, onItemClicked, isDenseList, timeScale, event }) {
  const active = event.id === selectedEventId;
  const onClick = () => onItemClicked(event.id);

  if (isDenseList) {
    return <EventsListRowDense key={event.id} event={event} active={active} onClick={onClick} />;
  }

  const start = event.start;
  const end = event.end || Date.now();
  const eventType = getEventType(event);
  const isChangeEvent = eventType === EVENT_TYPES.CHANGE;

  const timeScaleStart = timeScale.getRange(start);
  const timeScaleEnd = timeScale.getRange(end);

  const left = toPercentageString(timeScaleStart);
  const width = toPercentageString(isChangeEvent ? 10 : Math.max(12, timeScaleEnd - timeScaleStart));

  return (
    <Tr key={event.id} size="compact" active={active} onClick={onClick}>
      <Td>
        <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event)} />
      </Td>
      <Td>
        <div className={locals.title}>{event.title}</div>
      </Td>
      <Td>
        <On rawEvent={event} />
      </Td>
      <Td>
        <span className={locals.text}>{formatDateTime(start)}</span>
      </Td>
      <Td>
        <span className={locals.text}>
          {event.state === 'open'
            ? t('in-events:active')
            : start !== end
            ? formatDateTime(end)
            : valueMissingPlaceholder}
        </span>
      </Td>
      <Td>
        <div className={locals.timelineWrapper}>
          <div style={{ left, width }} className={locals.line} />
        </div>
      </Td>
    </Tr>
  );
}

function toPercentageString(value) {
  return `${value}%`;
}

const On = connectTo(
  props => {
    if (isApplicationEntity(props.rawEvent.entityType)) {
      return {
        entity: getApplication({ id: props.rawEvent.entityId }),
        app20IconType: just('lib_application')
      };
    } else if (isServiceEntity(props.rawEvent.entityType)) {
      return {
        entity: getServiceLabel({ id: props.rawEvent.entityId }),
        app20IconType: just('lib_application_service')
      };
    } else if (isEndpointEntity(props.rawEvent.entityType)) {
      return {
        entity: getEndpointInfo({
          id: props.rawEvent.entityId
        }),
        app20IconType: just('lib_application_endpoint')
      };
    } else if (isWebsiteEntityType(props.rawEvent.entityType)) {
      return {
        entity: getWebsite({
          id: props.rawEvent.entityId
        }),
        app20IconType: just('lib_website')
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
    if (isAppDataEntityType(rawEvent.entityType) || isWebsiteEntityType(rawEvent.entityType)) {
      label = entity.data.label;
    } else {
      label = getLabel(entity);
    }
    return (
      <div className={locals.entityWrapper}>
        {app20IconType ? (
          <SvgIcon className={locals.entity20Icon} type={app20IconType} size="xs" />
        ) : (
          <PluginIcon className={locals.entityIcon} size="s" snapshot={entity} />
        )}
        <div className={locals.title}>{label}</div>
      </div>
    );
  }
);
