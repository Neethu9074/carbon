/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item, MapForm } from 'formalistic';

import { ApplicationConfig, PermissionSet } from '@instana/types';

import {
  AreaRole,
  AreaRoleWithContributor,
  AreaRoleWithCustomType,
  infrastructureOtherCapabilities,
  LimitableProductArea,
  ProductArea,
  ProductAreaPermissionMap,
  ScopedPermissionItem,
  ScopedPermissionType,
  syntheticAdditionalOwnerCapabilities,
  syntheticViewCapabilities
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { Capability, CapabilityType, PermissionsUnion } from 'in-stores/permission';
import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import {
  createGroupFormFromApiResult,
  GroupFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group.form';
import { GroupApiResult } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';

export function getField<T>(form: MapForm<any>, path: string | string[]): Field<T> | undefined {
  // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
  const item = Array.isArray(path) ? form.getIn(path) : form.get(path);
  return item as Field<T> | undefined;
}

export function updateFormField<T>(
  form: MapForm<any>,
  path: string | Array<string>,
  value: T,
  isTouched = false
): MapForm<any> {
  const pathArr = typeof path === 'string' ? [path] : path;
  return form.updateIn(pathArr as any, field => setFieldValue<T>(field, value, isTouched));
}

export function setFieldValue<T>(field: Item, value: T, isTouched = false): Field<T> {
  const updatedField = (field as Field<T>).setValue(value);
  if (!isTouched) return updatedField;
  return updatedField.setTouched(true);
}

export function createForm(form?: MapForm<GroupFormFields>, apiResult?: GroupApiResult) {
  return createGroupFormFromApiResult({ form, group: apiResult?.result.group });
}

// Returns the AreaRole that matches the specified permissions
// in a permission set for a given product area
export function getAreaRoleFromPermissionSet(
  productArea: LimitableProductArea,
  permissionSet?: PermissionSet
): AreaRoleWithCustomType | undefined {
  if (!permissionSet) return;

  const { capabilities } = ProductAreaPermissionMap[productArea];

  if (capabilities?.length > 0) {
    const hasAllCapabilities = capabilities.every(permission => permissionSet.permissions.includes(permission));

    // Contributor role is only available for Application
    if (productArea === ProductArea.APPLICATION && permissionSet.restrictedApplicationFilter) {
      return AreaRoleWithContributor.CONTRIBUTOR;
    }
    if (hasAllCapabilities) return AreaRole.OWNER;

    const hasSomeCapabilities = capabilities.some(permission => permissionSet.permissions.includes(permission));

    if (hasSomeCapabilities) return 'CUSTOM';
  }

  return AreaRole.VIEWER;
}

// Returns a limitation scope based on the given product area and current permissions.
export function getScopeFromProductArea(
  productArea: LimitableProductArea,
  permissionSet: PermissionSet
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
  permissionSet: PermissionSet,
  productArea: LimitableProductArea,
  scope: ScopedPermissionType,
  role: AreaRoleWithCustomType | undefined = undefined
): PermissionSet {
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
  role: AreaRoleWithCustomType | undefined,
  permissions: string[]
): string[] {
  let newPermissions = permissions;

  // as starting with clean permissions for the area
  if (role === AreaRole.OWNER) {
    const { capabilities } = ProductAreaPermissionMap[productArea];
    newPermissions.push(...capabilities);
  } else if (
    role === AreaRole.VIEWER &&
    productArea == ProductArea.SYNTHETICS &&
    !newPermissions.includes(Capability.CAN_VIEW_SYNTHETIC_TESTS)
  ) {
    newPermissions.push(...syntheticViewCapabilities);
  }

  return newPermissions;
}

export const getDefaultApplicationConfig = (
  applicationContributionfilterName: string | undefined
): Pick<ApplicationConfig, 'label' | 'scope' | 'tagFilterExpression'> => {
  return {
    label: applicationContributionfilterName ?? '',
    scope: 'INCLUDE_NO_DOWNSTREAM',
    tagFilterExpression: getEmptyTagFilterExpression()
  };
};

export const removeAdditionalPermissionsForNoaccess = (
  productAreas: LimitableProductArea[],
  permissionSet: PermissionSet
) => {
  let permissions = permissionSet.permissions as PermissionsUnion[];

  productAreas.forEach(productArea => {
    const limitation = getScopeFromProductArea(productArea, permissionSet);
    if (limitation === ScopedPermissionItem.NO_ACCESS) {
      permissions = permissions.filter(
        permission => !ProductAreaPermissionMap[productArea]?.additionalCapabilities?.includes(permission)
      );
    } else if (productArea === ProductArea.SYNTHETICS) {
      //The additional Synthetic permissions set at owner's role should be removed
      const role = getAreaRoleFromPermissionSet(productArea, permissionSet);
      if (role === AreaRole.VIEWER) {
        permissions = permissions.filter(
          permission =>
            permission === Capability.CAN_CONFIGURE_GLOBAL_SYNTHETIC_SMART_ALERTS ||
            !syntheticAdditionalOwnerCapabilities?.includes(permission as CapabilityType)
        );
      }
    } else if (productArea === ProductArea.INFRASTRUCTURE) {
      //The additional Infrastructure permissions set at limited scope should be removed
      if (limitation === ScopedPermissionItem.LIMITED_ACCESS) {
        permissions = permissions.filter(
          permission => !infrastructureOtherCapabilities?.includes(permission as CapabilityType)
        );
      }
    }
  });

  return { ...permissionSet, permissions };
};
