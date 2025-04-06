/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { businessPerspectivesPath, businessProcessPath, isBizOpsView } from 'in-bizops/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasBizOpsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function BizOpsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const hostCount = window.instana?.reportingData?.hostCount;

  if (!hasBizOpsAccess) return null;

  // If there are no agents (hosts) detected, we want to disable the business
  // perspectives tab, and direct the users to the Processes tab directly
  const shouldTakeToPerspectives = typeof hostCount == 'number' && hostCount > 0;
  const redirectPath = createHrefToPath(shouldTakeToPerspectives ? businessPerspectivesPath : businessProcessPath);

  return (
    <MenuItem
      id="main-nav-bizops"
      label={t('in-bizops:navigation.businessMonitoring')}
      icon="lib_bizops"
      isActive={matchLocation(isBizOpsView)}
      href={redirectPath}
    />
  );
}
