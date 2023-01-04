/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  getAreaRoleFromPermissionSet,
  updatePermissionSetByProductAreaAndRole,
  updatePermissionSetForLimitableProductArea
} from './form';
import {
  AreaRole,
  LimitedScopeByProductArea,
  ProductArea,
  ProductAreaPermissionMap,
  ScopedPermissionItem
} from './constants';

describe('in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form', () => {
  describe('getAreaRoleFromPermissionSet', () => {
    it('returns owner role when all area and functional permissions are given', () => {
      // Given
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      const permissionUnion = [...areaPermissions, ...capabilities];
      const permissionSet = { permissions: permissionUnion };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionSet);

      // Then
      expect(role).toEqual('OWNER');
    });

    it('returns viewer role when all area permissions but no functional permissions is given', () => {
      // Given
      const { areaPermissions } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      const permissions = [...areaPermissions];
      const permissionSet = { permissions };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionSet);

      // Then
      expect(role).toEqual('VIEWER');
    });

    it('returns viewer role when all area permissions but no functional permissions is given', () => {
      // Given
      const { areaPermissions } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      const permissions = [...areaPermissions];
      const permissionSet = { permissions };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionSet);

      // Then
      expect(role).toEqual('VIEWER');
    });

    it('returns undefined role when no area and no functional permissions are given', () => {
      // Given
      const permissionSet = { permissions: [] };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.WEBSITE, permissionSet);

      // Then
      expect(role).toBeUndefined();
    });
  });

  describe('updatePermissionSetByProductAreaAndRole', () => {
    it('returns permissionSet which inlcudes all area and all functional permissions for website area when owner role is provided', () => {
      // Given
      const role = 'OWNER';
      const permissionSet = { permissions: [] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);

      // Then
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      expect(updatedPermissionSet.permissions).toMatchObject([...areaPermissions, ...capabilities]);
    });

    it('returns permissionSet which inlcudes all area but no functional permissions for website area when viewer role is provided', () => {
      // Given
      const role = 'VIEWER';
      const permissionSet = { permissions: [] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);

      // Then
      const { areaPermissions } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      expect(updatedPermissionSet.permissions).toMatchObject(areaPermissions);
    });

    it('returns permissionSet with empty permissions when undefined role is provided', () => {
      // Given
      const role = undefined;
      const permissionSet = { permissions: [] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);

      // Then
      expect(updatedPermissionSet.permissions).toMatchObject([]);
    });

    it('returns permissionSet with only viewer permissions when role is set from owner to viewer', () => {
      // Given
      const role = 'VIEWER';
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[ProductArea.WEBSITE];
      const ownerPermissions = [...areaPermissions, ...capabilities];
      const permissionSet = { permissions: ownerPermissions };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);

      // Then

      expect(updatedPermissionSet.permissions).toMatchObject(areaPermissions);
    });

    it.each(['OWNER', 'VIEWER', 'UNDEFINED'])(
      'returns permissionSet and preserves existing permissions when %s role is provided',
      role => {
        // Given
        const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
        const productArea = ProductArea.WEBSITE;

        // When
        const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);

        // Then
        expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
        expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
      }
    );
  });
  describe('updatePermissionSetForLimitableProductArea', () => {
    it.each(['OWNER', 'VIEWER', 'UNDEFINED'])(
      'returns permissionSet with NO_ACCESS for websites and preserves existing permissions when %s role is provided',
      role => {
        // Given
        const scope = ScopedPermissionItem.NO_ACCESS;
        const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
        const productArea = ProductArea.WEBSITE;

        // When
        const updatedPermissionSet = updatePermissionSetForLimitableProductArea(
          permissionSet,
          productArea,
          scope,
          role
        );
        const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
        const limitedScope = LimitedScopeByProductArea[productArea];

        // Then
        expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
        expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
        expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(areaPermissions));
        expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
        expect(updatedPermissionSet.permissions).not.toContain(limitedScope);
      }
    );

    it('returns permissionSet with ACCESS_ALL permissions for websites and preserves existing permissions when OWNER role is provided', () => {
      // Given
      const scope = ScopedPermissionItem.ACCESS_ALL;
      const role = AreaRole.OWNER;
      const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
      const limitedScope = LimitedScopeByProductArea[productArea];

      // Then
      expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(areaPermissions));
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(capabilities));
      expect(updatedPermissionSet.permissions).not.toContain(limitedScope);
    });

    it('returns permissionSet with ACCESS_ALL permissions for websites and preserves existing permissions when VIEWER role is provided', () => {
      // Given
      const scope = ScopedPermissionItem.ACCESS_ALL;
      const role = AreaRole.VIEWER;
      const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
      const limitedScope = LimitedScopeByProductArea[productArea];

      // Then
      expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(areaPermissions));
      expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
      expect(updatedPermissionSet.permissions).not.toContain(limitedScope);
    });

    it('returns permissionSet with LIMITED_ACCESS permissions for websites and preserves existing permissions when OWNER role is provided', () => {
      // Given
      const scope = ScopedPermissionItem.LIMITED_ACCESS;
      const role = AreaRole.OWNER;
      const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
      const limitedScope = LimitedScopeByProductArea[productArea];

      // Then
      expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain(limitedScope);
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(areaPermissions));
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(capabilities));
    });

    it('returns permissionSet with LIMITED_ACCESS permissions for websites and preserves existing permissions when VIEWER role is provided', () => {
      // Given
      const scope = ScopedPermissionItem.LIMITED_ACCESS;
      const role = AreaRole.VIEWER;
      const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };
      const productArea = ProductArea.WEBSITE;

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);
      const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
      const limitedScope = LimitedScopeByProductArea[productArea];

      // Then
      expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain(limitedScope);
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(areaPermissions));
      expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
    });
  });
});
