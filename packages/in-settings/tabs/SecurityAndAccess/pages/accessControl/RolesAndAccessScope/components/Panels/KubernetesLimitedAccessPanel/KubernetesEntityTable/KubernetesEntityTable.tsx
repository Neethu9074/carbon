/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapFormItems } from 'formalistic';
import React, { useState } from 'react';
import classNames from 'classnames';

import { GroupPermissionEntity, OrderDirection, PermissionSet, Result } from '@instana/types';
import { IconButton, Stack, SvgIcon, Typography } from '@instana/components';
import { Observable } from '@instana/observables';
import { themes } from '@instana/design-tokens';

import {
  getSelectedEntityIds,
  KubernetesEntity,
  KubernetesEntityType,
  removeOneEntity,
  useSelectedEntities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/Panels/KubernetesLimitedAccessPanel/utils';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import EntityTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EntityTable';
import { getField } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './KubernetesEntityTable.mless';

/**
 * Table representive to display all currently selected
 * @property entityType to differ between Namespace / Cluster
 * @property observable to fetch the data
 */
interface Props<FORM_TYPE extends MapFormItems> extends FormControlProps<FORM_TYPE> {
  entityType: KubernetesEntityType;
  observable: () => Observable<Result<GroupPermissionEntity[]>>;
}

/**
 * Table displaying the currently selected Kubernetes namespaces
 * @param param0   to get current selection / adjust and determine the entityType
 * @returns current instance
 */
export default function _KubernetesEntityTable<FORM_TYPE extends MapFormItems>({
  entityType,
  form,
  observable,
  setForm
}: Props<FORM_TYPE>) {
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  // retrieve data from permissionSet
  const permissionSetField = getField<PermissionSet>(form, 'permissionSet');

  const selectedIds: string[] = getSelectedEntityIds(entityType, permissionSetField?.value);
  const selected = useSelectedEntities(observable, orderDirection, selectedIds);

  // Column definition
  const columnDefinition: Array<ColumnDefinition<KubernetesEntity>> = [
    {
      id: 'name',
      label: t('in-settings:selectEntityDialog.nameColumnHead'),
      getContent({ name, obsolete }) {
        return (
          <Stack gap="xsmall" direction="horizontal" align="start">
            <Tooltip content={name} align="topLeft">
              <div
                className={classNames({
                  [locals.abbreviatedContent]: true,
                  [locals.obsolete]: obsolete
                })}
              >
                <Typography variant="body-regular" component="span">
                  {name}
                </Typography>
              </div>
            </Tooltip>
            {obsolete && (
              <Tooltip content={t('in-settings:productAreas.obsoleteEntityDescription')} align="leftMiddle" delay={500}>
                <SvgIcon type="lib_help_error_info_outline" size="s" color={'#172429'} />
              </Tooltip>
            )}
          </Stack>
        );
      }
    },
    {
      id: 'action',
      label: '',
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(it) {
        return (
          <IconButton
            kind="primary"
            aria-label={t('in-settings:PermissionSection.deleteButton', { name: it.name })}
            onClick={() => removeOneEntity(entityType, form, setForm, permissionSetField!!.value, it.id)}
            type="lib_openclose_remove_circle_outline"
            color={themes.default.ids.color.option.teal[500]}
          />
        );
      }
    }
  ];
  // Actual table
  return (
    <EntityTable
      fetchedConfigState={selected}
      query=""
      orderBy="name"
      orderDirection={orderDirection}
      onClickItem={noop}
      onChange={({ orderDirection: newState }) => setOrderDirection(newState ?? orderDirection)}
      columnDefinition={columnDefinition}
      key={entityType + 'group-edit-summary-view'}
      paginated
    />
  );
}
