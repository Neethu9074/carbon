/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ApiRole, RoleOverview } from '@instana/types';

import {
  DataTableHeader,
  OverflowMenuItemProps
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/components/roleForm';

export interface ApiRoleWithPermissions extends Omit<ApiRole, 'permissions'> {
  permissions: Array<ProductAreaPermissionUnion>;
}

export interface RolesTableHeader extends DataTableHeader {
  key: keyof RoleOverview;
}

export interface RolesMenuItem extends OverflowMenuItemProps {
  isDisabledMenuItem?: boolean;
}
