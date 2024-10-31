/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React from 'react';

import { GroupPermissionEntity, PermissionSet, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { Button } from '@instana/components';

import {
  extractId,
  extractName,
  getSelectedEntityIds,
  KubernetesEntityType,
  setNewSelected
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/utils';
import SelectEntitiesForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/SelectEntitiesForm';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import {
  getField,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';

/**
 * Properties for the component
 * @property addButtonLabel to be set as button text and to the form
 * @property entityType type of Kubernetes object
 * @property obserable to fetch the entity list
 */
interface Props<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE>, SlideControlProps<SubSlideConfig> {
  addButtonLabel: string;
  entityType: KubernetesEntityType;
  observable: () => Observable<Result<GroupPermissionEntity[]>>;
}

/**
 * Component to add new entities (Clusters / Namespaces)
 * @param param0 (props)
 * @returns specific instance
 */
export default function _KubernetesAddEntityButton<FORM_TYPE extends MapFormItems>({
  addButtonLabel,
  entityType,
  observable,
  setSubSlideConfig,
  setShowSubSlide,
  form,
  setForm
}: Props<FORM_TYPE>) {
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');
  if (!permissionSetField?.value) return null;

  const updatePermissionSet = (permissionSet: PermissionSet) => {
    const updatedForm = updateFormField(form, 'permissionSet', permissionSet, true);
    setForm(updatedForm);
  };
  return (
    <Button
      kind="action"
      onClick={() => {
        setSubSlideConfig({
          title: addButtonLabel,
          content: (
            <SelectEntitiesForm
              key={entityType}
              preselectedIds={getSelectedEntityIds(entityType, permissionSetField?.value)}
              observable={observable}
              extractId={extractId}
              extractName={extractName}
              onClickCancel={() => setShowSubSlide(false)}
              onClickSave={ids => {
                const newPermissionSet = setNewSelected(entityType, permissionSetField?.value, ids);
                updatePermissionSet(newPermissionSet);
                setShowSubSlide(false);
              }}
            />
          )
        });
        setShowSubSlide(true);
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {addButtonLabel}
    </Button>
  );
}
