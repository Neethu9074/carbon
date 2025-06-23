/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React from 'react';

import { CarbonStack, Link, Pill, Typography } from '@instana/components';
import { combineLatest } from '@instana/observables';
import { RoleOverview } from '@instana/types';

import {
  ROLES_TABLE_BATCH_ACTIONS,
  ROLES_TABLE_DELETE_MENU_ITEM,
  ROLES_TABLE_HEADERS,
  ROLES_TABLE_PAGE_SIZES,
  ROLES_TABLE_ORDER,
  LEAST_ROLE_PERMISSIONS,
  STATIC_ROLES
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.constants';
import MultiSelectDataTable, {
  DataTableRow,
  TableActions
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import EditRoleDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/EditRoleDialog';
import { RolesMenuItem } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { SETTINGS_ROLE_DELETE, SETTINGS_ROLE_OPEN_SUBMIT_FORM } from 'in-services/tracking/eventNames';
import { UnstableTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import useRolesOverview from 'in-settings/tabs/SecurityAndAccess/hooks/useRolesOverview';
import { securityAndAccessAccessControlRoleEdit } from 'in-settings/navigation/paths';
import { FORM_MODE } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { deleteRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { DELETED_OBJECT } from 'in-services/util/constants';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

const isDisabledDelete = (roleName: string) => Object.values<string>(STATIC_ROLES).includes(roleName);

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
      label: Object.values<string>(STATIC_ROLES).includes(role.name)
        ? t('in-settings:tabs.role.roleDeleteTooltip', { context: role.name })
        : t('in-settings:components.deleteEntity', { entity: role.name })
    }
  ];
}

function createTableRowsForRoles(
  roles: RoleOverview[],
  location: Location,
  createHref: ReturnType<typeof useNavigation>['createHref']
): Array<Omit<DataTableRow<[], RoleOverview>, 'cells'>> {
  return roles.map(role => {
    const { hasScope } = role;
    const roleLocation = {
      ...location,
      pathname: securityAndAccessAccessControlRoleEdit
    };
    return {
      ...role,
      disabled: isDisabledDelete(role.name),
      isLimited: role.isLimited ? t('in-settings:tabs.limitedAccess') : t('in-settings:tabs.accessAll'),
      name: (
        <CarbonStack>
          <Typography variant="body-regular" noWrap>
            <Link href={createHref(roleLocation, { id: role.id })}>
              {role.name} {hasScope ? <Pill>{t('in-settings:tabs.role.deprecated')}</Pill> : null}
            </Link>
          </Typography>
        </CarbonStack>
      ),
      rowData: role
    };
  });
}

const getRoleTableActions = (unstable_trackEvent: UnstableTrackingFunction): Readonly<TableActions<RoleOverview>> => ({
  delete: {
    deleteEntity: (role: RoleOverview) => {
      const customData = { roleId: role.id, roleName: role.name };
      unstable_trackEvent(
        DELETED_OBJECT,
        {
          objectType: SETTINGS_ROLE_DELETE
        },
        customData
      );
      return deleteRole(role);
    },
    batchDeleteEntity: (ids: string[]) => {
      unstable_trackEvent(
        DELETED_OBJECT,
        {
          objectType: SETTINGS_ROLE_DELETE
        },
        { roleIds: ids }
      );
      return combineLatest(ids.map(id => deleteRole({ id })));
    }
  }
});

export default function Roles() {
  const [data, , , progress] = useRolesOverview();
  const { location, createHref } = useNavigation();

  const roles = data ?? [];
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  return (
    <MultiSelectDataTable
      boundedPath="/roles"
      customBatchDeleteMessage={undefined}
      customDialogMessage={undefined}
      getBatchActionItems={() => ROLES_TABLE_BATCH_ACTIONS}
      getEntityName={(role: RoleOverview) => role.name}
      getMenuItems={row => createMenuItemsForRow(roles, row)}
      initalSortConfig={ROLES_TABLE_ORDER}
      labelNew={t('in-settings:tabs.role.newRole')}
      loading={progress.loading}
      onCreateNew={() => {
        addActiveDialog(
          <EditRoleDialog mode={FORM_MODE.NEW} formValues={{ permissions: [...LEAST_ROLE_PERMISSIONS] }} />
        );
        trackCta(SETTINGS_ROLE_OPEN_SUBMIT_FORM);
      }}
      pageSizes={ROLES_TABLE_PAGE_SIZES}
      searchAttributes={['name']}
      searchPlaceholderText={t('in-settings:components.search')}
      tableActions={getRoleTableActions(unstable_trackEvent)}
      tableHeaders={ROLES_TABLE_HEADERS}
      tableRows={createTableRowsForRoles(roles, location, createHref)}
      title={t('in-settings:tabs.roles')}
    />
  );
}
