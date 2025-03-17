/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, ListForm, MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { Notification } from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { ApiTeam, ApiTeamRole } from 'in-settings/tabs/SecurityAndAccess/api/teams';

export interface AssignRoleDialogProps {
  onSubmit: (members: Array<any>) => void;
  setMessage?: React.Dispatch<React.SetStateAction<Notification | undefined>>;
  team: ApiTeam;
}

export enum TeamRoleSelectionType {
  SAME_ROLE_FOR_ALL_MEMBERS = 'same-role-for-all-members',
  INDIVIDUAL = 'individual'
}

export interface FilterableMultiSelectItemProps {
  id: string;
  text: string;
}

export interface FilterableMultiSelectItemExtraProps {
  itemToString: (item: FilterableMultiSelectItemProps | null) => string;
  inputValue: string;
}

export interface AssignRoleDialogFormItems extends MapFormItems {
  roleSelectionType: Field<TeamRoleSelectionType>;
  members: ListForm<
    MapForm<{
      userId: Field<string>;
      fullName: Field<string | undefined>;
      roleIds: Field<Array<ApiTeamRole>>;
    }>[]
  >;
}
export type AssignRoleDialogMapForm = MapForm<AssignRoleDialogFormItems>;
