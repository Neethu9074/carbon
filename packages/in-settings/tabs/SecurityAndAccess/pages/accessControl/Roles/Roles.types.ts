/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ApiRole, RoleDetails, RoleOverview } from '@instana/types';

import {
  DataTableHeader,
  OverflowMenuItemProps
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ProductAreaType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { PermissionsUnion } from 'in-stores/permission';

export type ProductAreaPermissionUnion = PermissionsUnion | ProductAreaType;

export interface ApiRoleWithPermissions extends Omit<ApiRole, 'permissions'> {
  permissions: Array<ProductAreaPermissionUnion>;
}

export interface RoleDetailsWithPermissions extends RoleDetails {
  permissions: Array<ProductAreaPermissionUnion>;
}

export interface RolesTableHeader extends DataTableHeader {
  key: keyof RoleOverview;
}

export interface RolesMenuItem extends OverflowMenuItemProps {
  isDisabledMenuItem?: boolean;
}
