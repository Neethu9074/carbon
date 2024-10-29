/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mockEmptyPermissionsSet,
  mockPermissionsSetWithData,
  mockPermissionsSetWithFullAccessData,
  mockPermissionSetApplicationAccessAllContributor,
  mockPermissionSetApplicationAccessAllOwner,
  mockPermissionSetApplicationLimitedAccessContributor,
  mockPermissionSetApplicationLimitedAccessOwner
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/testData';
import { getAreaData } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData';
import { ProductArea } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { LimitedAccessScope } from 'in-stores/permission';
import { t } from 'in-i18n';

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/utils/getAreaData', () => {
  describe('returns correct data and calls the translation function with correct params for websites product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.WEBSITE,
          permissionsSet: { ...mockEmptyPermissionsSet, permissions: [LimitedAccessScope.LIMITED_WEBSITES_SCOPE] }
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(isDisabled).toBe(true);
      expect(areaColumnHeadline).toEqual(t('in-settings:productAreas.no_access'));
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.WEBSITE,
          permissionsSet: mockPermissionsSetWithData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['11', '12']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: 2
        })
      );
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.WEBSITE,
          permissionsSet: mockPermissionsSetWithFullAccessData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['11', '12']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: t('in-settings:general.all')
        })
      );
    });
  });

  describe('returns correct data and calls the translation function with correct params for mobile apps product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.MOBILE_APP,
          permissionsSet: { ...mockEmptyPermissionsSet, permissions: [LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE] }
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(isDisabled).toBe(true);
      expect(areaColumnHeadline).toEqual(t('in-settings:productAreas.no_access'));
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.MOBILE_APP,
          permissionsSet: mockPermissionsSetWithData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['7', '8']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: 2
        })
      );
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.MOBILE_APP,
          permissionsSet: mockPermissionsSetWithFullAccessData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['7', '8']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: t('in-settings:general.all')
        })
      );
    });
  });

  describe('returns correct data and calls the translation function with correct params for applications product area', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns correct data and calls the translation function with correct params with an empty permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.APPLICATION,
          permissionsSet: { ...mockEmptyPermissionsSet, permissions: [LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE] }
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual([]);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(false);
      expect(isDisabled).toBe(true);
      expect(areaColumnHeadline).toEqual(t('in-settings:productAreas.no_access'));
    });

    it('returns correct data and calls the translation function with correct params with a limited permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.APPLICATION,
          permissionsSet: mockPermissionsSetWithData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['1', '2']);
      expect(hasFullAreaAccess).toBe(false);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: 2
        })
      );
    });

    it('returns correct data and calls the translation function with correct params with a full access permissions set', () => {
      // Given
      const { areaColumnHeadline, areaItemIdsWithAccess, hasFullAreaAccess, shouldRenderContent, isDisabled } =
        getAreaData({
          area: ProductArea.APPLICATION,
          permissionsSet: mockPermissionsSetWithFullAccessData
        });

      // Then
      expect(areaItemIdsWithAccess).toStrictEqual(['1', '2']);
      expect(hasFullAreaAccess).toBe(true);
      expect(shouldRenderContent).toBe(true);
      expect(isDisabled).toBe(false);
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions', {
          context: 'owner',
          quantityOfAreas: t('in-settings:general.all')
        })
      );
    });

    it('returns correct data with access all permissions set with contributor role and applications with contributor access', () => {
      // Given
      const {
        areaAccessHeadline,
        areaColumnHeadline,
        areaItemIdsWithAccess,
        contributorAccessItemIds,
        contributorAccessHeadline,
        hasFullAreaAccess
      } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionSetApplicationAccessAllContributor
      });

      // Then
      expect(hasFullAreaAccess).toBe(true); // Check access all
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions_contributor_and_viewer', {
          quantityOfAreas: t('in-settings:general.all'),
          quantityOfAreasContributor: 2
        })
      );
      expect(areaAccessHeadline).toEqual(t('in-settings:permissionScope.selection_viewer_access'));
      expect(areaItemIdsWithAccess).toStrictEqual(['1']);
      expect(contributorAccessHeadline).toEqual(t('in-settings:permissionScope.selection_contributor_access'));
      expect(contributorAccessItemIds).toStrictEqual(['2', '3']);
    });

    it('returns correct data with limited access permissions set with contributor role and applications with contributor access', () => {
      // Given
      const {
        areaAccessHeadline,
        areaColumnHeadline,
        areaItemIdsWithAccess,
        contributorAccessItemIds,
        contributorAccessHeadline,
        hasFullAreaAccess
      } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionSetApplicationLimitedAccessContributor
      });

      // Then
      expect(hasFullAreaAccess).toBe(false); // Check limited access
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions_contributor_and_viewer', {
          quantityOfAreas: 1,
          quantityOfAreasContributor: 2
        })
      );
      expect(areaAccessHeadline).toEqual(t('in-settings:permissionScope.selection_viewer_access'));
      expect(areaItemIdsWithAccess).toStrictEqual(['1']);
      expect(contributorAccessHeadline).toEqual(t('in-settings:permissionScope.selection_contributor_access'));
      expect(contributorAccessItemIds).toStrictEqual(['2', '3']);
    });

    it('returns correct data with limited access permissions set with owner and contributor role merged and applications with contributor access', () => {
      // Given
      const {
        areaAccessHeadline,
        areaColumnHeadline,
        areaItemIdsWithAccess,
        contributorAccessItemIds,
        contributorAccessHeadline,
        hasFullAreaAccess
      } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionSetApplicationLimitedAccessOwner
      });

      // Then
      expect(hasFullAreaAccess).toBe(false); // Check limited access
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions_contributor_and_owner', {
          quantityOfAreas: 1,
          quantityOfAreasContributor: 2
        })
      );
      expect(areaAccessHeadline).toEqual(t('in-settings:permissionScope.selection_owner_access'));
      expect(areaItemIdsWithAccess).toStrictEqual(['1']);
      expect(contributorAccessHeadline).toEqual(t('in-settings:permissionScope.selection_contributor_access'));
      expect(contributorAccessItemIds).toStrictEqual(['2', '3']);
    });

    it('returns correct data with access all permissions set with owner and contributor role merged and applications with contributor access', () => {
      // Given
      const {
        areaAccessHeadline,
        areaColumnHeadline,
        areaItemIdsWithAccess,
        contributorAccessItemIds,
        contributorAccessHeadline,
        hasFullAreaAccess
      } = getAreaData({
        area: ProductArea.APPLICATION,
        permissionsSet: mockPermissionSetApplicationAccessAllOwner
      });

      // Then
      expect(hasFullAreaAccess).toBe(true); // Check access all
      expect(areaColumnHeadline).toEqual(
        t('in-settings:productAreas.role_permissions_contributor_and_owner', {
          quantityOfAreas: t('in-settings:general.all'),
          quantityOfAreasContributor: 2
        })
      );
      expect(areaAccessHeadline).toEqual(t('in-settings:permissionScope.selection_owner_access'));
      expect(areaItemIdsWithAccess).toStrictEqual(['1']);
      expect(contributorAccessHeadline).toEqual(t('in-settings:permissionScope.selection_contributor_access'));
      expect(contributorAccessItemIds).toStrictEqual(['2', '3']);
    });
  });
});
