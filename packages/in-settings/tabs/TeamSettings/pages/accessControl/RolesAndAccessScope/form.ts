/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, Item, MapForm, notBlankValidator } from 'formalistic';

import { PermissionSet } from '@instana/types';

import {
  AreaRole,
  AreaRoleWithContributor,
  AreaRoleWithContributorType,
  AreaRoleWithCustomType,
  LimitableProductArea,
  ProductArea,
  ProductAreaPermissionMap,
  ScopedPermissionItem,
  ScopedPermissionType
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { GroupApiResult } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/types';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import { Capability, PermissionsUnion } from 'in-stores/permission';

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

export function createForm(form = createMapForm(), apiResult?: GroupApiResult) {
  const { id, name, members, permissionSet } = apiResult?.result.group || {};

  if (!applicationContributionFilterEnabled) {
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
  } else {
    return createFilterForm(form, apiResult);
  }
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

    if (hasAllCapabilities && permissionSet.restrictedApplicationFilter) {
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
  role: AreaRoleWithCustomType | AreaRoleWithContributorType | undefined = undefined
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
  role: AreaRoleWithCustomType | AreaRoleWithContributorType | undefined,
  permissions: string[]
): string[] {
  //The additional Synthetic permissions set at owner's role should be removed
  let newPermissions = permissions;
  if (productArea == ProductArea.SYNTHETICS) {
    newPermissions = permissions.filter(aPermission => {
      return (
        aPermission !== Capability.CAN_CONFIGURE_SYNTHETIC_LOCATIONS &&
        aPermission !== Capability.CAN_USE_SYNTHETIC_CREDENTIALS &&
        aPermission !== Capability.CAN_CONFIGURE_SYNTHETIC_CREDENTIALS
      );
    });
  }
  // as starting with clean permissions for the area
  if (
    role === AreaRole.OWNER ||
    (role === AreaRoleWithContributor.CONTRIBUTOR && productArea == ProductArea.APPLICATION)
  ) {
    const { capabilities } = ProductAreaPermissionMap[productArea];
    newPermissions.push(...capabilities);
  } else if (role === AreaRole.VIEWER && productArea == ProductArea.SYNTHETICS) {
    const syntheticViewPermissions = [
      Capability.CAN_VIEW_SYNTHETIC_TESTS,
      Capability.CAN_VIEW_SYNTHETIC_TEST_RESULTS,
      Capability.CAN_VIEW_SYNTHETIC_LOCATIONS
    ];
    newPermissions.push(...syntheticViewPermissions);
  }

  return newPermissions;
}

function createFilterForm(form = createMapForm(), apiResult?: GroupApiResult) {
  const { id, name, members, permissionSet } = apiResult?.result.group || {};
  const applicationConfig = getDefaultApplicationConfig(name);
  const applicationScope = permissionSet?.restrictedApplicationFilter?.scope || applicationConfig.scope;
  const label = permissionSet?.restrictedApplicationFilter?.label || applicationConfig?.label;
  const tagFilterExpression =
    fromBackendModel(permissionSet?.restrictedApplicationFilter?.tagFilterExpression) ||
    applicationConfig.tagFilterExpression;
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
      'label',
      createField({
        value: label
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
    )
    .put(
      'scope',
      createField({
        value: applicationScope
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: tagFilterExpression
      })
    );
}

export const getDefaultApplicationConfig = (applicationContributionfilterName: string | undefined) => {
  return {
    label: applicationContributionfilterName,
    scope: 'INCLUDE_NO_DOWNSTREAM',
    tagFilterExpression: []
  };
};
