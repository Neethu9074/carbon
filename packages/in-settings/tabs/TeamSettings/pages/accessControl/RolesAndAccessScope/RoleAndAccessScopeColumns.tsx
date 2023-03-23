/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect } from 'react';
import { MapForm } from 'formalistic';

import { PermissionSetWithRoles } from '@instana/types';
import { Button } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import EditAccessScopeDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
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
  editMode?: boolean;
  onSave: (form: MapForm) => void;
}

export default function RoleAndAccessScopeColumns({
  form,
  setForm,
  readOnly,
  editMode,
  onSave
}: RoleAndAccessScopeColumnsProps) {
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
