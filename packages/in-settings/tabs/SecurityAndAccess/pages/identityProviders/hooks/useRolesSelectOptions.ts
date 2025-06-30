/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import { getRolesOverview } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export function useRolesSelectOptions(selectedId?: string) {
  const defaultOption = { id: '', name: t('in-settings:components.select') };

  const result = useObservable(getRolesOverview(), []) ?? pendingResult;
  const rolesLoading = isLoading(result);
  const rolesError = hasError(result);
  const roleOptions = [defaultOption, ...(result?.data ?? [])];
  const selectedRole = roleOptions.find(role => role.id === selectedId) ?? defaultOption;

  return {
    roleOptions,
    selectedRole,
    rolesLoading,
    rolesError
  };
}
