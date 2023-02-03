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
  isLimitableProductArea,
  LimitableProductArea,
  LimitedScopeByProductArea,
  ProductAreaPermissionMap,
  ProductAreaType,
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

type ProductAreasWithRoles = Extract<
  ProductAreaType,
  'WEBSITE' | 'MOBILE_APP' | 'APPLICATION' | 'PLATFORM' | 'INFRASTRUCTURE'
>;

// Returns the AreaRole that matches the specified permissions
// in a permission set for a given product area
export function getAreaRoleFromPermissionSet(
  productArea: ProductAreasWithRoles,
  permissionSet?: PermissionSetWithRoles
): AreaRoleWithCustomType | undefined {
  if (permissionSet === undefined || permissionSet.permissions.length === 0) return;

  const { capabilities } = ProductAreaPermissionMap[productArea];

  const hasAllCapabilities = capabilities.every(permission => permissionSet.permissions.includes(permission));

  if (hasAllCapabilities) return AreaRole.OWNER;

  const hasSomeCapabilities = capabilities.some(permission => permissionSet.permissions.includes(permission));

  if (hasSomeCapabilities) return 'CUSTOM';

  return AreaRole.VIEWER;
}

// Returns a new permission set containing all permissions related to the given product area and role
export function updatePermissionSetByProductAreaAndRole(
  productArea: ProductAreasWithRoles,
  role: AreaRoleType | undefined,
  permissionSet: PermissionSetWithRoles
): PermissionSetWithRoles {
  const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
  const unionPermissions = [...areaPermissions, ...capabilities];
  const cleanedPermissionSet = removePermissionsFromPermissionSetByProductArea(productArea, permissionSet);
  const permissions = [...cleanedPermissionSet.permissions];

  if (role === AreaRole.OWNER) {
    permissions.push(...unionPermissions);
  }

  if (role === AreaRole.VIEWER) {
    permissions.push(...areaPermissions);
  }

  return {
    ...permissionSet,
    permissions
  };
}

// Returns a new permission set without permissions related to a specific product area
export function removePermissionsFromPermissionSetByProductArea(
  productArea: ProductAreasWithRoles,
  permissionSet: PermissionSetWithRoles
): PermissionSetWithRoles {
  const limitedScopes = isLimitableProductArea(productArea) ? [LimitedScopeByProductArea[productArea]] : [];
  const { areaPermissions, capabilities } = ProductAreaPermissionMap[productArea];
  const unionPermissions: Array<PermissionsUnion> = [...areaPermissions, ...capabilities, ...limitedScopes];
  const currentPermissions = permissionSet.permissions as Array<PermissionsUnion>;

  const permissions = currentPermissions.filter(permission => !unionPermissions.includes(permission));

  return {
    ...permissionSet,
    permissions
  };
}

// Returns a limitation scope based on the given product area and current permissions.
export function getScopeFromProductArea(
  productArea: LimitableProductArea,
  permissionSet: PermissionSetWithRoles
): ScopedPermissionType {
  const { permissions } = permissionSet;
  const { areaPermissions } = ProductAreaPermissionMap[productArea];
  const hasAreaPermission = areaPermissions.every(permission => permissions.includes(permission));

  if (!hasAreaPermission) return ScopedPermissionItem.NO_ACCESS;

  const limitedScope = LimitedScopeByProductArea[productArea];

  const hasLimitedAccessScope = permissionSet.permissions.includes(limitedScope);
  if (hasLimitedAccessScope) return ScopedPermissionItem.LIMITED_ACCESS;

  return ScopedPermissionItem.ACCESS_ALL;
}

// Returns a new permission set for limitable product areas,
// based on the given product area, limitation scope and role.
export function updatePermissionSetForLimitableProductArea(
  permissionSet: PermissionSetWithRoles,
  productArea: LimitableProductArea,
  scope: ScopedPermissionType,
  role: AreaRoleType | undefined
): PermissionSetWithRoles {
  if (scope === ScopedPermissionItem.NO_ACCESS) {
    const cleanedPermissionSet = removePermissionsFromPermissionSetByProductArea(productArea, permissionSet);
    return { ...cleanedPermissionSet };
  }

  const updatedPermissionSet = updatePermissionSetByProductAreaAndRole(productArea, role, permissionSet);
  const updatedPermissions = updatedPermissionSet.permissions;
  const limitedScope = LimitedScopeByProductArea[productArea];
  const permissionsWithoutLimitation = updatedPermissions.filter(permission => permission !== limitedScope);

  if (scope === ScopedPermissionItem.ACCESS_ALL) {
    return { ...updatedPermissionSet, permissions: permissionsWithoutLimitation };
  }

  if (scope === ScopedPermissionItem.LIMITED_ACCESS) {
    return { ...updatedPermissionSet, permissions: [...permissionsWithoutLimitation, limitedScope] };
  }

  return { ...permissionSet };
}
