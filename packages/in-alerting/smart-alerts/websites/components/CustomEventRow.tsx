/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { WebsitePaginatedBeaconGroupsItem } from '@instana/types';

import { getEventName } from 'in-alerting/smart-alerts/websites/components/customEventsUtil';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/websites/components/CustomEventsList.mless';

export default function CustomEventRow({ item }: { item: WebsitePaginatedBeaconGroupsItem }) {
  let label = getEventName(item);

  return (
    <Tooltip content={label} align="topLeft" delay={500}>
      <div className={locals.row}>{label}</div>
    </Tooltip>
  );
}
