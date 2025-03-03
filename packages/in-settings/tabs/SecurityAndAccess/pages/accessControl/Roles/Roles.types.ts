/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  DataTableHeader,
  OverflowMenuItemProps
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { Role } from 'in-settings/tabs/SecurityAndAccess/api/rolesMocks';

export interface RolesTableHeader extends DataTableHeader {
  key: keyof Role;
}

export interface RolesMenuItem extends OverflowMenuItemProps {
  isDisabledMenuItem?: boolean;
}
