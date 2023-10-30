/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AreaRole,
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType,
  ProductAreaType,
  AreaRoleWithContributor,
  AreaRoleWithContributorType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

interface ConfigurationSummaryMsg {
  accessLevelMessage: string;
  rolePermissionMessage: string;
  noAccessMessage: string;
}

export const getConfigurationSummaryMsg = (
  productArea: ProductAreaType,
  scope: ScopedPermissionType,
  role?: AreaRoleWithCustomType | AreaRoleWithContributorType | undefined
): ConfigurationSummaryMsg => {
  const areaContext = productArea.toLowerCase();
  const roleContext = role ? role?.toLowerCase() : '';
  let areaScopeContext = areaContext + '.' + scope.toLowerCase();
  let accessLevelMessage = '';
  let rolePermissionMessage = '';
  let noAccessMessage = '';

  // Infrastructure does not have access all => show message for limited access
  if (productArea === ProductArea.INFRASTRUCTURE && scope === ScopedPermissionItem.ACCESS_ALL) {
    areaScopeContext = areaContext + '.' + ScopedPermissionItem.LIMITED_ACCESS.toLowerCase();
  }

  if (
    (scope === ScopedPermissionItem.ACCESS_ALL || scope === ScopedPermissionItem.LIMITED_ACCESS) &&
    role !== 'CUSTOM'
  ) {
    // Messages for Owner and Viewer (and no role)
    if (role === AreaRole.OWNER || role === AreaRole.VIEWER || role === undefined) {
      accessLevelMessage = t('in-settings:configurationSummary.' + areaScopeContext + '.access_level');
      rolePermissionMessage = t('in-settings:configurationSummary.' + areaContext + '.role_permissions', {
        context: roleContext
      });
    }

    // Specific message for Contributor (Application only at the moment)
    if (productArea === ProductArea.APPLICATION && role === AreaRoleWithContributor.CONTRIBUTOR) {
      // TODO modify when CONTRIBUTOR has been added as type
      accessLevelMessage = t('in-settings:configurationSummary.' + areaScopeContext + '.access_level', {
        context: scope === ScopedPermissionItem.LIMITED_ACCESS ? roleContext : ''
      });
      rolePermissionMessage = t('in-settings:configurationSummary.' + areaScopeContext + '.role_permissions', {
        context: roleContext
      });
    }
  } else if (scope === ScopedPermissionItem.NO_ACCESS) {
    noAccessMessage = t('in-settings:permissionScope.description_no_access', {
      context: productArea === ProductArea.KUBERNETES ? 'kubernetes' : ''
    });
  }

  return {
    accessLevelMessage: accessLevelMessage,
    rolePermissionMessage: rolePermissionMessage,
    noAccessMessage: noAccessMessage
  };
};
