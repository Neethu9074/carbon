/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import { combineLatest } from '@instana/observables';
import { RoleOverview } from '@instana/types';

import {
  RolesMenuItem,
  RolesTableHeader
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { BatchActionItemProps, TableActions } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { deleteRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const ROLES_TABLE_PAGE_SIZES = Object.freeze([10, 20, 50] as const);

export const ROLES_TABLE_ORDER = Object.freeze({ key: 'name', direction: 'asc' });

export const ROLES_TABLE_HEADERS: Readonly<RolesTableHeader[]> = deepFreeze([
  {
    key: 'name',
    header: t('in-settings:tabs.name')
  },
  {
    key: 'usersCount',
    header: t('in-settings:tabs.role.usersCount')
  },
  {
    key: 'permissionsCount',
    header: t('in-settings:tabs.role.permissionsCount')
  },
  {
    key: 'isLimited',
    header: t('in-settings:tabs.access')
  }
] as const);

export const ROLES_TABLE_ACTIONS: Readonly<TableActions<RoleOverview>> = deepFreeze({
  delete: {
    deleteEntity: ({ id }: RoleOverview) => deleteRole({ id }),
    batchDeleteEntity: (ids: string[]) => combineLatest(ids.map(id => deleteRole({ id })))
  }
} as const);

export const ROLES_TABLE_BATCH_ACTIONS: Readonly<Array<BatchActionItemProps>> = deepFreeze([
  {
    renderIcon: TrashCan,
    actionName: t('in-settings:components.delete'),
    actionType: 'delete'
  }
] as const);

export const ROLES_TABLE_DELETE_MENU_ITEM: RolesMenuItem = deepFreeze({
  actionType: 'delete',
  icon: undefined,
  isDisabledMenuItem: false,
  label: ''
} as const);
