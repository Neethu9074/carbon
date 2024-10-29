/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  getScopeFromProductArea,
  getAreaRoleFromPermissionSet,
  updatePermissionSetForLimitableProductArea
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import {
  AreaRole,
  ProductArea,
  ProductAreaPermissionMap,
  ScopedPermissionItem
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form', () => {
  describe('getAreaRoleFromPermissionSet', () => {
    it('returns owner role when all functional permissions are given', () => {
      // Given
      const { capabilities } = ProductAreaPermissionMap[ProductArea.SYNTHETICS];
      const permissionSet = { permissions: [...capabilities] };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.SYNTHETICS, permissionSet);

      // Then
      expect(role).toEqual('OWNER');
    });

    it('returns custom role when only some functional permissions are given', () => {
      // Given
      const {
        capabilities: [firstCapability]
      } = ProductAreaPermissionMap[ProductArea.SYNTHETICS];
      const permissionSet = { permissions: [firstCapability] };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.SYNTHETICS, permissionSet);

      // Then
      expect(role).toEqual('CUSTOM');
    });

    it('returns viewer role when no functional permissions is given', () => {
      // Given
      const permissionSet = { permissions: [] };

      // When
      const role = getAreaRoleFromPermissionSet(ProductArea.SYNTHETICS, permissionSet);

      // Then
      expect(role).toEqual('VIEWER');
    });
  });

  describe('getScopeFromProductArea', () => {
    it('returns access all when scope is not limited', () => {
      // Given
      const permissionSet = { permissions: [] };

      // When
      const role = getScopeFromProductArea(ProductArea.APPLICATION, permissionSet);

      // Then
      expect(role).toEqual('ACCESS_ALL');
    });

    it('returns limited scope when scope is limited and access to scope is given', () => {
      // Given
      const { limitation, permission } = ProductAreaPermissionMap[ProductArea.APPLICATION];
      expect(limitation).toBeDefined();
      expect(permission).toBeDefined();
      const unionPermissions = [];
      if (limitation) unionPermissions.push(limitation);
      if (permission) unionPermissions.push(permission);
      const permissionSet = { permissions: unionPermissions };

      // When
      const role = getScopeFromProductArea(ProductArea.APPLICATION, permissionSet);

      // Then
      expect(role).toEqual('LIMITED_ACCESS');
    });

    it('returns no access when scope is limited and no access is given', () => {
      // Given
      const { limitation, permission } = ProductAreaPermissionMap[ProductArea.APPLICATION];
      expect(limitation).toBeDefined();
      expect(permission).toBeDefined();
      const unionPermissions = [];
      if (limitation) unionPermissions.push(limitation);
      const permissionSet = { permissions: unionPermissions };

      // When
      const role = getScopeFromProductArea(ProductArea.APPLICATION, permissionSet);

      // Then
      expect(role).toEqual('NO_ACCESS');
    });
  });

  describe('updatePermissionSetForLimitableProductArea', () => {
    it('update access scope limitation and remove existing capabilites when no access is given', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
      const scope = ScopedPermissionItem.NO_ACCESS;
      const permissionSet = { permissions: [...capabilities] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(
        permissionSet,
        productArea,
        scope,
        undefined
      );

      // Then
      expect(updatedPermissionSet.permissions).toContain(limitation);
      expect(updatedPermissionSet.permissions).not.toContain(permission);
      expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
    });

    it('update access scope limitation and capabilites when limited access as owner is given', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
      const scope = ScopedPermissionItem.LIMITED_ACCESS;
      const role = AreaRole.OWNER;
      const permissionSet = { permissions: [] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);

      // Then
      expect(updatedPermissionSet.permissions).toContain(limitation);
      expect(updatedPermissionSet.permissions).toContain(permission);
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(capabilities));
    });

    it('update access scope limitation and capabilites when limited access as viewer is given', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
      const scope = ScopedPermissionItem.LIMITED_ACCESS;
      const role = AreaRole.VIEWER;
      const permissionSet = { permissions: [...capabilities] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);

      // Then
      expect(updatedPermissionSet.permissions).toContain(limitation);
      expect(updatedPermissionSet.permissions).toContain(permission);
      expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
    });

    it('update access scope limitation and capabilites when access all as owner is given', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
      const scope = ScopedPermissionItem.ACCESS_ALL;
      const role = AreaRole.OWNER;
      const permissionSet = { permissions: [] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);

      // Then
      expect(updatedPermissionSet.permissions).not.toContain(limitation);
      expect(updatedPermissionSet.permissions).not.toContain(permission);
      expect(updatedPermissionSet.permissions).toEqual(expect.arrayContaining(capabilities));
    });

    it('update access scope limitation and capabilites when access all as viewer is given', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
      const scope = ScopedPermissionItem.ACCESS_ALL;
      const role = AreaRole.VIEWER;
      const permissionSet = { permissions: [...capabilities] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(permissionSet, productArea, scope, role);

      // Then
      expect(updatedPermissionSet.permissions).not.toContain(limitation);
      expect(updatedPermissionSet.permissions).not.toContain(permission);
      expect(updatedPermissionSet.permissions).not.toEqual(expect.arrayContaining(capabilities));
    });

    it('preserves existing permissions', () => {
      // Given
      const productArea = ProductArea.APPLICATION;
      const scope = ScopedPermissionItem.NO_ACCESS;
      const permissionSet = { permissions: ['SOME_EXISTING_PERMISSION', 'ANOTHER_EXISTING_PERMISSION'] };

      // When
      const updatedPermissionSet = updatePermissionSetForLimitableProductArea(
        permissionSet,
        productArea,
        scope,
        undefined
      );

      // Then
      expect(updatedPermissionSet.permissions).toContain('SOME_EXISTING_PERMISSION');
      expect(updatedPermissionSet.permissions).toContain('ANOTHER_EXISTING_PERMISSION');
    });
  });
});
