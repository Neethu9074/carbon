/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { builtInGlobalApplicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

export default function BuiltInGlobalSmartAlertsPermissionWrapper({ children }) {
  return <>{hasPermissionToAddBuiltInSmartAlerts() ? children : null}</>;
}

export function hasPermissionToAddBuiltInSmartAlerts() {
  return role.canConfigureGlobalAlertConfigs && builtInGlobalApplicationSmartAlertsEnabled;
}
