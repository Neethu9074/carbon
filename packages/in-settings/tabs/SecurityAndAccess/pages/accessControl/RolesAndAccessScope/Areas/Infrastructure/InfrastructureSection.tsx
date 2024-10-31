/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import { Li, Typography, Ul } from '@instana/components';

import {
  infrastructureDefaultCapabilities,
  ProductArea,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { CapabilitySubsection } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/components/CapabilitySubsection';
import { RolesAndAccessScopeContext } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/context';
import { AreaExpandableListItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Areas/AreaExpandableListItem';
import { getScopeFromProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { infraSmartAlertsEnabled } from 'in-services/featureFlags';
import { AreaPermission, Capability } from 'in-stores/permission';
import { t } from 'in-i18n';

export const InfrastructureSection = () => {
  const { permissionsSet } = useContext(RolesAndAccessScopeContext);

  const scopeId = permissionsSet.infraDfqFilter?.scopeId;
  const areaAccessScope = getScopeFromProductArea(ProductArea.INFRASTRUCTURE, permissionsSet);
  const hasNoAccess = areaAccessScope === ScopedPermissionItem.NO_ACCESS;
  const hasLimitedAccess = areaAccessScope === ScopedPermissionItem.LIMITED_ACCESS;
  const hasFullAreaAccess = areaAccessScope === ScopedPermissionItem.ACCESS_ALL;

  const getColumnContentMessage = () => {
    if (hasLimitedAccess) {
      return t('in-settings:productAreas.infrastructureContentMessage');
    } else if (hasFullAreaAccess) {
      return t('in-settings:productAreas.infrastructureAccessAllMessage');
    }
    return null;
  };

  const subListContent = (
    <Ul>
      {scopeId && (
        <Li>
          <Typography variant="body-regular">{scopeId}</Typography>
        </Li>
      )}
      <CapabilitySubsection
        capabilities={[
          ...infrastructureDefaultCapabilities,
          ...(infraSmartAlertsEnabled ? [Capability.CAN_CONFIGURE_GLOBAL_INFRA_SMART_ALERTS] : [])
        ]}
        areaPermissions={[AreaPermission.ACCESS_INFRASTRUCTURE_ANALYZE]}
        headerText={t('in-settings:productAreas.additionalPermissions')}
      />
    </Ul>
  );

  return (
    <AreaExpandableListItem
      iconType="lib_infrastructure_inverted"
      firstColumnHeadline={t('in-settings:permissionScope.selection', {
        context: areaAccessScope.toLocaleLowerCase()
      })}
      firstColumnLabel={t('in-settings:productAreas.title_infrastructure')}
      subList={subListContent}
      disabled={hasNoAccess}
    >
      {!hasNoAccess && <Typography variant="body-small">{getColumnContentMessage()}</Typography>}
    </AreaExpandableListItem>
  );
};
