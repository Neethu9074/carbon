/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  ProductArea,
  ScopedPermissionItem,
  AreaRole,
  AreaRoleWithContributor
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getConfigurationSummaryMsg } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { t, Trans } from 'in-i18n';

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ConfigurationSummary/getConfigurationSummaryMsg', () => {
  describe('Application', () => {
    test.each([
      [ProductArea.APPLICATION, ScopedPermissionItem.ACCESS_ALL, AreaRole.OWNER],
      [ProductArea.APPLICATION, ScopedPermissionItem.ACCESS_ALL, AreaRole.VIEWER],
      [ProductArea.APPLICATION, ScopedPermissionItem.ACCESS_ALL, AreaRoleWithContributor.CONTRIBUTOR],
      [ProductArea.APPLICATION, ScopedPermissionItem.LIMITED_ACCESS, AreaRole.OWNER],
      [ProductArea.APPLICATION, ScopedPermissionItem.LIMITED_ACCESS, AreaRole.VIEWER],
      [ProductArea.APPLICATION, ScopedPermissionItem.LIMITED_ACCESS, AreaRoleWithContributor.CONTRIBUTOR]
    ])('%s: shows correct messages for %s with role %s', (productArea, scope, role) => {
      let configSummaryMsg = getConfigurationSummaryMsg(productArea, scope, role);
      const productContext = productArea.toLowerCase();
      const scopeContext = scope.toLowerCase();

      if (role === AreaRoleWithContributor.CONTRIBUTOR) {
        expect(configSummaryMsg.accessLevelMessage).toEqual(
          <Trans
            i18nKey={
              'in-settings:configurationSummary.' +
              productContext +
              '.' +
              scopeContext +
              '.access_level' +
              (scope === ScopedPermissionItem.LIMITED_ACCESS ? '_' + role.toLowerCase() : '')
            }
          />
        );

        expect(configSummaryMsg.rolePermissionMessage).toEqual(
          t(
            'in-settings:configurationSummary.' +
              productContext +
              '.' +
              scopeContext +
              '.role_permissions_' +
              role.toLowerCase()
          )
        );
      } else {
        // Owner, Viewer
        expect(configSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
        );

        expect(configSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_' + role.toLowerCase())
        );
      }

      expect(configSummaryMsg.noAccessMessage).toEqual('');
    });

    test('shows correct messages for no access', () => {
      let configSummaryMsg = getConfigurationSummaryMsg(ProductArea.APPLICATION, ScopedPermissionItem.NO_ACCESS);

      expect(configSummaryMsg.accessLevelMessage).toEqual('');
      expect(configSummaryMsg.rolePermissionMessage).toEqual('');
      expect(configSummaryMsg.noAccessMessage).toEqual(
        t('in-settings:permissionScope.description_no_access_application')
      );
    });

    test('shows correct messages for role CUSTOM', () => {
      let configSummaryMsg = getConfigurationSummaryMsg(
        ProductArea.APPLICATION,
        ScopedPermissionItem.ACCESS_ALL,
        'CUSTOM'
      );

      // No messages for role CUSTOM
      expect(configSummaryMsg.accessLevelMessage).toEqual('');
      expect(configSummaryMsg.rolePermissionMessage).toEqual('');
      expect(configSummaryMsg.noAccessMessage).toEqual('');
    });
  });

  describe('Infrastructure', () => {
    test.each([[ProductArea.INFRASTRUCTURE, AreaRole.VIEWER]])(
      '%s: shows correct messages for limited access with role %s',
      (productArea, role) => {
        let configSummaryMsg = getConfigurationSummaryMsg(productArea, ScopedPermissionItem.LIMITED_ACCESS, role);
        const productContext = productArea.toLowerCase();

        expect(configSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.limited_access.access_level')
        );
        expect(configSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_' + role.toLowerCase())
        );
      }
    );

    test('shows correct messages for access all', () => {
      let configSummaryMsg = getConfigurationSummaryMsg(
        ProductArea.INFRASTRUCTURE,
        ScopedPermissionItem.ACCESS_ALL,
        AreaRole.VIEWER
      );

      expect(configSummaryMsg.accessLevelMessage).toEqual(
        t('in-settings:configurationSummary.infrastructure.access_all.access_level')
      );
      expect(configSummaryMsg.rolePermissionMessage).toEqual(
        t('in-settings:configurationSummary.infrastructure.role_permissions_viewer')
      );
    });
  });

  describe('Kubernetes', () => {
    test.each([
      [ProductArea.KUBERNETES, ScopedPermissionItem.ACCESS_ALL],
      [ProductArea.KUBERNETES, ScopedPermissionItem.LIMITED_ACCESS]
    ])('%s: shows correct messages for %s', (productArea, scope) => {
      let configSummaryMsg = getConfigurationSummaryMsg(productArea, scope);
      const productContext = productArea.toLowerCase();
      const scopeContext = scope.toLowerCase();
      expect(configSummaryMsg.accessLevelMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
      );
      expect(configSummaryMsg.rolePermissionMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.role_permissions')
      );

      // Viewer
      configSummaryMsg = getConfigurationSummaryMsg(productArea, scope, AreaRole.VIEWER);
      expect(configSummaryMsg.accessLevelMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
      );
      expect(configSummaryMsg.rolePermissionMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.role_permissions')
      );
    });

    test('shows correct messages for no access', () => {
      let configSummaryMsg = getConfigurationSummaryMsg(ProductArea.KUBERNETES, ScopedPermissionItem.NO_ACCESS);
      expect(configSummaryMsg.accessLevelMessage).toEqual('');
      expect(configSummaryMsg.rolePermissionMessage).toEqual('');
      expect(configSummaryMsg.noAccessMessage).toEqual(
        t('in-settings:permissionScope.description_no_access_kubernetes')
      );
    });
  });

  describe('Mobile app, Website', () => {
    test.each([
      [ProductArea.MOBILE_APP, ScopedPermissionItem.ACCESS_ALL],
      [ProductArea.WEBSITE, ScopedPermissionItem.ACCESS_ALL],
      [ProductArea.MOBILE_APP, ScopedPermissionItem.LIMITED_ACCESS],
      [ProductArea.WEBSITE, ScopedPermissionItem.LIMITED_ACCESS]
    ])('%s: shows correct messages for %s', (productArea, scope) => {
      // Owner
      let configSummaryMsg = getConfigurationSummaryMsg(productArea, scope, AreaRole.OWNER);
      const productContext = productArea.toLowerCase();
      const scopeContext = scope.toLowerCase();
      expect(configSummaryMsg.accessLevelMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
      );
      expect(configSummaryMsg.rolePermissionMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.role_permissions_owner')
      );

      // Viewer
      configSummaryMsg = getConfigurationSummaryMsg(productArea, scope, AreaRole.VIEWER);
      expect(configSummaryMsg.accessLevelMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
      );
      expect(configSummaryMsg.rolePermissionMessage).toEqual(
        t('in-settings:configurationSummary.' + productContext + '.role_permissions_viewer')
      );
    });
  });

  describe('Synthetics', () => {
    test.each([
      [ProductArea.SYNTHETICS, ScopedPermissionItem.ACCESS_ALL],
      [ProductArea.SYNTHETICS, ScopedPermissionItem.LIMITED_ACCESS]
    ])('%s: shows correct messages for %s', (productArea, scope) => {
      // Owner
      const ownerConfigSummaryMsg = getConfigurationSummaryMsg(productArea, scope, AreaRole.OWNER);
      // Viewer
      const viewerConfigSummaryMsg = getConfigurationSummaryMsg(productArea, scope, AreaRole.VIEWER);
      const productContext = productArea.toLowerCase();
      const scopeContext = scope.toLowerCase();
      if (
        syntheticRbacLimitedEnabled &&
        productArea === ProductArea.SYNTHETICS &&
        scope === ScopedPermissionItem.LIMITED_ACCESS
      ) {
        // Owner ff RBAC limited access
        expect(ownerConfigSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level_tp')
        );
        expect(ownerConfigSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_owner')
        );

        // Viewer ff RBAC limited access
        expect(viewerConfigSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level_tp')
        );
        expect(viewerConfigSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_viewer')
        );
      } else {
        // Owner default limited access
        expect(ownerConfigSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
        );
        expect(ownerConfigSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_owner')
        );

        // Viewer default limited access
        expect(viewerConfigSummaryMsg.accessLevelMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.' + scopeContext + '.access_level')
        );
        expect(viewerConfigSummaryMsg.rolePermissionMessage).toEqual(
          t('in-settings:configurationSummary.' + productContext + '.role_permissions_viewer')
        );
      }
    });
  });
});
