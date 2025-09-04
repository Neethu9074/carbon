/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { actionCatalogFullyQualified, isAutomationView } from 'in-automation/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { automationAccessPermissions } from 'in-stores/permission';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

export default function AutomationMenuItem() {
  const hasAutomationAccess = useHasAccess({
    optionalPrecondition: actionAutomationEnabled,
    requiredPermissions: automationAccessPermissions
  });
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasAutomationAccess) return null;

  return (
    <MenuItem
      id="main-nav-automation-dashboard"
      label={t('in-automation:automation')}
      icon="lib_automation"
      isActive={matchLocation(isAutomationView)}
      href={createHrefToPath(actionCatalogFullyQualified)}
    />
  );
}
