/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect } from 'react';
import { MapForm, MapFormItems } from 'formalistic';

import { PermissionSetWithRoles } from '@instana/types';
import { Button } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import EditAccessScopeDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { teamSettingsAccessControlGroups } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col } from 'in-components/layout/Grid/Grid';
import { goToPath } from 'in-stores/navigation';
import { t } from 'in-i18n';

export interface FormControlProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
}
interface RoleAndAccessScopeColumnsProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  readOnly?: boolean;
  editMode?: boolean;
  onSave: (form: MapForm<FORM_TYPE>) => void;
}

export default function RoleAndAccessScopeColumns<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  readOnly,
  editMode,
  onSave
}: RoleAndAccessScopeColumnsProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');

  const closeAndBack = () => {
    if (!editMode) {
      goToPath(teamSettingsAccessControlGroups);
    }
    close();
  };

  const openAccessScopeDialog = () => {
    addActiveDialog(
      <EditAccessScopeDialog
        form={form}
        setForm={setForm}
        onSave={form => {
          onSave(form);
          close();
        }}
        onCancel={closeAndBack}
        editMode={editMode}
      />
    );
  };

  // while opening a new group we immediately want to start in creation wizard dialog
  useEffect(() => {
    if (!editMode) {
      openAccessScopeDialog();
    }
    // as openAccessScopeDialog should not be be watched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode]);

  return (
    <Col lg={6}>
      <LightCard
        title={t('in-settings:roleAndAccessScope.productArea')}
        header={
          !readOnly && (
            <Button onClick={openAccessScopeDialog} kind="action">
              {t('in-settings:roleAndAccessScope.editButton')}
            </Button>
          )
        }
      >
        {permissionSetField && <RolesAndAccessScopeOverview permissionsSet={permissionSetField.value} />}
      </LightCard>
    </Col>
  );
}
