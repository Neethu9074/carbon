/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { Button } from '@instana/components';

import {
  extractId,
  extractName,
  getSelectedEntityIds,
  KubernetesEntityType,
  setNewSelected
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/utils';
import SelectEntitiesForm from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/SelectEntitiesForm';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { GroupPermissionEntity } from 'in-kubernetes/subscriptions/groupPermissionEntities';
import { SubSlideConfig } from 'in-settings/components/ConfigDialog/ConfigDialog';
import { SlideControlProps } from 'in-settings/hooks/useSubSlideControl';

/**
 * Properties for the component
 * @property addButtonLabel to be set as button text and to the form
 * @property entityType type of Kubernetes object
 * @property obserable to fetch the entity list
 */
interface Props extends FormControlProps, SlideControlProps<SubSlideConfig> {
  addButtonLabel: string;
  entityType: KubernetesEntityType;
  observable: () => Observable<Result<GroupPermissionEntity[]>>;
}

/**
 * Component to add new entities (Clusters / Namespaces)
 * @param param0 (props)
 * @returns specific instance
 */
export default function _KubernetesAddEntityButton({
  addButtonLabel,
  entityType,
  observable,
  setSubSlideConfig,
  setShowSubSlide,
  form,
  setForm
}: Props) {
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');
  if (!permissionSetField?.value) return null;

  const updatePermissionSet = (permissionSet: PermissionSetWithRoles) => {
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
