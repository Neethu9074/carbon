/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { builtInGlobalApplicationSmartAlertsEnabled } from 'in-services/featureFlags';

export default function BuiltInGlobalSmartAlertsPermissionWrapper({ children, role }) {
  return <>{hasPermissionToAddBuiltInSmartAlerts(role) ? children : null}</>;
}

export function hasPermissionToAddBuiltInSmartAlerts(role) {
  return role.canConfigureGlobalApplicationSmartAlerts && builtInGlobalApplicationSmartAlertsEnabled;
}
