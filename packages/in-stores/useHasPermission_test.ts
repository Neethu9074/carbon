/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import useHasPermission, { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { noop } from 'in-services/fixedObjects';
import { DEFAULT_ROLE } from 'in-stores/user';
import { Role } from 'in-types';

jest.mock('in-stores/useCurrentUserRole');

describe('in-stores/useHasPermission', () => {
  describe('with strategy set to REQUIRE_ANY', () => {
    it('must return true if access is granted to a SINGLE required permission', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_TWO'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return true if access is granted to a SOME required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return false if NO access is granted to ANY of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = [];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if access is granted to ALL of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });
  describe('with strategy set to REQUIRE_ALL', () => {
    it('must return false if access is granted to a SINGLE required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_TWO'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if access is granted to a SOME required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if NO access is granted to ANY of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = [];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if access is granted to ALL of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const requiredPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const grantedPermissions: string[] = ['CAN_ACCESS_ONE', 'CAN_ACCESS_TWO', 'CAN_ACCESS_THREE'];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasPermission({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });
});
