/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, Item, MapForm, notBlankValidator } from 'formalistic';

import { PermissionSetWithRoles } from '@instana/types';

import {
  AreaRole,
  AreaRoleType,
  AreaRoleWithCustomType,
  LimitableProductArea,
  ProductAreaPermissionMap,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { GroupApiResult } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import { PermissionsUnion } from 'in-stores/permission';

export function getField<T>(form: MapForm, path: string[] | string): Field<T> | undefined {
  const item = Array.isArray(path) ? form.getIn(path) : form.get(path);
  return item as Field<T> | undefined;
}

export function updateFormField<T>(form: MapForm, path: string | Array<string>, value: T, isTouched = false): MapForm {
  const pathArr = typeof path === 'string' ? [path] : path;
  return form.updateIn(pathArr, field => setFieldValue<T>(field, value, isTouched));
}

export function setFieldValue<T>(field: Item, value: T, isTouched = false): Field<T> {
  const updatedField = (field as Field<T>).setValue(value);
  if (!isTouched) return updatedField;
  return updatedField.setTouched(true);
}

export function createForm(form = createMapForm(), apiResult?: GroupApiResult) {
  const { id, name, members, permissionSet } = apiResult?.result.group || {};

  return form
    .put(
      'id',
      createField({
        value: id
      })
    )
    .put(
      'name',
      createField({
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      'members',
      createField({
        value: members
      })
    )
    .put(
      'permissionSet',
      createField({
        value: permissionSet
      })
    );
}

// Returns the AreaRole that matches the specified permissions
// in a permission set for a given product area
export function getAreaRoleFromPermissionSet(
  productArea: LimitableProductArea,
  permissionSet?: PermissionSetWithRoles
): AreaRoleWithCustomType | undefined {
  if (!permissionSet) return;

  const { capabilities } = ProductAreaPermissionMap[productArea];

  if (capabilities?.length > 0) {
    const hasAllCapabilities = capabilities.every(permission => permissionSet.permissions.includes(permission));

    if (hasAllCapabilities) return AreaRole.OWNER;

    // some capabilities
    return 'CUSTOM';
  }

  return AreaRole.VIEWER;
}

// Returns a limitation scope based on the given product area and current permissions.
export function getScopeFromProductArea(
  productArea: LimitableProductArea,
  permissionSet: PermissionSetWithRoles
): ScopedPermissionType {
  const { permissions } = permissionSet;
  const { limitation, permission } = ProductAreaPermissionMap[productArea];
  const hasAreaLimitation = limitation ? permissions.includes(limitation) : false;
  const hasAreaPermission = permission ? permissions.includes(permission) : false;

  if (hasAreaLimitation && !hasAreaPermission) return ScopedPermissionItem.NO_ACCESS;
  if (hasAreaLimitation) return ScopedPermissionItem.LIMITED_ACCESS;
  return ScopedPermissionItem.ACCESS_ALL;
}

// Returns a new permission set for limitable product areas,
// based on the given product area, limitation scope and role.
export function updatePermissionSetForLimitableProductArea(
  permissionSet: PermissionSetWithRoles,
  productArea: LimitableProductArea,
  scope: ScopedPermissionType,
  role: AreaRoleType | undefined = undefined
): PermissionSetWithRoles {
  const { limitation, permission, capabilities } = ProductAreaPermissionMap[productArea];
  const currentPermissions = permissionSet.permissions as Array<PermissionsUnion>;

  // clean all permissions related to managed ProductArea
  const allAreaPermissions: Array<PermissionsUnion> = [...capabilities];
  if (limitation) allAreaPermissions.push(limitation);
  if (permission) allAreaPermissions.push(permission);
  const permissions = currentPermissions.filter(permission => !allAreaPermissions.includes(permission));

  if (scope === ScopedPermissionItem.NO_ACCESS) {
    // with scope limitation without access permissions
    if (limitation) permissions.push(limitation);
    return { ...permissionSet, permissions };
  }

  const updatedPermissions = addPermissionsByRoleForProductArea(productArea, role, permissions);

  if (scope === ScopedPermissionItem.ACCESS_ALL) {
    // no scope limitation therefor no access permission needed
    return { ...permissionSet, permissions: updatedPermissions };
  }

  if (scope === ScopedPermissionItem.LIMITED_ACCESS) {
    // with scope limitation and access permission
    if (limitation) updatedPermissions.push(limitation);
    if (permission) updatedPermissions.push(permission);
    return { ...permissionSet, permissions: updatedPermissions };
  }

  return { ...permissionSet };
}

// Returns a new permission set containing all permissions related to the given product area and role
function addPermissionsByRoleForProductArea(
  productArea: LimitableProductArea,
  role: AreaRoleType | undefined,
  permissions: string[]
): string[] {
  // as starting with clean permissions for the area
  if (role === AreaRole.OWNER) {
    const { capabilities } = ProductAreaPermissionMap[productArea];
    permissions.push(...capabilities);
  }

  return permissions;
}
