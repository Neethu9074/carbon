/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result } from '@instana/types';

import { Response } from 'in-services/http/http';
import { t } from 'in-i18n';

interface TranslateStaticRoleProps<T extends Object, KEY extends keyof T> {
  role: T;
  nameKey: KEY;
}

export function translateStaticRoleName<T extends Object, KEY extends keyof T>({
  role,
  nameKey
}: TranslateStaticRoleProps<T, KEY>): T {
  const name = role[nameKey];
  return {
    ...role,
    [nameKey]: t('in-settings:general.staticRole', { context: name })
  } as T;
}

export interface PartialRole {
  name: string;
}

export function translateStaticRoles<T extends PartialRole>(roles: Array<T>): Array<T> {
  return roles.map<T>(role => translateStaticRoleName({ role, nameKey: 'name' }));
}

interface TranslateStaticRolesByNameKeyProps<T extends Object, KEY extends keyof T> {
  roles: Array<T>;
  nameKey: KEY;
}

export function translateStaticRolesByNameKey<T extends Object, KEY extends keyof T>({
  roles,
  nameKey
}: TranslateStaticRolesByNameKeyProps<T, KEY>): Array<T> {
  return roles.map<T>(role => translateStaticRoleName({ role, nameKey }));
}

export function translateRoleResult<ROLE_TYPE extends PartialRole, T extends Result<ROLE_TYPE>>(result: T): T {
  if (!result.data) return result;

  return {
    ...result,
    data: translateStaticRoleName({ role: result.data, nameKey: 'name' })
  };
}

export function translateRolesResult<ROLES_TYPE extends PartialRole[], T extends Result<ROLES_TYPE>>(result: T): T {
  if (!result.data) return result;

  return {
    ...result,
    data: translateStaticRoles(result.data)
  };
}

export function translateRolesResponse<ROLES_TYPE extends PartialRole[], T extends Response<ROLES_TYPE>>(
  response: T
): T {
  if (!response.body) return response;

  return {
    ...response,
    body: translateStaticRoles(response.body)
  };
}
