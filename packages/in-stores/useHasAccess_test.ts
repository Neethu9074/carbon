/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { renderHook } from '@testing-library/react-hooks';

import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { DEFAULT_ROLE } from 'in-stores/constants';
import useHasAccess from 'in-stores/useHasAccess';
import { noop } from 'in-services/fixedObjects';
import { Role } from 'in-types';

jest.mock('in-stores/useCurrentUserRole');

describe('in-stores/useHasAccess', () => {
  describe('without optional feature-flag', () => {
    it('must return true if role has limited scope and permission to access it', () => {
      // Given
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({ requiredPermissions: [limitedScope, requiredAccessPermission] })
      );

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return false if role has limited scope and NO permission to access it', () => {
      // Given
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({ requiredPermissions: [limitedScope, requiredAccessPermission] })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if role has NO limiting permission defined that matches the limited scope', () => {
      // Given
      const grantedPermissions: string[] = ['ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({ requiredPermissions: [limitedScope, requiredAccessPermission] })
      );

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });

  describe('with optional feature-flag set to true', () => {
    it('must return true if role has limited scope and permission to access it', () => {
      // Given
      const featureFlag = true;
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return false if role has limited scope and NO permission to access it', () => {
      // Given
      const featureFlag = true;
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return true if role has NO limited scope but access permission', () => {
      // Given
      const featureFlag = true;
      const grantedPermissions: string[] = ['ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(true);
    });

    it('must return true if role has NO limiting permission defined that matches the limited scope', () => {
      // Given
      const featureFlag = true;
      const grantedPermissions: string[] = [];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(true);
    });
  });

  describe('with optional feature-flag set to false', () => {
    it('must return false if role has limited scope and permission to access it', () => {
      // Given
      const featureFlag = false;
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE', 'ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if role has limited scope and NO permission to access it', () => {
      // Given
      const featureFlag = false;
      const grantedPermissions: string[] = ['LIMITED_WEBSITES_SCOPE'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if role has NO limited scope but access permission', () => {
      // Given
      const featureFlag = false;
      const grantedPermissions: string[] = ['ACCESS_WEBSITES'];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });

    it('must return false if role has NO limiting permission defined that matches the limited scope', () => {
      // Given
      const featureFlag = false;
      const grantedPermissions: string[] = [];
      const limitedScope = 'LIMITED_WEBSITES_SCOPE';
      const requiredAccessPermission = 'ACCESS_WEBSITES';
      const givenRole: Role = { ...DEFAULT_ROLE, permissions: grantedPermissions };
      (useCurrentUserRole as jest.Mock).mockReturnValueOnce([givenRole, noop]);

      // When
      const { result } = renderHook(() =>
        useHasAccess({
          optionalFeatureFlag: featureFlag,
          requiredPermissions: [limitedScope, requiredAccessPermission]
        })
      );

      // Then
      expect(result.current).toStrictEqual(false);
    });
  });
});
