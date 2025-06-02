/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, ValidationMessage, ValidationResult } from 'formalistic';
import { parse } from 'qs';

import { AccessRestriction, ApiApplicationScope, RestrictedApplicationFilter, TeamScope } from '@instana/types';
import { t } from '@instana/i18n-react';

import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { LimitedAccessScope } from 'in-stores/permission';
import { isBlank } from 'in-services/util/string';

export const SCOPE_FORM_ID = 'rbac-scope-form';

export type ScopeFormFields = {
  accessPermissions: Field<AccessRestriction[] | undefined>;
  actionFilter: Field<string | undefined>;
  actionTags: Field<string[] | undefined>;
  actionTypes: Field<string[] | undefined>;
  applicationFilterForm: ApplicationFilterForm;
  applications: Field<string[] | undefined>;
  businessPerspectives: Field<string[] | undefined>;
  infrastructureForm: InfrastructureForm;
  kubernetesClusters: Field<string[] | undefined>;
  kubernetesNamespaces: Field<string[] | undefined>;
  logFilter: Field<string | undefined>;
  mobileApps: Field<string[] | undefined>;
  restrictedApplicationFilter: Field<RestrictedApplicationFilter | undefined>;
  syntheticCredentials: Field<string[] | undefined>;
  syntheticTests: Field<string[] | undefined>;
  tagIds: Field<string[] | undefined>;
  websites: Field<string[] | undefined>;
};

export type ScopeFormFieldType = keyof ScopeFormFields;

export type ScopeTableFormFieldType = Extract<
  ScopeFormFieldType,
  | 'applications'
  | 'businessPerspectives'
  | 'kubernetesClusters'
  | 'kubernetesNamespaces'
  | 'mobileApps'
  | 'syntheticCredentials'
  | 'syntheticTests'
  | 'tagIds'
  | 'websites'
>;

const scopeValidator = ({ accessPermissions, actionTags, actionTypes }: ScopeFormFields): ValidationResult => {
  let errors: ValidationMessage[] = [];

  // Validate automation action type and tag filter
  if (accessPermissions?.value?.includes(LimitedAccessScope.LIMITED_AUTOMATION_SCOPE)) {
    if (actionTags?.value?.length === 0) {
      errors.push({
        severity: 'error',
        message: t('in-settings:dialogs.scope.noActionTagSelectedError'),
        path: 'actionTags'
      });
    }
    if (actionTypes?.value?.length === 0) {
      errors.push({
        severity: 'error',
        message: t('in-settings:dialogs.scope.noActionTypeSelectedError'),
        path: 'actionTypes'
      });
    }
  }

  return errors;
};

const getFilterValue = (filter: string[] | string) => {
  if (typeof filter === 'string') {
    return [filter];
  } else if (Array.isArray(filter)) {
    return filter;
  }

  return [];
};

export const parseActionFilter = (actionFilter: string) => {
  const { tags = [], type = [] } = parse(actionFilter ?? '', { comma: true }) as {
    tags?: string[] | string;
    type?: string[] | string;
  };

  return { actionTags: getFilterValue(tags), actionTypes: getFilterValue(type) };
};

type InfrastructureFormItems = {
  isDfqEnabled: Field<boolean>;
  infraDfqFilter: Field<string | undefined>;
};

type InfrastructureForm = MapForm<InfrastructureFormItems>;

function infraDfqFiltersValidator({ isDfqEnabled, infraDfqFilter }: InfrastructureFormItems): ValidationResult {
  if (isDfqEnabled.value) {
    if (isBlank(infraDfqFilter?.value))
      return [
        {
          severity: 'error',
          message: t('in-settings:PermissionSection.infrastructureDfq_mayNotBeBlank')
        }
      ];
  }
  return null;
}

export type ApplicationFilterFormItems = {
  isFilterEnabled: Field<boolean>;
  filterExpression: Field<FormModelElement[] | undefined>;
  filterName: Field<string | undefined>;
  scope: Field<ApiApplicationScope>;
};

export type ApplicationFilterForm = MapForm<ApplicationFilterFormItems>;

export function createScopeForm(initValues?: TeamScope): MapForm<ScopeFormFields> {
  // Parse action filter string into action types and action tags
  const { actionTags, actionTypes } = parseActionFilter(initValues?.actionFilter ?? '');

  return createMapForm<ScopeFormFields>({
    items: {
      accessPermissions: createField({
        value: initValues?.accessPermissions ?? undefined
      }),
      actionFilter: createField({
        value: initValues?.actionFilter ?? undefined
      }),
      actionTags: createField({
        value: actionTags
      }),
      actionTypes: createField({
        value: actionTypes
      }),
      applicationFilterForm: createMapForm<ApplicationFilterFormItems>({
        items: {
          isFilterEnabled: createField({
            value: !!initValues?.restrictedApplicationFilter?.label
          }),
          filterExpression: createField({
            value: initValues?.restrictedApplicationFilter?.tagFilterExpression
              ? fromBackendModel(initValues?.restrictedApplicationFilter?.tagFilterExpression)
              : fromBackendModel(emptyTagFilterExpression)
          }),
          filterName: createField({
            value: initValues?.restrictedApplicationFilter?.label ?? ''
          }),
          scope: createField({
            value: initValues?.restrictedApplicationFilter?.scope ?? 'INCLUDE_NO_DOWNSTREAM'
          })
        }
      }),
      applications: createField({
        value: initValues?.applications ?? undefined
      }),
      businessPerspectives: createField({
        value: initValues?.businessPerspectives ?? undefined
      }),
      infrastructureForm: createMapForm<InfrastructureFormItems>({
        validator: infraDfqFiltersValidator,
        items: {
          isDfqEnabled: createField({
            value: !!initValues?.infraDfqFilter
          }),
          infraDfqFilter: createField({
            value: initValues?.infraDfqFilter ?? undefined
          })
        }
      }),
      kubernetesClusters: createField({
        value: initValues?.kubernetesClusters ?? undefined
      }),
      kubernetesNamespaces: createField({
        value: initValues?.kubernetesNamespaces ?? undefined
      }),
      logFilter: createField({
        value: initValues?.logFilter ?? undefined
      }),
      mobileApps: createField({
        value: initValues?.mobileApps ?? undefined
      }),
      restrictedApplicationFilter: createField({
        value: initValues?.restrictedApplicationFilter ?? undefined
      }),
      syntheticCredentials: createField({
        value: initValues?.syntheticCredentials ?? undefined
      }),
      syntheticTests: createField({
        value: initValues?.syntheticTests ?? undefined
      }),
      tagIds: createField({
        value: initValues?.tagIds ?? undefined
      }),
      websites: createField({
        value: initValues?.websites ?? undefined
      })
    },
    validator: scopeValidator
  });
}
