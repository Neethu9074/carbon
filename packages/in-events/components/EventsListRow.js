/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { just } from '@instana/observables';
import { Pill } from '@instana/components';

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
import { formatDate, formatDateTime } from 'in-services/formatters/date';
import { Duration } from 'in-events/components/EventDetailsKPIs';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import getWebsite from 'in-websites/subscriptions/getWebsite';
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
  state,
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
      <EventsListRowDense
        key={event.id}
        state={state}
        event={event}
        active={active}
        onClick={onClick}
        timeConfig={timeConfig}
      />
    );
  }

  const start = event.start;
  const end = event.manualCloseTimestamp || event.end || Date.now();
  const eventType = getEventType(event);

  const isChangeEvent = eventType === EVENT_TYPES.CHANGE;

  const cvssScore = event.metadata?.cve.cvssScore;

  const timeScaleStart = timeScale.getRange(start);
  const timeScaleEnd = timeScale.getRange(end);

  const left = toPercentageString(timeScaleStart);
  const width = toPercentageString(isChangeEvent ? 10 : Math.max(12, timeScaleEnd - timeScaleStart));
  const smallColumn = isPreview && headers?.length > 2 ? true : false;

  const carbonRow = {
    id: event.id,
    icon: <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />,
    title: (
      <div
        className={classNames({
          [locals.smallColumn]: smallColumn,
          [locals.title]: true
        })}
        title={event.title}
      >
        {event.title}
      </div>
    ),
    entityLabel: <OnEntity rawEvent={event} smallColumn={smallColumn} />,
    started: <span className={locals.text}>{formatDisplayDateTime(start, headers, isPreview)}</span>,
    ended: <span className={locals.text}>{getEndValue(event, isChangeEvent, end, start, headers, isPreview)}</span>,
    cvssScore: <span className={locals.text}>{cvssScore}</span>,
    state: <span className={locals.text}>{getStateBadge(event)}</span>,
    timeline: (
      <div className={locals.timelineWrapper}>
        <div style={{ left, width }} className={locals.line} />
      </div>
    ),
    duration: (
      <span className={locals.text}>
        <Duration event={event} listView />
      </span>
    )
  };

  return carbonRow;
}

export const OnEntity = connectTo(
  props => {
    const {
      rawEvent,
      rawEvent: { entityType, entityLabel, plugin, smartAlert, aggregated }
    } = props;

    if (isNotBlank(entityLabel)) {
      // use entity label of the event right away if available
      return {
        label: just(entityLabel)
      };
    }

    if (smartAlert && isInfraEntityType(entityType)) {
      // Infra Smart Alerts use a pseudo-entity for aggregated entities
      const pluginName = getPluginName(plugin, 1);
      const pseudoEntityLabel = t('in-events:infraSmartAlerts.pseudoAggregatedEntityLabel', {
        entityName: pluginName
      });

      // If entityLabel enrichment fails for single-entity infra smart alert events we
      // default the value to the plugin name.
      return {
        label: aggregated ? just(pseudoEntityLabel) : just(pluginName)
      };
    }

    return {
      label: getEntity(rawEvent)
        .filter(entity => !isLoading(entity))
        .map(entity => getLabel(entityType, entity))
    };
  },
  function OnEntity({ rawEvent, label, smallColumn }) {
    if (!label) {
      return null;
    }

    return (
      <div
        className={classNames({
          [locals.entityWrapper]: true,
          [locals.smallColumn]: smallColumn
        })}
      >
        <PluginIcon className={locals.entityIcon} size="s" plugin={rawEvent.plugin} />
        <div className={locals.smallColumn} title={label}>
          {label}
        </div>
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

export function getEndValue(event, isChangeEvent, end, start, headers, isPreview) {
  if (event.state === 'open') {
    return '-';
  }
  const endTime = event.manualCloseTimestamp ? event.manualCloseTimestamp : end;
  if (isChangeEvent) {
    return formatDisplayDateTime(endTime, headers, isPreview);
  }
  return start !== endTime ? formatDisplayDateTime(endTime, headers, isPreview) : valueMissingPlaceholder;
}

export function getColorForState(event) {
  if (event.state === 'open') {
    return 'cyan';
  }

  if (event.state === 'closed') {
    if (!event.manuallyClosed) {
      return 'gray';
    } else {
      return 'green';
    }
  }

  if (event.state === 'manually_closed') {
    return 'green';
  }
}

function getTranslatedLabelForState(event) {
  const eventState = event.state;
  if (eventState === 'open') {
    return t('in-events:stateActive');
  }

  if (eventState === 'closed') {
    if (!event.manuallyClosed) {
      return t('in-events:stateClosedByInstana');
    } else {
      return t('in-events:stateManuallyClosed');
    }
  }

  if (eventState === 'manually_closed') {
    return t('in-events:stateManuallyClosed');
  }
}

export function getStateBadge(event) {
  return (
    <Pill className={locals.badge} type={getColorForState(event)}>
      {getTranslatedLabelForState(event)}
    </Pill>
  );
}

function formatDisplayDateTime(timestamp, headers, isPreview) {
  if (headers?.length > 4 && isPreview) {
    return formatDate(timestamp);
  }
  return formatDateTime(timestamp);
}
