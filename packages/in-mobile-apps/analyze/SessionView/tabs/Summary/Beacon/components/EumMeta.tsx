/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { expandNestedSerializedJson } from 'in-services/util/json';
import { MobileAppMonitoringBeacon } from 'in-types';
import Code from 'in-components/Code';

import locals from './EumMeta.mless';

export interface EumMetaProp {
  beacon: MobileAppMonitoringBeacon;
}

export default function EumMeta({ beacon }: EumMetaProp) {
  return (
    <Code
      wrapperClassName={locals.meta}
      showLineNumbers={false}
      code={JSON.stringify(expandNestedSerializedJson(beacon.internalMeta), null, 2)}
      lang="json"
    />
  );
}
