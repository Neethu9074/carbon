/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RoleOverview } from '@instana/types';

import {
  FilterableMultiSelectItemProps,
  AssignRoleDialogMapForm
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.types';

export interface AssignRolesProps {
  form: AssignRoleDialogMapForm;
  onSelectRoles: (index: number, selectedRoles: Array<FilterableMultiSelectItemProps>) => void;
  roles: Array<RoleOverview>;
  setForm: React.Dispatch<React.SetStateAction<AssignRoleDialogMapForm>>;
}
