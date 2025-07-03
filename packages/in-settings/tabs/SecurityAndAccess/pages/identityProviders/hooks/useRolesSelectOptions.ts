/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';
import { RoleOverview } from '@instana/types';

import { getRolesOverview } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface RoleOption {
  id: string;
  name: string;
}
interface RolesSelectOptionsResult {
  roleOptions: RoleOption[];
  selectedRole: RoleOption;
  rolesLoading: boolean;
  rolesError: boolean;
}

export function useRolesSelectOptions(selectedId?: string): RolesSelectOptionsResult {
  const defaultOption = { id: '', name: t('in-settings:components.select') };

  const result = useObservable(getRolesOverview(), []) ?? pendingResult;
  const rolesLoading = isLoading(result);
  const rolesError = hasError(result);
  const roles: RoleOption[] =
    result?.data?.map((role: RoleOverview) => {
      return { id: role.id, name: role.name };
    }) ?? [];
  const sorted = roles.sort((a, b) => a.name.localeCompare(b.name));

  const roleOptions = [defaultOption, ...sorted];
  const selectedRole = roleOptions.find(role => role.id === selectedId) ?? defaultOption;

  return {
    roleOptions,
    selectedRole,
    rolesLoading,
    rolesError
  };
}
