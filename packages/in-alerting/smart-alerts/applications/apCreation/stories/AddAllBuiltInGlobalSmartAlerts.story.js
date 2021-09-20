/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import AddAllBuiltInGlobalSmartAlerts from 'in-alerting/smart-alerts/applications/apCreation/AddAllBuiltInGlobalSmartAlerts';
import { globalBuitInAlerts } from 'in-alerting/smart-alerts/applications/apCreation/stories/mockData';
import { noop } from 'in-services/fixedObjects';

export default {
  component: AddAllBuiltInGlobalSmartAlerts
};

export function addAllBuiltInGlobalSmartAlerts() {
  return <AddAllBuiltInGlobalSmartAlerts getBuiltInAlerts={() => just(globalBuitInAlerts)} onChange={noop} />;
}
