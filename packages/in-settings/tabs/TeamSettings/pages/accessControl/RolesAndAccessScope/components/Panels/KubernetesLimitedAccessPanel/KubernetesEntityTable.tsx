/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { PermissionSetWithRoles, Result } from '@instana/types';
import { Observable } from '@instana/observables';
import { SvgIcon } from '@instana/components';
import { useTheme } from '@instana/hooks';

import {
  getSelectedEntityIds,
  KubernetesEntityType,
  removeOneEntity,
  useSelectedEntities
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/utils';
import { FormControlProps } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import EntityTable from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { getField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import { GroupPermissionEntity } from 'in-kubernetes/subscriptions/groupPermissionEntities';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

/**
 * Table representive to display all currently selected
 * @property entityType to differ between Namespace / Cluster
 * @property observable to fetch the data
 */
interface Props extends FormControlProps {
  entityType: KubernetesEntityType;
  observable: () => Observable<Result<GroupPermissionEntity[]>>;
}

/**
 * Table displaying the currently selected Kubernetes namespaces
 * @param param0   to get current selection / adjust and determine the entityType
 * @returns current instance
 */
export default function _KubernetesEntityTable({ entityType, form, observable, setForm }: Props) {
  // retrieve data from permissionSet
  const permissionSetField = getField<PermissionSetWithRoles>(form, 'permissionSet');

  const selectedIds: string[] = getSelectedEntityIds(entityType, permissionSetField?.value);
  const selectedNamespaces = useSelectedEntities(observable, selectedIds);

  // Column definition
  const theme = useTheme();
  const columnDefinition: Array<ColumnDefinition<GroupPermissionEntity>> = [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent(it) {
        return <>{it.name}</>;
      }
    },
    {
      id: 'action',
      label: '',
      useMinimumAmountOfHorizontalSpace: true,
      getContent(it) {
        return (
          <SvgIcon
            aria-label={t('in-settings:PermissionSection.deleteButton', { name: it.name })}
            onClick={() => removeOneEntity(entityType, form, setForm, permissionSetField!!.value, it.id)}
            type="lib_openclose_remove_circle_outline"
            color={theme.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];
  // Actual table
  return (
    <EntityTable
      fetchedConfigState={selectedNamespaces}
      query=""
      orderBy="name"
      orderDirection="ASC"
      onClickItem={noop}
      columnDefinition={columnDefinition}
    />
  );
}
