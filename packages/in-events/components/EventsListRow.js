/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Pill, Checkbox } from '@instana/components';
import { just } from '@instana/observables';
import { Tr, Td } from '@instana/legacy';

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
import { isDisplayColumn } from 'in-events/components/EventsList';
import { Duration } from 'in-events/components/EventDetailsKPIs';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { multiCloseEnabled } from 'in-services/featureFlags';
import EventIcon from 'in-events/components/EventIcon';
import { UNKNOWN_LABEL } from 'in-sdk/snapshot/legacy';
import { isNotBlank } from 'in-services/util/string';
import { isLoading } from 'in-services/util/result';
import PluginIcon from 'in-components/PluginIcon';
import { getPluginName } from 'in-sdk/pluginName';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
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
  isPreview,
  selectedRows,
  handleSelectRow,
  selectedType
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

  const canMultiCloseEvents = multiCloseEnabled && role?.canManuallyCloseIssue;
  const canCloseManually = role?.canManuallyCloseIssue;
  const isEventClosed = event.state === 'closed' || event.state === 'manually_closed';
  const start = event.start;
  const end = event.manualCloseTimestamp || event.end || Date.now();
  const eventType = getEventType(event);
  const eventTypeSupported = selectedType === 'incident' || selectedType === 'issue';

  const renderCheckboxes = () => {
    if (!eventTypeSupported) {
      return null;
    }

    return (
      <Td>
        <Checkbox
          disabled={isEventClosed}
          checked={selectedRows.includes(event.id)}
          onChange={() => handleSelectRow(event.id)}
        />
      </Td>
    );
  };

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

  if (!canMultiCloseEvents) {
    return carbonRow;
  }
  return (
    <Tr key={event.id} size="compact" active={active}>
      {/* Conditional rendering based on eventType */}
      {event.type === 'cve_issue' ? (
        // Custom rendering logic for cve_issue
        <>
          {renderCheckboxes()}
          <Td onClick={onClick}>
            <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
          </Td>
          {isDisplayColumn(headers, 'title') && (
            <Td onClick={onClick}>
              <div
                className={classNames({
                  [locals.smallColumn]: smallColumn,
                  [locals.title]: true
                })}
                title={event.title}
              >
                {event.title}
              </div>
            </Td>
          )}
          {isDisplayColumn(headers, 'entityLabel') && (
            <Td onClick={onClick}>
              <OnEntity rawEvent={event} smallColumn={smallColumn} />
            </Td>
          )}
          {isDisplayColumn(headers, 'started') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{formatDisplayDateTime(start, headers, isPreview)}</span>
            </Td>
          )}
          {isDisplayColumn(headers, 'cvssScore') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{cvssScore}</span>
            </Td>
          )}
          {isDisplayColumn(headers, 'state') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{getStateBadge(event)}</span>
            </Td>
          )}
        </>
      ) : (
        // Default rendering logic
        <>
          {renderCheckboxes()}
          <Td onClick={onClick}>
            <EventIcon event={event} tooltipLabel={getEventSeverityLabelWithEventType(event, timeConfig)} />
          </Td>
          {isDisplayColumn(headers, 'title') && (
            <Td onClick={onClick}>
              <div
                className={classNames({
                  [locals.smallColumn]: smallColumn,
                  [locals.title]: true
                })}
                title={event.title}
              >
                {event.title}
              </div>
            </Td>
          )}
          {isDisplayColumn(headers, 'entityLabel') && (
            <Td onClick={onClick}>
              <OnEntity rawEvent={event} smallColumn={smallColumn} />
            </Td>
          )}
          {isDisplayColumn(headers, 'started') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{formatDisplayDateTime(start, headers, isPreview)}</span>
            </Td>
          )}
          {isDisplayColumn(headers, 'ended') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{getEndValue(event, isChangeEvent, end, start, headers, isPreview)}</span>
            </Td>
          )}
          {isDisplayColumn(headers, 'timeline') && (
            <Td onClick={onClick}>
              <div className={locals.timelineWrapper}>
                <div style={{ left, width }} className={locals.line} />
              </div>
            </Td>
          )}
          {canCloseManually && isDisplayColumn(headers, 'state') && (
            <Td onClick={onClick}>
              <span className={locals.text}>{getStateBadge(event)}</span>
            </Td>
          )}
          {headers && isDisplayColumn(headers, 'duration') && (
            <Td onClick={onClick}>
              <span className={locals.text}>
                <Duration event={event} listView />
              </span>
            </Td>
          )}
        </>
      )}
    </Tr>
  );
}

export const OnEntity = connectTo(
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

function getColorForState(event) {
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
