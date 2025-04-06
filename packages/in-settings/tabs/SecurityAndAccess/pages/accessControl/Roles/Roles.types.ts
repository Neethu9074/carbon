/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RoleOverview } from '@instana/types';

import {
  DataTableHeader,
  OverflowMenuItemProps
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';

export interface RolesTableHeader extends DataTableHeader {
  key: keyof RoleOverview;
}

export interface RolesMenuItem extends OverflowMenuItemProps {
  isDisabledMenuItem?: boolean;
}
