/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';

import { Event, TimeConfig } from '@instana/types';

import { minutes } from 'in-services/time/time';

const getIncidentTimeConfig = (incident: Event): TimeConfig => {
  let windowSize = 0;
  windowSize = incident.end - get(incident, 'metadata.triggeringTime', 0) + minutes.toMillis(20);
  if (!windowSize) {
    windowSize = incident.end - incident.start + minutes.toMillis(20);
  }

  return {
    windowSize,
    to: incident.end,
    focusedMoment: incident.end,
    autoRefresh: false
  };
};

export default getIncidentTimeConfig;
