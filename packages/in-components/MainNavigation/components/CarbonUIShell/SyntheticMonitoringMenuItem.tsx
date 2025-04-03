/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isSyntheticMonitoringView, syntheticsPath } from 'in-synthetics/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasSyntheticsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function SyntheticMonitoringMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSyntheticsAccess) return null;

  return (
    <MenuItem
      id="main-nav-synthetics"
      label={t('in-synthetics:navigation.synthetics')}
      icon="lib_synthetic"
      isActive={matchLocation(isSyntheticMonitoringView)}
      href={createHrefToPath(syntheticsPath)}
    />
  );
}
