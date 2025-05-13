/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ProductAreaPermissionUnion } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import useChildUniqueItemCount from 'in-settings/tabs/SecurityAndAccess/hooks/useChildUniqueItemCount';

export interface PermissionMap<T> {
  availablePermissions: T;
  enabledPermissions: T;
}

export type AddPermissionItemsFunction = (
  availablePermissions: Array<ProductAreaPermissionUnion>,
  enabledPermissions: Array<ProductAreaPermissionUnion>
) => void;
type ResetPermissionItemsFunction = () => void;

/**
 * In order to automatically align amount of permissions with the permissions
 * within the accordion items, we maintain a specific state that will be
 * updated by the PermissionAccordionItem.
 **/
export default function usePermissionCount(): [
  PermissionMap<number>,
  AddPermissionItemsFunction,
  ResetPermissionItemsFunction
] {
  const [availablePermissions, addAvailablePermissionItems, resetAvailablePermissionItems] =
    useChildUniqueItemCount<ProductAreaPermissionUnion>();
  const [enabledPermissions, addEnabledPermissionItems, resetEnabledPermissionItems] =
    useChildUniqueItemCount<ProductAreaPermissionUnion>();

  function addPermissionItems(
    availablePermissions: Array<ProductAreaPermissionUnion>,
    enabledPermissions: Array<ProductAreaPermissionUnion>
  ) {
    addAvailablePermissionItems(availablePermissions);
    addEnabledPermissionItems(enabledPermissions);
  }

  function resetPermissionItems() {
    resetAvailablePermissionItems();
    resetEnabledPermissionItems();
  }

  return [
    {
      availablePermissions,
      enabledPermissions
    },
    addPermissionItems,
    resetPermissionItems
  ];
}
