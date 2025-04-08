/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  containerPath,
  infraSmartAlerts,
  infraSmartAlertsFullScreen,
  isTableView,
  physicalPath
} from 'in-stores/navigation/paths/mainPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasInfrastructureAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function InfrastructureMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isTableViewActive = useObservable(isTableView('physical'), []);

  if (!hasInfrastructureAccess) return null;

  const isActive =
    matchLocation(physicalPath, containerPath, infraSmartAlerts, infraSmartAlertsFullScreen) || isTableViewActive;

  return (
    <MenuItem
      id="main-nav-infrastructure"
      label={t('in-components:mainNavigation.viewSwitcherlabelInfrastructure')}
      icon="lib_infrastructure_inverted"
      isActive={isActive || false}
      href={createHrefToPath(physicalPath)}
    />
  );
}
