/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  AreaRole,
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopedPermissionType,
  ProductAreaType,
  AreaRoleWithContributor
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { Capability } from 'in-stores/permission';
import { t, Trans } from 'in-i18n';

interface ConfigurationSummaryMsg {
  accessLevelMessage: string | JSX.Element;
  rolePermissionMessage: string;
  noAccessMessage: string;
  permissions?: string[];
}

export const getConfigurationSummaryMsg = (
  productArea: ProductAreaType,
  scope: ScopedPermissionType,
  role?: AreaRoleWithCustomType | undefined,
  permissions?: string[]
): ConfigurationSummaryMsg => {
  const areaContext = productArea.toLowerCase();
  const roleContext = role ? role?.toLowerCase() : '';
  let areaScopeContext = areaContext + '.' + scope.toLowerCase();
  let accessLevelMessage: string | JSX.Element = '';
  let rolePermissionMessage = '';
  let noAccessMessage = '';

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
      // TODO Once our version of react-i18next supports the context property in <Trans> switch to that
      accessLevelMessage = (
        <Trans
          i18nKey={
            'in-settings:configurationSummary.' +
            areaScopeContext +
            '.access_level' +
            (scope === ScopedPermissionItem.LIMITED_ACCESS ? '_' + roleContext : '')
          }
        />
      );
      rolePermissionMessage = t('in-settings:configurationSummary.' + areaScopeContext + '.role_permissions', {
        context: roleContext
      });
    }

    // Specific access level message for Synthetic Monitoring limited access only
    if (
      syntheticRbacLimitedEnabled &&
      productArea === ProductArea.SYNTHETICS &&
      scope === ScopedPermissionItem.LIMITED_ACCESS
    ) {
      accessLevelMessage = syntheticRbacLimitedEnabled
        ? role === AreaRole.OWNER &&
          (permissions!.includes(Capability.CAN_USE_SYNTHETIC_CREDENTIALS) ||
            permissions!.includes(Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS))
          ? t('in-settings:configurationSummary.' + areaScopeContext + '.access_level_tests_credentials')
          : t('in-settings:configurationSummary.' + areaScopeContext + '.access_level_web_mobile')
        : t('in-settings:configurationSummary.' + areaScopeContext + '.access_level_tp');
      rolePermissionMessage = t('in-settings:configurationSummary.' + areaContext + '.role_permissions', {
        context: roleContext
      });
    }
  } else if (scope === ScopedPermissionItem.NO_ACCESS) {
    noAccessMessage = t('in-settings:permissionScope.description_no_access', {
      context:
        productArea === ProductArea.WEBSITE ||
        productArea === ProductArea.MOBILE_APP ||
        productArea === ProductArea.APPLICATION ||
        productArea === ProductArea.KUBERNETES ||
        productArea === ProductArea.INFRASTRUCTURE ||
        productArea === ProductArea.SYNTHETICS ||
        productArea === ProductArea.AUTOMATION
          ? areaContext
          : ''
    });
  }

  return {
    accessLevelMessage: accessLevelMessage,
    rolePermissionMessage: rolePermissionMessage,
    noAccessMessage: noAccessMessage
  };
};
