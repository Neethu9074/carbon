/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import locals from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList.mless';

interface MonitoredEntityLabelProps {
  sliName: string;
  entityLabel?: string;
  serviceLabel?: string;
  endpointLabel?: string;
}

export default function MonitoredEntityLabel({
  entityLabel,
  serviceLabel,
  endpointLabel,
  sliName
}: MonitoredEntityLabelProps) {
  let subscript = '';

  if (entityLabel) {
    subscript = subscript + entityLabel;
  }
  if (serviceLabel) {
    subscript = `${subscript} > ${serviceLabel}`;
  }
  if (endpointLabel) {
    subscript = `${subscript} > ${endpointLabel}`;
  }
  return <KeyValue label={subscript} value={sliName} className={locals.nameColumn} />;
}
