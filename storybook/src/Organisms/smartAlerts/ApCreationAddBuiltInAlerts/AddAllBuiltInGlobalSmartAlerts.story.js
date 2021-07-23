/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import AddAllBuiltInGlobalSmartAlerts from 'in-alerting/smart-alerts/applications/apCreation/AddAllBuiltInGlobalSmartAlerts';
import { noop } from 'in-services/fixedObjects';
import { globalBuitInAlerts } from './mockData';

export default {
  title: 'Organisms|smartAlerts/apCreationAddBuiltInAlerts|AddAllBuiltInGlobalSmartAlerts',
  component: AddAllBuiltInGlobalSmartAlerts
};

export function addAllBuiltInGlobalSmartAlerts() {
  return <AddAllBuiltInGlobalSmartAlerts getBuiltInAlerts={() => just(globalBuitInAlerts)} onChange={noop} />;
}
