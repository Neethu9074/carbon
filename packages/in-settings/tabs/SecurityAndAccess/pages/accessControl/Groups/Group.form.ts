/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';
import { isEmpty, isUndefined } from 'lodash';
import { parse } from 'qs';

import { ApiApplicationScope, ApiGroup, Member, PermissionSet, ScopeBinding } from '@instana/types';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { createEmptyPermissionSet, getInitValue } from 'in-settings/utils/form';
import { emptyObject } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';
import {
  AreaRoleWithCustomType,
  ProductArea,
  ScopedPermissionItem,
  ScopeRoles
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import {
  getAreaRoleFromPermissionSet,
  getDefaultApplicationConfig,
  getScopeFromProductArea,
  removeAdditionalPermissionsForNoaccess
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import { deepFreeze } from 'in-services/util/object';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';

interface InitialRefs {
  /**
   * applicationRole is needed to specifically check if the role has changed
   * from CUSTOM to something else.
   **/
  applicationRole?: AreaRoleWithCustomType;
  /**
   * contributorApplicationIds is needed to check wether the number of
   * application has changed.
   **/
  contributorApplicationIds: ScopeBinding[];
}

export type GroupFormFields = {
  actionFilter: Field<ScopeBinding>;
  id: Field<string>;
  label: Field<string>;
  members: Field<Member[]>;
  name: Field<string>;
  permissionSet: Field<PermissionSet>;
  scope: Field<ApiApplicationScope>;
  tagFilterExpression: Field<FormModelElement[]>;
  /**
   * InitialRefs should only be defined when the form is created. Their
   * values are supposed to never change afterwards.
   **/
  initialRef: Field<Readonly<InitialRefs>>;
};

// We skip initialRef as a prop for the default form fields as it is supposed
// to be implicitly set by the createGroupForm function only
type DefaultGroupFormFields = Omit<GroupFormFields, 'initialRef'>;

export type DefaultGroupFormFieldValues = {
  [key in keyof DefaultGroupFormFields]: DefaultGroupFormFields[key]['value'];
};

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

export function filterContributorApplications(scope: ScopeBinding[]): ScopeBinding[] {
  return scope.filter(scopeBinding => scopeBinding.scopeRoleId === ScopeRoles.Contributor);
}

export function hasContributorRoleChanged(form: MapForm<GroupFormFields>): boolean {
  const { applicationRole: initialApplicationRole } = form.get('initialRef').value;
  const currentApplicationRole = getAreaRoleFromPermissionSet(ProductArea.APPLICATION, form.get('permissionSet').value);
  return initialApplicationRole !== currentApplicationRole;
}

export function createGroupForm(initValues?: DefaultGroupFormFieldValues): MapForm<GroupFormFields> {
  return createMapForm({
    items: {
      actionFilter: createField({ value: getInitValue(initValues, 'actionFilter', emptyObject) }),
      id: createField({ value: getInitValue(initValues, 'id', '') }),
      label: createField({ value: getInitValue(initValues, 'label', '') }),
      members: createField({ value: getInitValue(initValues, 'members', []) }),
      name: createField({ value: getInitValue(initValues, 'name', '') }),
      permissionSet: createField({ value: getInitValue(initValues, 'permissionSet', createEmptyPermissionSet()) }),
      scope: createField({ value: getInitValue(initValues, 'scope', 'INCLUDE_NO_DOWNSTREAM') }),
      tagFilterExpression: createField({
        value: getInitValue(initValues, 'tagFilterExpression', fromBackendModel(emptyTagFilterExpression))
      }),
      initialRef: createField<Readonly<InitialRefs>>({
        value: deepFreeze({
          applicationRole: getAreaRoleFromPermissionSet(ProductArea.APPLICATION, initValues?.permissionSet),
          contributorApplicationIds: filterContributorApplications(initValues?.permissionSet.applicationIds ?? [])
        } as const)
      })
    }
  });
}

export function getInitValuesFromPartialObject(
  partialValues?: Partial<DefaultGroupFormFieldValues>
): DefaultGroupFormFieldValues {
  const initValues: DefaultGroupFormFieldValues = createGroupForm().toJS();

  return Object.keys(initValues).reduce((previousValues, currentKey) => {
    const fieldName = currentKey as keyof DefaultGroupFormFieldValues;
    return {
      ...previousValues,
      [fieldName]: partialValues?.[fieldName] ?? initValues[fieldName]
    };
  }, initValues);
}

interface CreateGroupFormFromApiResultProps {
  form?: MapForm<GroupFormFields>;
  group?: Partial<ApiGroup>;
}

export function createGroupFormFromApiResult({
  form = createGroupForm(),
  group = {}
}: CreateGroupFormFromApiResultProps) {
  const { id, name, members, permissionSet } = group;
  const applicationConfig = getDefaultApplicationConfig(name);
  const scope = permissionSet?.restrictedApplicationFilter?.scope || applicationConfig.scope;
  const actionScope = permissionSet && getScopeFromProductArea(ProductArea.AUTOMATION, permissionSet);
  const actionFilter = (actionScope &&
    actionScope === ScopedPermissionItem.LIMITED_ACCESS &&
    permissionSet?.actionFilter) || { scopeId: undefined, scopeRoleId: '-1' };
  const tagFilterExpression =
    fromBackendModel(permissionSet?.restrictedApplicationFilter?.tagFilterExpression) ||
    applicationConfig.tagFilterExpression;
  return createGroupForm(
    getInitValuesFromPartialObject({
      ...form.toJS(),
      actionFilter,
      id,
      members,
      name,
      permissionSet,
      scope,
      tagFilterExpression
    })
  );
}

function getPermissionSetWithApFilters(permissionSet: PermissionSet, form: MapForm<GroupFormFields>): PermissionSet {
  const backendModel = toBackendQueryModel(form.get('tagFilterExpression').value, true);
  const contributionFilterConfig = {
    tagFilterExpression: backendModel,
    scope: form.get('scope')?.value,
    label: form.get('label')?.value?.trim()
  };
  const permissionSetWithFilter = {
    ...permissionSet,
    ['restrictedApplicationFilter']: contributionFilterConfig
  };
  return permissionSetWithFilter;
}

export function formToApiGroup(form: MapForm<GroupFormFields>): ApiGroup {
  const permissionSet = form.get('permissionSet').value;
  const actionFilter = form.get('actionFilter').value;
  const isRestrictedFilter = form.get('tagFilterExpression').value?.length > 0;

  const cleanPermissionSet = removeAdditionalPermissionsForNoaccess(
    [
      ProductArea.WEBSITE,
      ProductArea.MOBILE_APP,
      ProductArea.APPLICATION,
      ProductArea.INFRASTRUCTURE,
      ProductArea.SYNTHETICS,
      ProductArea.AUTOMATION
    ],
    {
      ...permissionSet,
      actionFilter
    }
  );

  return {
    id: form.get('id').value,
    name: form.get('name').value,
    members: form.get('members').value,
    permissionSet: isRestrictedFilter ? getPermissionSetWithApFilters(cleanPermissionSet, form) : cleanPermissionSet
  };
}
