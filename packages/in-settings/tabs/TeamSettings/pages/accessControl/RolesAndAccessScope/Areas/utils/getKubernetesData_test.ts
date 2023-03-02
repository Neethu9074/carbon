/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getKubernetesData } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/utils/getKubernetesData';
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
      // Given
      const {
        countOfKubernetesItemsWithAccess,
        hasKubernetesAccess,
        hasOtherPlatformsAccess,
        kubernetesNamespacesWithAccess,
        translations
      } = getKubernetesData(mockEmptyPermissionsSet);

      // Then
      expect(countOfKubernetesItemsWithAccess).toBe(0);
      expect(hasKubernetesAccess).toBe(false);
      expect(hasOtherPlatformsAccess).toBe(false);
      expect(kubernetesNamespacesWithAccess).toStrictEqual([]);
      expect(translations).toStrictEqual([]);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'viewer',
        quantityOfAreas: 0
      });
    });

    it('returns correct data and calls the translation function with correct params with a non-empty permissions set and a feature flag for one of other platforms enabled', () => {
      // Given
      const {
        countOfKubernetesItemsWithAccess,
        hasKubernetesAccess,
        hasOtherPlatformsAccess,
        kubernetesNamespacesWithAccess,
        translations
      } = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(countOfKubernetesItemsWithAccess).toBe(4);
      expect(hasKubernetesAccess).toBe(true);
      expect(hasOtherPlatformsAccess).toBe(true);
      expect(kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      // 2 undefined for kubernetes and vsphere
      expect(translations).toStrictEqual([undefined, undefined]);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'viewer',
        quantityOfAreas: 4
      });
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
      const { t } = await import('in-i18n');

      // Given
      const {
        countOfKubernetesItemsWithAccess,
        hasKubernetesAccess,
        hasOtherPlatformsAccess,
        kubernetesNamespacesWithAccess,
        translations
      } = getKubernetesData(mockPermissionsSetWithData);

      // Then
      expect(countOfKubernetesItemsWithAccess).toBe(4);
      expect(hasKubernetesAccess).toBe(true);
      expect(hasOtherPlatformsAccess).toBe(false);
      expect(kubernetesNamespacesWithAccess).toStrictEqual(['5', '6']);
      // 1 undefined for kubernetes
      expect(translations).toStrictEqual([undefined]);
      expect(t).toHaveBeenCalledWith('in-settings:productAreas.permissions', {
        context: 'viewer',
        quantityOfAreas: 4
      });
    });
  });
});
