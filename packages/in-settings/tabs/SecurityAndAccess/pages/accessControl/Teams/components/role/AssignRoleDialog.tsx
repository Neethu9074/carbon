/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonContentSwitcher,
  CarbonForm,
  CarbonFormGroup,
  CarbonInlineLoading,
  CarbonModal,
  CarbonSwitch
} from '@instana/components';

import {
  AssignRoleDialogProps,
  TeamRoleSelectionType,
  FilterableMultiSelectItemProps
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.types';
import { createForm } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoleDialog.form';
import { AssignRoles } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/role/AssignRoles';
import useRolesOverview from 'in-settings/tabs/SecurityAndAccess/hooks/useRolesOverview';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './AssignRoleDialog.mless';

export const AssignRoleDialog = ({ team, onSubmit }: AssignRoleDialogProps) => {
  const [data, , , progress] = useRolesOverview();
  const roles = data ?? [];
  const [form, setForm] = useState(createForm(team.members));

  const onSelectRoles = (index: number, selectedRoles: Array<FilterableMultiSelectItemProps>) => {
    if (selectedRoles) {
      const newRoles = selectedRoles.map((role: { id: string; text: string }) => {
        return {
          roleId: role.id,
          roleName: role.text,
          viaIdP: false
        };
      });

      const roleSelectionType = form.get('roleSelectionType').value;
      if (roleSelectionType === TeamRoleSelectionType.SAME_ROLE_FOR_ALL_MEMBERS) {
        // Recreate form with same roles for all members
        setForm(createForm(team.members, newRoles));
      } else {
        // Update individual role assignment
        const memberMapForm = form.get('members').get(index);
        if (memberMapForm) {
          setForm(
            form.updateIn(['members'], listForm =>
              listForm.set(
                index,
                memberMapForm.updateIn(['roleIds'], f => f.setValue(newRoles).setTouched(true))
              )
            )
          );
        }
      }
    }
  };

  return (
    <CarbonModal
      modalHeading={t('in-settings:tabs.teams.assignRoleDialogTitle', { team: team.tag })}
      onRequestClose={() => {
        close();
      }}
      onRequestSubmit={() => {
        const members = form.get('members').toJS();
        onSubmit(members);
        close();
      }}
      onSecondarySubmit={() => {
        close();
      }}
      open
      primaryButtonDisabled={!form.hierarchyValid}
      primaryButtonText={t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      size="md"
    >
      <CarbonForm>
        {progress.loading && <CarbonInlineLoading />}

        {!progress.loading && (
          <>
            <CarbonFormGroup legendText={t('in-settings:tabs.teams.selectRoles')}>
              <CarbonContentSwitcher
                className={locals.roleTypeSwitcher}
                selectedIndex={Object.values(TeamRoleSelectionType).indexOf(form.get('roleSelectionType').value)}
                onChange={({ index = 0 }) =>
                  setForm(
                    form.updateIn(['roleSelectionType'], f =>
                      f.setValue(Object.values(TeamRoleSelectionType)[index]).setTouched(true)
                    )
                  )
                }
                size="sm"
              >
                <CarbonSwitch
                  name={TeamRoleSelectionType.SAME_ROLE_FOR_ALL_MEMBERS}
                  text={t('in-settings:tabs.teams.assignSameRolesForAllMembers')}
                />
                <CarbonSwitch
                  name={TeamRoleSelectionType.INDIVIDUAL}
                  text={t('in-settings:tabs.teams.assignIndiviudalRolesForEachTeamMember')}
                />
              </CarbonContentSwitcher>
            </CarbonFormGroup>

            <div className={locals.assignRolesWrapper}>
              <AssignRoles form={form} onSelectRoles={onSelectRoles} roles={roles} setForm={setForm} />
            </div>
          </>
        )}
      </CarbonForm>
    </CarbonModal>
  );
};
