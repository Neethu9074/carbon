/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { PermissionSetWithRoles } from '@instana/types';
import { Button } from '@instana/components';

import EditAccessScopeDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
import RolesAndAccessScopeOverview from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

export interface FormControlProps {
  form: MapForm;
  setForm: (form: MapForm) => void;
}
interface RoleAndAccessScopeColumnsProps extends FormControlProps {
  readOnly?: boolean;
  onSave: (form: MapForm) => void;
}

export default function RoleAndAccessScopeColumns({ form, setForm, readOnly, onSave }: RoleAndAccessScopeColumnsProps) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');

  const openAccessScopeDialog = () => {
    addActiveDialog(
      <EditAccessScopeDialog
        form={form}
        setForm={setForm}
        onSave={form => {
          onSave(form);
          close();
        }}
        onCancel={close}
        editMode
      />
    );
  };

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
