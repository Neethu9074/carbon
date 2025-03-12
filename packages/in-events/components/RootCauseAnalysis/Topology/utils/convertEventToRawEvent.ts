/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get, has, isUndefined } from 'lodash';

import { Event, RawEvent } from '@instana/types';

const convertEventToRawEvent = (event: Event[] | undefined): RawEvent[] => {
  if (isUndefined(event)) {
    return [];
  }

  return event.map(e => {
    const entityTimestamp = get(e, 'metadata.triggeringTime', e.start);
    const manuallyClosed = has(e, 'metadata.manualCloseTimestamp');
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
      smartAlert: false,
      description,
      title: description
    };
  });
};

export default convertEventToRawEvent;
