/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import { PERMISSION_STRATEGY } from 'in-stores/useHasPermission';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { PermissionTuple } from 'in-stores/permission';
import useHasAccesses from 'in-stores/useHasAccesses';
import { noop } from 'in-services/fixedObjects';
import { DEFAULT_ROLE } from 'in-stores/user';
import { Role } from 'in-types';

jest.mock('in-stores/useCurrentUserRole');

describe('in-stores/useHasAccesses', () => {
  describe('with strategy set to REQUIRE_ANY', () => {
    it('must return true if access is granted to a SINGLE required permission', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'ACCESS_WEBSITES',
        'LIMITED_APPLICATIONS_SCOPE',
        'LIMITED_MOBILE_APPS_SCOPE'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return true if access is granted to a SOME required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'LIMITED_APPLICATIONS_SCOPE',
        'ACCESS_APPLICATIONS',
        'LIMTIED_THREE',
        'ACCESS_MOBILE_APPS'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return false if NO access is granted to ANY of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'LIMITED_APPLICATIONS_SCOPE',
        'LIMITED_MOBILE_APPS_SCOPE'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if access is granted to ALL of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ANY;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'ACCESS_WEBSITES',
        'LIMITED_APPLICATIONS_SCOPE',
        'ACCESS_APPLICATIONS',
        'LIMTIED_THREE',
        'ACCESS_MOBILE_APPS'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });
  describe('with strategy set to REQUIRE_ALL', () => {
    it('must return false if access is granted to a SINGLE required permission', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'ACCESS_WEBSITES',
        'LIMITED_APPLICATIONS_SCOPE',
        'LIMITED_MOBILE_APPS_SCOPE'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if access is granted to a SOME required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'LIMITED_APPLICATIONS_SCOPE',
        'ACCESS_APPLICATIONS',
        'LIMITED_MOBILE_APPS_SCOPE',
        'ACCESS_MOBILE_APPS'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if NO access is granted to ANY of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'LIMITED_APPLICATIONS_SCOPE',
        'LIMITED_MOBILE_APPS_SCOPE'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if access is granted to ALL of the required permissions', () => {
      // Given
      const strategy = PERMISSION_STRATEGY.REQUIRE_ALL;
      const websitesPermissions: PermissionTuple = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const applicationsPermissions: PermissionTuple = ['LIMITED_APPLICATIONS_SCOPE', 'ACCESS_APPLICATIONS'];
      const mobileAppsPermissions: PermissionTuple = ['LIMITED_MOBILE_APPS_SCOPE', 'ACCESS_MOBILE_APPS'];
      const requiredPermissions = [websitesPermissions, applicationsPermissions, mobileAppsPermissions];
      const grantedPermissions: string[] = [
        'LIMITED_WEBSITES_SCOPE',
        'ACCESS_WEBSITES',
        'LIMITED_APPLICATIONS_SCOPE',
        'ACCESS_APPLICATIONS',
        'LIMITED_MOBILE_APPS_SCOPE',
        'ACCESS_MOBILE_APPS'
      ];
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() => useHasAccesses({ requiredPermissions, strategy }));

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });
});
