/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import { just } from '@instana/observables';

import {
  RolesMenuItem,
  RolesTableHeader
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import {
  BatchActionItemProps,
  TableActions
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { Role } from 'in-settings/tabs/SecurityAndAccess/api/rolesMocks';
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

export const ROLES_TABLE_ACTIONS: Readonly<TableActions<Role>> = deepFreeze({
  delete: {
    deleteEntity: ({ id: _ }: Role) => just(undefined),
    batchDeleteEntity: (_ids: string[]) => just(undefined)
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
