/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createListForm, createMapForm, ValidationResult } from 'formalistic';
import { isEqual } from 'lodash';

import { TeamMember, TeamRole } from '@instana/types';

import {
  AssignRoleDialogFormItems,
  TeamRoleIds,
  TeamRoleSelectionType
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.types';
import { t } from 'in-i18n';

const getRoleSelectionType = (members?: Array<TeamMember>, roleIds?: TeamRoleIds) => {
  // If only one member exists or all members have the same role => SAME_ROLE_FOR_ALL_MEMBERS otherwise => INDIVIDUAL
  if (members?.length === 1 || members?.every(member => isEqual(member.roles, members[0]?.roles)) || roleIds) {
    return TeamRoleSelectionType.SAME_ROLE_FOR_ALL_MEMBERS;
  } else {
    return TeamRoleSelectionType.INDIVIDUAL;
  }
};

const roleAssignmentFormValidator = ({ members }: AssignRoleDialogFormItems): ValidationResult => {
  if (members) {
    for (let i = 0; i < members.size; i++) {
      const memberForm = members.get(i);
      if (memberForm) {
        const roleIds = memberForm.get('roles').value;
        // If a member without role assignment exists the form is invalid
        if (roleIds.length === 0) {
          return [
            {
              severity: 'error',
              message: t('in-settings:tabs.teams.noRoleSelectedError')
            }
          ];
        }
      }
    }
  }

  return [];
};

const rolesValidator = (roleIds: Array<TeamRole>): ValidationResult => {
  // At least one role needs to be selected
  if (roleIds.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.teams.noRoleSelectedError')
      }
    ];
  } else {
    return [];
  }
};

const getRoleIds = (roleIds: TeamRoleIds, globalRoleIds: TeamRoleIds) => {
  if (globalRoleIds) {
    return globalRoleIds;
  } else if (roleIds) {
    return roleIds;
  }
  return [];
};

const buildListFormItems = (members?: Array<TeamMember>, roleIds?: TeamRoleIds) => {
  return members?.map(member => {
    return createMapForm({
      items: {
        userId: createField({
          value: member.userId
        }),
        name: createField({
          value: member.name
        }),
        email: createField({
          value: member.email
        }),
        roles: createField({
          value: getRoleIds(member.roles, roleIds),
          validator: rolesValidator
        })
      }
    });
  });
};

export const createForm = (members?: Array<TeamMember>, roleIds: TeamRoleIds = undefined) => {
  return createMapForm({
    items: {
      roleSelectionType: createField({
        value: getRoleSelectionType(members, roleIds)
      }),
      members: createListForm({ items: buildListFormItems(members, roleIds) })
    },
    validator: roleAssignmentFormValidator
  });
};
