/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Tr, Td } from '@instana/components';
import { just } from '@instana/observables';

import {
  isApplicationEntity,
  isServiceEntity,
  isEndpointEntity,
  isWebsiteEntityType,
  isInfraEntityType
} from 'in-services/entityUtils';
import { getEventType, EVENT_TYPES, getEventSeverityLabelWithEventType } from 'in-stores/events';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import EventsListRowDense from 'in-events/components/EventsListRowDense';
import { isDisplayColumn } from 'in-events/components/EventsList';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { formatDateTime } from 'in-services/formatters/date';
import EventIcon from 'in-events/components/EventIcon';
import { UNKNOWN_LABEL } from 'in-sdk/snapshot/legacy';
import { isNotBlank } from 'in-services/util/string';
import { isLoading } from 'in-services/util/result';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './EventsListRow.mless';

export default function EventRow({
  selectedEventId,
  onItemClicked,
  isDenseList,
  timeScale,
  timeConfig,
  event,
  headers,
  isPreview
}) {
  const active = event.id === selectedEventId;
  const onClick = () => onItemClicked(event.id);
  if (isDenseList) {
    return (
      <EventsListRowDense key={event.id} event={event} active={active} onClick={onClick} timeConfig={timeConfig} />
    );
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
    <Tr key={event.id} size="compact" active={active} onClick={isPreview ? undefined : onClick}>
      <Td>
        <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
      </Td>
      {isDisplayColumn(headers, 'title') && (
        <Td>
          <div className={locals.title}>{event.title}</div>
        </Td>
      )}
      {isDisplayColumn(headers, 'entityLabel') && (
        <Td>
          <OnEntity rawEvent={event} />
        </Td>
      )}
      {isDisplayColumn(headers, 'started') && (
        <Td>
          <span className={locals.text}>{formatDateTime(start)}</span>
        </Td>
      )}
      {isDisplayColumn(headers, 'ended') && (
        <Td>
          <span className={locals.text}>{getEndValue(event, isChangeEvent, end, start)}</span>
        </Td>
      )}
      {isDisplayColumn(headers, 'timeline') && (
        <Td>
          <div className={locals.timelineWrapper}>
            <div style={{ left, width }} className={locals.line} />
          </div>
        </Td>
      )}
    </Tr>
  );
}

const OnEntity = connectTo(
  props => {
    const {
      rawEvent,
      rawEvent: { entityType, entityLabel, plugin, smartAlert }
    } = props;

    if (isNotBlank(entityLabel)) {
      // use entity label of the event right away if available
      return {
        label: just(entityLabel)
      };
    }

    if (smartAlert && isInfraEntityType(entityType)) {
      // Infra Smart Alerts use a pseudo-entity for aggregated entities
      const pseudoEntityLabel = t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', {
        entityName: getPluginName(plugin, 1)
      });
      return {
        label: just(pseudoEntityLabel)
      };
    }

    return {
      label: getEntity(rawEvent)
        .filter(entity => !isLoading(entity))
        .map(entity => getLabel(entityType, entity))
    };
  },
  function OnEntity({ rawEvent, label }) {
    if (!label) {
      return null;
    }

    return (
      <div className={locals.entityWrapper}>
        <PluginIcon className={locals.entityIcon} size="s" plugin={rawEvent.plugin} />
        <div className={locals.title}>{label}</div>
      </div>
    );
  }
);

function getEntity(rawEvent) {
  const { entityType, entityId, entityTimestamp } = rawEvent;

  if (isApplicationEntity(entityType)) {
    return getApplication({ id: entityId });
  } else if (isServiceEntity(entityType)) {
    return getServiceLabel({ id: entityId });
  } else if (isEndpointEntity(entityType)) {
    return getEndpointInfo({ id: entityId });
  } else if (isWebsiteEntityType(entityType)) {
    return getWebsite({ id: entityId });
  }

  return getSnapshot(entityId, getTimeConfigAtMoment(entityTimestamp));
}

function toPercentageString(value) {
  return `${value}%`;
}

function getLabel(entityType, entityOrSnapshot) {
  if (isInfraEntityType(entityType)) {
    return getSnapshotLabel(entityOrSnapshot, UNKNOWN_LABEL);
  }

  return entityOrSnapshot?.data?.label ?? UNKNOWN_LABEL;
}

function getEndValue(event, isChangeEvent, end, start) {
  if (event.state === 'open') {
    return t('in-events:active');
  }
  if (isChangeEvent) {
    return formatDateTime(end);
  }
  return start !== end ? formatDateTime(end) : valueMissingPlaceholder;
}
