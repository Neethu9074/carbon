/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  combinePermissions,
  containsAllPermissions,
  containsAnyPermission,
  filterPermissions,
  modifyPermissions,
  togglePermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.utils';
import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';

const TestCapability = Object.freeze({
  CAN_CONFIGURE_FOO: 'CAN_CONFIGURE_FOO',
  CAN_CONFIGURE_BAR: 'CAN_CONFIGURE_BAR',
  CAN_CREATE_FOO: 'CAN_CREATE_FOO',
  CAN_CREATE_BAR: 'CAN_CREATE_BAR',
  CAN_DELETE_FOO: 'CAN_DELETE_FOO',
  CAN_DELETE_BAR: 'CAN_DELETE_BAR'
} as const);

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog.utils', () => {
  describe('combinePermissions', () => {
    it('must return an array containing all permissions from the the passed permission-arrays', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const newPermissions = [
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = combinePermissions(current, newPermissions);

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ]);
    });
    it('must return an array that only contains distinct permissions when redundancies were provided', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const newPermissions = [
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = combinePermissions(current, newPermissions);

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ]);
    });
  });

  describe('filterPermissions', () => {
    it('must return an array that has certain permissions removed from the list of current permissions', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR,
        TestCapability.CAN_DELETE_FOO,
        TestCapability.CAN_DELETE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const permissionsToBeRemoved = [
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_DELETE_FOO,
        TestCapability.CAN_CONFIGURE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = filterPermissions(current, permissionsToBeRemoved);

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_BAR,
        TestCapability.CAN_DELETE_BAR
      ]);
    });
  });

  describe('containsAnyPermission', () => {
    it('must return true if at least one of the expected permissions was found within the array of current permissions', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const expectedPermissions = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_DELETE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const result = containsAnyPermission(current, expectedPermissions);

      // Then
      expect(result).toEqual(true);
    });
    it('must return false if none of the expected permissions was found within the array of current permissions', () => {
      // Given
      const current = [TestCapability.CAN_CONFIGURE_BAR] as unknown as Array<ProductAreaPermissionUnion>;
      const expectedPermissions = [TestCapability.CAN_CONFIGURE_FOO] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const result = containsAnyPermission(current, expectedPermissions);

      // Then
      expect(result).toEqual(false);
    });
  });

  describe('containsAllPermissions', () => {
    it('must return true if all of the expected permissions where found wihtin the array of current permissions.', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const expectedPermissions = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const result = containsAllPermissions(current, expectedPermissions);

      // Then
      expect(result).toEqual(true);
    });
    it('must return false if a single expected permission is missing the array of current permissions.', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_DELETE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const expectedPermissions = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const result = containsAllPermissions(current, expectedPermissions);

      // Then
      expect(result).toEqual(false);
    });
  });

  describe('modifyPermissions', () => {
    it('must return an array that includes all current and permissions to add.', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const permissionsToAdd = [
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = modifyPermissions(current, permissionsToAdd, []);

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ]);
    });
    it('must return an array that does NOT contain certain permissions anymore.', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const permissionsToRemove = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = modifyPermissions(current, [], permissionsToRemove);

      // Then
      expect(updatedPermissions).toMatchObject([TestCapability.CAN_CONFIGURE_BAR, TestCapability.CAN_CREATE_BAR]);
    });
    it('must return an array that does NOT contain certain permissions anymore and added some new permissions.', () => {
      // Given
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const permissionsToAdd = [
        TestCapability.CAN_DELETE_BAR,
        TestCapability.CAN_DELETE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const permissionsToRemove = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = modifyPermissions(current, permissionsToAdd, permissionsToRemove);

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_BAR,
        TestCapability.CAN_DELETE_BAR,
        TestCapability.CAN_DELETE_FOO
      ]);
    });
  });

  describe('togglePermissions', () => {
    it('must update the array of current permissions by adding some new permissions without removing any, in case the enabled flag is true', () => {
      // Given
      const enabled = true;
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const toAddOnEnabled = [
        TestCapability.CAN_DELETE_BAR,
        TestCapability.CAN_DELETE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const toRemoveOnDisabled = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = togglePermissions({
        current,
        toAddOnEnabled,
        toRemoveOnDisabled,
        enabled
      });

      // Then
      expect(updatedPermissions).toMatchObject([
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR,
        TestCapability.CAN_DELETE_BAR,
        TestCapability.CAN_DELETE_FOO
      ]);
    });
    it('must update the array of current permissions by removing certain permissions without adding any, in case the enabled flag is false', () => {
      // Given
      const enabled = false;
      const current = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CONFIGURE_BAR,
        TestCapability.CAN_CREATE_FOO,
        TestCapability.CAN_CREATE_BAR
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const toAddOnEnabled = [
        TestCapability.CAN_DELETE_BAR,
        TestCapability.CAN_DELETE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;
      const toRemoveOnDisabled = [
        TestCapability.CAN_CONFIGURE_FOO,
        TestCapability.CAN_CREATE_FOO
      ] as unknown as Array<ProductAreaPermissionUnion>;

      // When
      const updatedPermissions = togglePermissions({
        current,
        toAddOnEnabled,
        toRemoveOnDisabled,
        enabled
      });

      // Then
      expect(updatedPermissions).toMatchObject([TestCapability.CAN_CONFIGURE_BAR, TestCapability.CAN_CREATE_BAR]);
    });
  });
});
