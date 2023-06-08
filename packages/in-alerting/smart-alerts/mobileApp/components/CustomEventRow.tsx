/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppPaginatedBeaconGroupsItem } from '@instana/types';

import { getEventName } from 'in-alerting/smart-alerts/mobileApp/components/customEventsUtil';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/mobileApp/components/CustomEventsList.mless';

export default function CustomEventRow({ item }: { item: MobileAppPaginatedBeaconGroupsItem }) {
  let label = getEventName(item);

  return (
    <Tooltip content={label} align="topLeft" delay={500}>
      <div className={locals.row}>{label}</div>
    </Tooltip>
  );
}
