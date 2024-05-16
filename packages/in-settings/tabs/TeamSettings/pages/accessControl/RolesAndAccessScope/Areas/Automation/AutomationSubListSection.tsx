/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import { Ul } from '@instana/components';

import {
  automationAdditionalCapabilities,
  automationViewCapabilities,
  ProductArea
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilitySubsection } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/context';
import { getAreaRoleFromPermissionSet } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { t } from 'in-i18n';

export function AutomationSubListSection() {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);
  const areaRole = getAreaRoleFromPermissionSet(ProductArea.AUTOMATION, permissionsSet);

  const capabilities =
    areaRole === 'OWNER' ? automationAdditionalCapabilities : areaRole === 'VIEWER' ? automationViewCapabilities : [];

  return (
    <Ul>
      <CapabilitySubsection
        capabilities={capabilities}
        headerText={t('in-settings:productAreas.additionalPermissions')}
      />
    </Ul>
  );
}
