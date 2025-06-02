/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import {
  RolesMenuItem,
  RolesTableHeader
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { BatchActionItemProps } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { LimitedAccessScope } from 'in-stores/permission';
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
    header: t('in-settings:tabs.numberOfMembers')
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

export const LEAST_ROLE_PERMISSIONS = Object.freeze([
  LimitedAccessScope.LIMITED_APPLICATIONS_SCOPE,
  LimitedAccessScope.LIMITED_AUTOMATION_SCOPE,
  LimitedAccessScope.LIMITED_BIZOPS_SCOPE,
  LimitedAccessScope.LIMITED_INFRASTRUCTURE_SCOPE,
  LimitedAccessScope.LIMITED_KUBERNETES_SCOPE,
  LimitedAccessScope.LIMITED_MOBILE_APPS_SCOPE,
  LimitedAccessScope.LIMITED_NUTANIX_SCOPE,
  LimitedAccessScope.LIMITED_OPENSTACK_SCOPE,
  LimitedAccessScope.LIMITED_PCF_SCOPE,
  LimitedAccessScope.LIMITED_PHMC_SCOPE,
  LimitedAccessScope.LIMITED_POWERVC_SCOPE,
  LimitedAccessScope.LIMITED_SAP_SCOPE,
  LimitedAccessScope.LIMITED_SYNTHETICS_SCOPE,
  LimitedAccessScope.LIMITED_VSPHERE_SCOPE,
  LimitedAccessScope.LIMITED_WEBSITES_SCOPE,
  LimitedAccessScope.LIMITED_XENSERVER_SCOPE,
  LimitedAccessScope.LIMITED_ZHMC_SCOPE
] as const);
