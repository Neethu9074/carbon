/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonContainedList, CarbonContainedListItem, CarbonFilterableMultiSelect } from '@instana/components';
import { createLogger } from '@instana/logger';
import { RoleOverview } from '@instana/types';

import {
  TeamRoleSelectionType,
  FilterableMultiSelectItemProps,
  FilterableMultiSelectItemExtraProps
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.types';
import { AssignRolesProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoles.types';
import { ApiTeamRole as TeamRole } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { t } from 'in-i18n';

import locals from './AssignRoles.mless';

const logger = createLogger('TeamAssignRoles');

const defaultFilterItems = (
  items: Array<FilterableMultiSelectItemProps>,
  extra: FilterableMultiSelectItemExtraProps
): Array<FilterableMultiSelectItemProps> => {
  return items.filter(item => {
    if (!extra.inputValue) {
      return true;
    }
    return extra.itemToString(item).toLowerCase().includes(extra.inputValue.toLowerCase());
  });
};

// Will be removed once backend API also returns role name besides id
const getRoleName = (roles: Array<RoleOverview>, roleId: string) => {
  logger.warn('Temporary function to be removed when user name and role name are available through team API');
  const role = roles.find(role => role.id === roleId);
  return role ? role.name : '';
};

const createInitialSelectedItems = (roles: Array<RoleOverview>, roleIds: Array<TeamRole>) => {
  return roleIds.map(roleId => {
    return { id: roleId.roleId, text: getRoleName(roles, roleId.roleId) };
  });
};

const createMultiSelectItems = (roles: Array<RoleOverview>) => {
  return roles.map(role => {
    return {
      id: role.id,
      text: role.name
    };
  });
};

export const AssignRoles = ({ form, onSelectRoles, roles }: AssignRolesProps) => {
  const membersListForm = form.get('members');
  const roleSelectionType = form.get('roleSelectionType').value;

  if (roleSelectionType === TeamRoleSelectionType.SAME_ROLE_FOR_ALL_MEMBERS) {
    // Use roles from first member as preselect
    const roleIds = membersListForm.get(0)?.get('roleIds')?.value ?? [];
    return (
      <div className={locals.sameRoleForAllMembersSelectWrapper}>
        <CarbonFilterableMultiSelect
          className={locals.sameRoleForAllMembersSelect}
          filterItems={defaultFilterItems}
          id="rbac-team-select-same-role-for-all-members"
          initialSelectedItems={createInitialSelectedItems(roles, roleIds)}
          invalid={!form.valid}
          invalidText={form?.messages[0]?.message}
          items={createMultiSelectItems(roles)}
          itemToString={item => item?.text || ''}
          onChange={selected => onSelectRoles(0, selected?.selectedItems)}
          selectionFeedback="top-after-reopen"
          size="md"
          titleText={t('in-settings:tabs.teams.selectRolesForAllMembers')}
          type="default"
        />
      </div>
    );
  } else if (roleSelectionType === TeamRoleSelectionType.INDIVIDUAL) {
    return (
      <CarbonContainedList
        label={
          <div className={locals.indivdualRoleSelectionList}>
            <span>{t('in-settings:tabs.teams.assignRoleColumnHeaderUser')}</span>
            <span>{t('in-settings:tabs.teams.assignRoleColumnHeaderRoles')}</span>
          </div>
        }
        size="md"
      >
        {
          //@ts-expect-error formalistic type definition does not match implementation (index is missing in type definition)
          membersListForm.map((memberMapForm, index) => {
            const userId = memberMapForm.get('userId').value;
            const fullName = memberMapForm.get('fullName').value;
            const roleIdsField = memberMapForm.get('roleIds');
            const roleIds = roleIdsField.value;
            return (
              <CarbonContainedListItem key={userId}>
                <div className={locals.indivdualRoleSelectionList}>
                  <span>{fullName ? fullName : userId}</span>
                  <span>
                    <CarbonFilterableMultiSelect
                      filterItems={defaultFilterItems}
                      id={`rbac-team-select-individual-role-${userId}`}
                      initialSelectedItems={createInitialSelectedItems(roles, roleIds)}
                      invalid={!roleIdsField.valid}
                      invalidText={roleIdsField?.messages[0]?.message}
                      items={createMultiSelectItems(roles)}
                      itemToString={item => item?.text || ''}
                      onChange={selected => onSelectRoles(index, selected?.selectedItems)}
                      selectionFeedback="top-after-reopen"
                      size="md"
                      type="default"
                    />
                  </span>
                </div>
              </CarbonContainedListItem>
            );
          })
        }
      </CarbonContainedList>
    );
  } else {
    return <></>;
  }
};
