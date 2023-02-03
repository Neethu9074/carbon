/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Button, Li, Message, Ul } from '@instana/components';
import { PermissionSetWithRoles } from '@instana/types';

import EditAccessScopeDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
import { ProductAreas } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { RESTRICTED_ACCESS } from 'in-stores/permission';
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

  const includesRestrictedAccess = permissionSetField?.value?.permissions?.includes(RESTRICTED_ACCESS);

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
        {!includesRestrictedAccess && <Message type="warning">{t('in-stores:permissionRestrictedWarning')}</Message>}
        {includesRestrictedAccess && (
          <Ul>
            {ProductAreas.map(section => (
              <Li key={section}>
                {t('in-settings:roleAndAccessScope.productArea', { context: section.toLocaleLowerCase() })}
              </Li>
            ))}
          </Ul>
        )}
      </LightCard>
    </Col>
  );
}
