/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getKubernetesData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getPlatformData';
import { ScopedPermissionItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));
jest.mock('in-services/featureFlags', () => ({
  vsphereEnabled: true
}));

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData', () => {
  describe('returns correct data and calls the translation function with correct params for websites product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      jest.doMock('in-i18n', () => ({ t: () => new Date().toISOString() }));
      // Given
      const groupConfig = getKubernetesData(mockEmptyPermissionsSet);

      // Then
      expect(groupConfig.countOfKubernetesItemsWithAccess).toBe(0);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual([]);
      expect(groupConfig.kubernetesAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.pcfAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.openStackAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.phmcAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.powervcAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.zhmcAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.sapAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.vSphereAccess).toBe(ScopedPermissionItem.ACCESS_ALL);
      expect(groupConfig.translations).toHaveLength(9);
      expect(groupConfig.translations).toContain(undefined);
      expect(t).toHaveBeenCalledTimes(11);
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set and a feature flag for one of other platforms enabled', () => {
      // Given
      const groupConfig = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(groupConfig.countOfKubernetesItemsWithAccess).toBe(4);
      expect(groupConfig.hasOtherPlatformsAccess).toBe(true);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      expect(groupConfig.kubernetesAccess).toBe(ScopedPermissionItem.LIMITED_ACCESS);
      expect(groupConfig.pcfAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.openStackAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.phmcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.powervcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.zhmcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.sapAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.vSphereAccess).toBe(ScopedPermissionItem.LIMITED_ACCESS);
      // 2 undefined for kubernetes and vsphere
      expect(groupConfig.translations).toHaveLength(3);
      expect(t).toHaveBeenCalledTimes(4);
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set and a feature flag for one of other platforms disabled', async () => {
      jest.resetModules();
      jest.doMock('in-services/featureFlags', () => ({
        vsphereEnabled: false
      }));
      jest.doMock('in-i18n', () => ({
        t: jest.fn()
      }));

      const { getKubernetesData } = await import(
        'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getPlatformData'
      );
      // Given
      const groupConfig = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(groupConfig.countOfKubernetesItemsWithAccess).toBe(4);
      expect(groupConfig.hasOtherPlatformsAccess).toBe(true);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      expect(groupConfig.kubernetesAccess).toBe(ScopedPermissionItem.LIMITED_ACCESS);
      expect(groupConfig.pcfAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.openStackAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.phmcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.powervcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.zhmcAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.sapAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.vSphereAccess).toBe(ScopedPermissionItem.NO_ACCESS);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      // 1 undefined for kubernetes
      expect(groupConfig.translations).toStrictEqual([undefined, undefined]);
    });
  });
});
