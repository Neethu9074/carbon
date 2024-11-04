/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';
import React, { useEffect } from 'react';

import { ApiGroup, PermissionSet } from '@instana/types';
import { Button } from '@instana/components';

import RolesAndAccessScopeOverview from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/Areas/RolesAndAccessScopeOverview';
import {
  getAreaRoleFromPermissionSet,
  getField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import EditAccessScopeDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
import {
  ProductArea,
  ScopeRoles
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { securityAndAccessAccessControlGroups } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { Col } from 'in-components/layout/Grid/Grid';
import config from 'in-services/config';
import { Trans, t } from 'in-i18n';

export interface FormControlProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
}
interface RoleAndAccessScopeColumnsProps<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  readOnly?: boolean;
  editMode?: boolean;
  onSave: (form: MapForm<FORM_TYPE>) => void;
  result: { group: ApiGroup };
}

export default function RoleAndAccessScopeColumns<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  readOnly,
  editMode,
  onSave,
  result
}: RoleAndAccessScopeColumnsProps<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');

  const { goToPath } = useNavigation();

  const closeAndBack = () => {
    if (!editMode) {
      goToPath(securityAndAccessAccessControlGroups);
    }
    close();
  };

  const onClickSave = (form: MapForm<FORM_TYPE>) => {
    const initialApplicationRole = getAreaRoleFromPermissionSet(
      ProductArea.APPLICATION,
      permissionSetField?.value as PermissionSet
    );
    const contributorApplicationIds = result.group.permissionSet.applicationIds?.filter(
      scopeBinding => scopeBinding.scopeRoleId === ScopeRoles.Contributor
    )?.length;
    const currentPermissionSet = getField<PermissionSet>(form, 'permissionSet')?.value;
    const currentApplicationRole = getAreaRoleFromPermissionSet(ProductArea.APPLICATION, currentPermissionSet);
    const currentTagfilter = currentPermissionSet?.restrictedApplicationFilter?.tagFilterExpression;
    if (
      contributorApplicationIds > 0 &&
      (currentTagfilter === undefined || currentApplicationRole !== initialApplicationRole)
    ) {
      addActiveDialog(
        <ConfirmationDialog
          header={t('in-settings:components.pleaseConfirm')}
          description={
            <Trans
              i18nKey="in-settings:components.confirmSaveGroup"
              values={{ numberOfContributorAPs: contributorApplicationIds }}
            />
          }
          confirmButtonLabel={t('forms.actions.save')}
          onSubmit={() => {
            close();
            onSave(form);
            close();
          }}
        />
      );
    } else {
      onSave(form);
      close();
    }
  };

  const openAccessScopeDialog = () => {
    addActiveDialog(
      <EditAccessScopeDialog
        form={form}
        setForm={setForm}
        onSave={form => onClickSave(form)}
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
        title={t('in-settings:roleAndAccessScope.productArea', {
          tenantUnit: config.tenantUnit,
          tenant: config.tenant
        })}
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
