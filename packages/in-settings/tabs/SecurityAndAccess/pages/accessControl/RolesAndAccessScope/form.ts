/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, Item, MapForm, notBlankValidator, ValidationResult } from 'formalistic';
import { isEmpty, isUndefined } from 'lodash';
import { parse } from 'qs';

import { PermissionSet, ScopeBinding } from '@instana/types';

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
import { GroupApiResult } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/types';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { Capability, CapabilityType, PermissionsUnion } from 'in-stores/permission';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function getField<T>(form: MapForm<any>, path: string | string[]): Field<T> | undefined {
  // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
  const item = Array.isArray(path) ? form.getIn(path) : form.get(path);
  return item as Field<T> | undefined;
}

export function contributionFilterNameValidator(name: string | null | undefined): ValidationResult {
  if (isBlank(name)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:PermissionSection.contributionFilter_name_mayNotBeBlank')
      }
    ];
  }

  if (name!.length > 128) {
    return [
      {
        severity: 'error',
        message: t('in-settings:PermissionSection.contributionFilter_name_mustNotBeLargerThan128Characters')
      }
    ];
  }

  return null;
}

export function dfqFilterValidator(permissionSet: PermissionSet | undefined): ValidationResult {
  if (isUndefined(permissionSet?.infraDfqFilter.scopeId)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:PermissionSection.infrastructureDfq_mayNotBeBlank')
      }
    ];
  }
  return null;
}

export function actionFilterValidator(actionFilter: ScopeBinding | undefined): ValidationResult {
  const scopeId = actionFilter?.scopeId;
  if (scopeId == undefined) return null;
  const { tags = [], type = [] } = parse(scopeId, { comma: true }) as {
    tags?: string[] | string;
    type?: string[] | string;
  };
  if (isEmpty(tags) && isEmpty(type)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:PermissionSection.automationFilter_mayNotBeBlank')
      }
    ];
  }
  return null;
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
  const applicationConfig = getDefaultApplicationConfig(name);
  const applicationScope = permissionSet?.restrictedApplicationFilter?.scope || applicationConfig.scope;
  const actionFilter = permissionSet?.actionFilter || { scopeId: undefined, scopeRoleId: '-1' };
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
        value: label,
        validator: contributionFilterNameValidator
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
        value: permissionSet,
        validator: dfqFilterValidator
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
    )
    .put('actionFilter', createField({ value: actionFilter, validator: actionFilterValidator }));
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

export const getDefaultApplicationConfig = (applicationContributionfilterName: string | undefined) => {
  return {
    label: applicationContributionfilterName,
    scope: 'INCLUDE_NO_DOWNSTREAM',
    tagFilterExpression: []
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
