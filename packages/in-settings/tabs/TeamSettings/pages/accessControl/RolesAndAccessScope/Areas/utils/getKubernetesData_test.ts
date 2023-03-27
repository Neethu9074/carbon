/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import {
  AccessKind,
  getKubernetesData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
import { t } from 'in-i18n';

jest.mock('in-i18n', () => ({ t: jest.fn() }));
jest.mock('in-services/featureFlags', () => ({
  vsphereEnabled: true
}));

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData', () => {
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
      expect(groupConfig.kubernetesAccess).toBe(AccessKind.All);
      expect(groupConfig.pcfAccess).toBe(AccessKind.All);
      expect(groupConfig.openStackAccess).toBe(AccessKind.All);
      expect(groupConfig.phmcAccess).toBe(AccessKind.All);
      expect(groupConfig.zhmcAccess).toBe(AccessKind.All);
      expect(groupConfig.sapAccess).toBe(AccessKind.All);
      expect(groupConfig.vSphereAccess).toBe(AccessKind.All);
      expect(groupConfig.translations).toHaveLength(7);
      expect(groupConfig.translations).toContain(undefined);
      expect(t).toHaveBeenCalledTimes(9);
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set and a feature flag for one of other platforms enabled', () => {
      // Given
      const groupConfig = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(groupConfig.countOfKubernetesItemsWithAccess).toBe(4);
      expect(groupConfig.hasOtherPlatformsAccess).toBe(true);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      expect(groupConfig.kubernetesAccess).toBe(AccessKind.Limited);
      expect(groupConfig.pcfAccess).toBe(AccessKind.None);
      expect(groupConfig.openStackAccess).toBe(AccessKind.None);
      expect(groupConfig.phmcAccess).toBe(AccessKind.None);
      expect(groupConfig.zhmcAccess).toBe(AccessKind.None);
      expect(groupConfig.sapAccess).toBe(AccessKind.None);
      expect(groupConfig.vSphereAccess).toBe(AccessKind.Limited);
      // 2 undefined for kubernetes and vsphere
      expect(groupConfig.translations).toHaveLength(2);
      expect(t).toHaveBeenCalledTimes(3);
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
        'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData'
      );
      // Given
      const groupConfig = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(groupConfig.countOfKubernetesItemsWithAccess).toBe(4);
      expect(groupConfig.hasOtherPlatformsAccess).toBe(false);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      expect(groupConfig.kubernetesAccess).toBe(AccessKind.Limited);
      expect(groupConfig.pcfAccess).toBe(AccessKind.None);
      expect(groupConfig.openStackAccess).toBe(AccessKind.None);
      expect(groupConfig.phmcAccess).toBe(AccessKind.None);
      expect(groupConfig.zhmcAccess).toBe(AccessKind.None);
      expect(groupConfig.sapAccess).toBe(AccessKind.None);
      expect(groupConfig.vSphereAccess).toBe(AccessKind.None);
      expect(groupConfig.kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      // 1 undefined for kubernetes
      expect(groupConfig.translations).toStrictEqual([undefined]);
    });
  });
});
