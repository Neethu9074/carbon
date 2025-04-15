/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, notBlankValidator } from 'formalistic';

import { ProductAreaType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { PermissionsUnion } from 'in-stores/permission';
import { Member } from 'in-types';

export type ProductAreaPermissionUnion = PermissionsUnion | ProductAreaType;

export type RoleFormFields = {
  id: Field<string | undefined>;
  name: Field<string>;
  members: Field<Member[]>;
  applyToAllUnits: Field<boolean>;
  permissions: Field<Array<ProductAreaPermissionUnion>>;
};

export type DefaultRoleFormFieldValues = {
  [key in keyof RoleFormFields]: RoleFormFields[key]['value'];
};

export function createRoleForm(initValues?: Partial<DefaultRoleFormFieldValues>): MapForm<RoleFormFields> {
  return createMapForm<RoleFormFields>({
    items: {
      id: createField({
        value: initValues?.id ?? undefined
      }),
      name: createField({
        value: initValues?.name ?? '',
        validator: notBlankValidator
      }),
      members: createField({
        value: initValues?.members ?? []
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
