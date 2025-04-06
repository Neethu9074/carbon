/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { playwithEnabled } from 'in-services/featureFlags';
import { hasSloAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function ServiceLevelsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasSloAccess || playwithEnabled) return null;

  return (
    <MenuItem
      id="main-nav-slo-dashboard"
      label={t('in-components:mainNavigation.viewSwitcherLabelSlo')}
      icon="lib_service_level"
      isActive={matchLocation(isSloView)}
      href={createHrefToPath(serviceLevelsOverview)}
    />
  );
}
