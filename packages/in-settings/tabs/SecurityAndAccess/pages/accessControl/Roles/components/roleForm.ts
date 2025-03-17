/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, notBlankValidator } from 'formalistic';

import { ProductAreaType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { PermissionsUnion } from 'in-stores/permission';

export type ProductAreaPermissionUnion = PermissionsUnion | ProductAreaType;

export type RoleFormFields = {
  name: Field<string>;
  applyToAllUnits: Field<boolean>;
  permissions: Field<Array<ProductAreaPermissionUnion>>;
};

export type DefaultRoleFormFieldValues = {
  [key in keyof RoleFormFields]: RoleFormFields[key]['value'];
};

export function createRoleForm(initValues?: DefaultRoleFormFieldValues): MapForm<RoleFormFields> {
  return createMapForm<RoleFormFields>({
    items: {
      name: createField({
        value: initValues?.name ?? '',
        validator: notBlankValidator
      }),
      applyToAllUnits: createField({
        value: initValues?.applyToAllUnits ?? false
      }),
      permissions: createField({
        value: initValues?.permissions ?? []
      })
    }
  });
}
