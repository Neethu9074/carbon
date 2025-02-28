/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  FilterableMultiSelectItemProps,
  AssignRoleDialogMapForm
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/details/AssignRoleDialog.types';
import { Role } from 'in-settings/tabs/SecurityAndAccess/api/rolesMocks';

export interface AssignRolesProps {
  form: AssignRoleDialogMapForm;
  onSelectRoles: (index: number, selectedRoles: Array<FilterableMultiSelectItemProps>) => void;
  roles: Array<Role>;
  setForm: React.Dispatch<React.SetStateAction<AssignRoleDialogMapForm>>;
}
