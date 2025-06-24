/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get, has, isUndefined } from 'lodash';

import { Event, RawEvent } from '@instana/types';

export const convertEventsToRawEvents = (event: Event[] | undefined): RawEvent[] => {
  if (isUndefined(event)) {
    return [];
  }

  return event.map(e => convertEventToRawEvent(e));
};

export const convertEventToRawEvent = (e: Event | undefined): RawEvent => {
  if (isUndefined(e)) {
    return {} as RawEvent;
  }

  const entityTimestamp = get(e, 'metadata.triggeringTime', e.start);
  const manuallyClosed = hasManualCloseFields(e);
  const manualCloseTimestamp = manuallyClosed ? get(e, 'metadata.manualCloseTimestamp') : null;
  const description = get(e, 'problem.fixSuggestion', null);

  return {
    cursor: {
      ingestionTime: 0,
      offset: 0
    },
    id: e.id,
    entityId: e.entityId,
    metricAccessId: e.metricAccessId,
    entityType: e.entityType,
    start: e.start,
    entityTimestamp,
    end: e.end,
    manualCloseTimestamp,
    type: e.type,
    severity: get(e, 'problem.severity', ''),
    metadata: get(e, 'metadata', {}),
    state: e.state,
    manuallyClosed,
    plugin: e.plugin,
    entityLabel: get(e, 'metadata.entityLabel'),
    smartAlert: isSmartAlert(e),
    description,
    title: description,
    aggregated: isInfraSmartAlertEvent(e) ? get(e, 'metadata.aggregated', true) : null,
    transient: get(e, 'transient', false)
  };
};

/**
 * Checks if an event is any type of smart alert
 */
const isSmartAlert = (event: Event): boolean => {
  return (
    isApplicationSmartAlertEvent(event) ||
    isWebsiteSmartAlertEvent(event) ||
    isInfraSmartAlertEvent(event) ||
    isSyntheticSmartAlertEvent(event) ||
    isMobileAppSmartAlertEvent(event) ||
    isSloSmartAlertEvent(event) ||
    isLogSmartAlertEvent(event)
  );
};

const isApplicationSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.applicationId');
};

const isWebsiteSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.websiteId');
};

const isInfraSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.infraSmartAlert');
};

const isSyntheticSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.syntheticTestId');
};

const isMobileAppSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.mobileAppId');
};

const isSloSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.sloId');
};

const isLogSmartAlertEvent = (event: Event): boolean => {
  return has(event, 'metadata.logSmartAlert');
};

/**
 * Checks if an event has all the required manual close fields
 */
const hasManualCloseFields = (event: Event): boolean => {
  return (
    has(event, 'metadata.manualCloseReason') &&
    has(event, 'metadata.manualCloseTimestamp') &&
    has(event, 'metadata.manualCloseUsername')
  );
};
