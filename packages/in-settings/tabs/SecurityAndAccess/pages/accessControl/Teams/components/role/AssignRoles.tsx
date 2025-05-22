/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ContainedList, ContainedListItem, FilterableMultiSelect } from '@instana/carbon';
import { RoleOverview, TeamRole } from '@instana/types';

import { TeamRoleSelectionType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.types';
import { AssignRolesProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoles.types';
import { defaultFilterItems } from 'in-settings/components/FilterableMultiSelect/FilterableMultiSelect.utils';
import { t } from 'in-i18n';

import locals from './AssignRoles.mless';

const createInitialSelectedItems = (roleIds: Array<TeamRole>) => {
  return roleIds.map(roleId => {
    return { id: roleId.roleId, text: roleId.roleName ?? '' };
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
    const roleIds = membersListForm.get(0)?.get('roles')?.value ?? [];
    return (
      <div className={locals.sameRoleForAllMembersSelectWrapper}>
        <FilterableMultiSelect
          className={locals.sameRoleForAllMembersSelect}
          filterItems={defaultFilterItems}
          id="rbac-team-select-same-role-for-all-members"
          initialSelectedItems={createInitialSelectedItems(roleIds)}
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
      <ContainedList
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
            const fullName = memberMapForm.get('name').value;
            const roleIdsField = memberMapForm.get('roles');
            const roleIds = roleIdsField.value;
            return (
              <ContainedListItem key={userId}>
                <div className={locals.indivdualRoleSelectionList}>
                  <span>{fullName ?? userId}</span>
                  <span>
                    <FilterableMultiSelect
                      filterItems={defaultFilterItems}
                      id={`rbac-team-select-individual-role-${userId}`}
                      initialSelectedItems={createInitialSelectedItems(roleIds)}
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
              </ContainedListItem>
            );
          })
        }
      </ContainedList>
    );
  } else {
    return <></>;
  }
};
