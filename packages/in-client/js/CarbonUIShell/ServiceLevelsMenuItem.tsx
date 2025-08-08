/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { isSloView, serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { playwithEnabled, sloFullEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import { sloAccessPermissions } from 'in-stores/permission';
import useHasAccesses from 'in-stores/useHasAccesses';
import { t } from 'in-i18n';

export default function ServiceLevelsMenuItem() {
  const hasSloAccess = useHasAccesses({
    optionalPrecondition: sloFullEnabled,
    requiredPermissions: sloAccessPermissions,
    strategy: PERMISSION_STRATEGY.REQUIRE_ANY
  });
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
