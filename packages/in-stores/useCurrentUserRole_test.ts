/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { act, renderHook } from '@testing-library/react-hooks';

import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { DEFAULT_ROLE } from 'in-stores/constants';
import { role$ } from 'in-stores/user';
import { Role } from 'in-types';

describe('in-stores/useCurrentUserRole', () => {
  it('must return the default role if obserable is undefined', () => {
    // Given
    role$.emit(undefined);

    // When
    const { result } = renderHook(useCurrentUserRole);
    const [role] = result.current;

    // Then
    expect(role).toMatchObject(DEFAULT_ROLE);
  });

  it('must return the current role', () => {
    // Given
    const givenRole: Role = {
      ...DEFAULT_ROLE,
      name: 'Masters of the Universe'
    };
    role$.emit(givenRole);

    // When
    const { result } = renderHook(useCurrentUserRole);
    const [role] = result.current;

    // Then
    expect(role).toMatchObject(givenRole);
    expect(role.name).toEqual('Masters of the Universe');
  });

  it('must return the updated role when observable emits a new value', () => {
    // Given
    const givenRole: Role = {
      ...DEFAULT_ROLE,
      name: 'Masters of the Universe'
    };
    const newRole: Role = {
      ...DEFAULT_ROLE,
      name: 'Masters of Puppets'
    };
    role$.emit(givenRole);

    // When
    const { result } = renderHook(useCurrentUserRole);
    act(() => {
      role$.emit(newRole);
    });
    const [role] = result.current;

    // Then
    expect(role).toMatchObject(newRole);
    expect(role.name).toEqual('Masters of Puppets');
  });

  it('must return the updated role when it got updated by calling the updater function', () => {
    // Given
    const givenRole: Role = {
      ...DEFAULT_ROLE,
      name: 'Ministry of Magic'
    };
    const newRole: Role = {
      ...DEFAULT_ROLE,
      name: 'The Fellowship of the Ring'
    };
    role$.emit(givenRole);

    // When
    const { result } = renderHook(useCurrentUserRole);
    const [, updateRole] = result.current;
    act(() => updateRole(newRole));
    const [role] = result.current;

    // Then
    expect(role).toMatchObject(newRole);
    expect(role.name).toEqual('The Fellowship of the Ring');
  });
});
