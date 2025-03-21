/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { Link, Pill } from '@instana/components';
import { RoleOverview } from '@instana/types';

import {
  ROLES_TABLE_ACTIONS,
  ROLES_TABLE_BATCH_ACTIONS,
  ROLES_TABLE_DELETE_MENU_ITEM,
  ROLES_TABLE_HEADERS,
  ROLES_TABLE_PAGE_SIZES,
  ROLES_TABLE_ORDER
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.constants';
import CarbonDataTableWrapper, {
  DataTableRow
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import { RolesMenuItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import useRolesOverview from 'in-settings/tabs/SecurityAndAccess/hooks/useRolesOverview';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { STATIC_GROUP_NAMES } from 'in-settings/constants';
import { t } from 'in-i18n';

function createMenuItemsForRow(
  loadedRoles: RoleOverview[],
  { id, disabled }: Omit<DataTableRow<any[], RoleOverview>, 'rowData'>
): Array<RolesMenuItem> {
  const role = loadedRoles.find(role => role.id === id);

  if (!role) return [];

  return [
    {
      ...ROLES_TABLE_DELETE_MENU_ITEM,
      icon: <TrashCan />,
      isDisabledMenuItem: disabled,
      label: Object.values<string>(STATIC_GROUP_NAMES).includes(role.name)
        ? t('in-settings:tabs.groupDeleteTooltip', { context: role.name })
        : t('in-settings:components.deleteEntity', { entity: role.name })
    }
  ];
}

function createTableRowsForRoles(roles: RoleOverview[]): Array<Omit<DataTableRow<[], RoleOverview>, 'cells'>> {
  return roles.map(role => ({
    ...role,
    disabled: false,
    isLimited: role.isLimited ? t('in-settings:tabs.limitedAccess') : t('in-settings:tabs.accessAll'),
    name: (
      <Link href={undefined}>
        {role.name} {role.hasScope ? <Pill>{t('in-settings:tabs.role.deprecated')}</Pill> : null}
      </Link>
    ),
    rowData: role
  }));
}

export default function Roles() {
  const [data, , , progress] = useRolesOverview();
  const roles = data ?? [];

  return (
    <CarbonDataTableWrapper
      boundedPath="/roles"
      customBatchDeleteMessage={undefined}
      customDialogMessage={undefined}
      getBatchActionItems={() => ROLES_TABLE_BATCH_ACTIONS}
      getEntityName={(role: RoleOverview) => role.name}
      getMenuItems={row => createMenuItemsForRow(roles, row)}
      initalSortConfig={ROLES_TABLE_ORDER}
      labelNew={t('in-settings:tabs.role.newRole')}
      loading={progress.loading}
      onCreateNew={() => addActiveDialog(<EditRoleDialog mode={FORM_MODE.NEW} />)}
      pageSizes={ROLES_TABLE_PAGE_SIZES}
      searchAttributes={['name']}
      searchPlaceholderText={t('in-settings:components.search')}
      tableActions={ROLES_TABLE_ACTIONS}
      tableHeaders={ROLES_TABLE_HEADERS}
      tableRows={createTableRowsForRoles(roles)}
      title={t('in-settings:tabs.roles')}
    />
  );
}
