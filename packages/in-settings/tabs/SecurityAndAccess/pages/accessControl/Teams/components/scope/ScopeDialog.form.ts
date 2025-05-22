/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, ValidationResult } from 'formalistic';
import { parse } from 'qs';

import { AccessRestriction, RestrictedApplicationFilter } from '@instana/types';

import { t } from 'in-i18n';

export const SCOPE_FORM_ID = 'rbac-scope-form';

export type ScopeFormFields = {
  accessPermissions: Field<AccessRestriction[] | undefined>;
  actionFilters: Field<string[] | undefined>;
  actionTags: Field<string[] | undefined>;
  actionTypes: Field<string[] | undefined>;
  applications: Field<string[] | undefined>;
  businessPerspectives: Field<string[] | undefined>;
  infraDfqFilters: Field<string[] | undefined>;
  kubernetesClusters: Field<string[] | undefined>;
  kubernetesNamespaces: Field<string[] | undefined>;
  logFilters: Field<string[] | undefined>;
  mobileApps: Field<string[] | undefined>;
  restrictedApplicationFilter: Field<RestrictedApplicationFilter | undefined>;
  syntheticCredentials: Field<string[] | undefined>;
  syntheticTests: Field<string[] | undefined>;
  tagIds: Field<string[] | undefined>;
  websites: Field<string[] | undefined>;
};

export type ScopeTableFormFields = Exclude<
  ScopeFormFields,
  'accessPermissions' | 'restrictedApplicationFilter' | 'infraDfqFilters' | 'automationsForm'
>;

export type ScopeFormFieldType = keyof ScopeFormFields;

export type ScopeTableFormFieldType = Exclude<
  ScopeFormFieldType,
  'accessPermissions' | 'restrictedApplicationFilter' | 'infraDfqFilters' | 'automationsForm'
>;

export type DefaultScopeFormFieldValues = {
  [key in keyof ScopeFormFields]: ScopeFormFields[key]['value'];
};

const emptyListValidator = (items: string[], message: string): ValidationResult => {
  if (items.length === 0) {
    return [
      {
        severity: 'error',
        message: message
      }
    ];
  } else {
    return [];
  }
};

const actionTagsValidator = (tags: string[]): ValidationResult => {
  return emptyListValidator(tags, t('in-settings:dialogs.scope.noActionTypeSelectedError'));
};

const actionTypesValidator = (types: string[]): ValidationResult => {
  return emptyListValidator(types, t('in-settings:dialogs.scope.noActionTagSelectedError'));
};

const getFilterValue = (filter: string[] | string) => {
  if (typeof filter === 'string') {
    return [filter];
  } else if (Array.isArray(filter)) {
    return filter;
  }

  return [];
};

export function createScopeForm(initValues?: Partial<DefaultScopeFormFieldValues>): MapForm<ScopeFormFields> {
  // Parse action filter string into action types and action tags
  const { tags = [], type = [] } = parse(
    initValues?.actionFilters && initValues?.actionFilters.length > 0 ? initValues?.actionFilters[0] : '',
    { comma: true }
  ) as {
    tags?: string[] | string;
    type?: string[] | string;
  };

  return createMapForm<ScopeFormFields>({
    items: {
      accessPermissions: createField({
        value: initValues?.accessPermissions ?? undefined
      }),
      actionFilters: createField({
        value: initValues?.actionFilters ?? undefined
      }),
      actionTypes: createField({
        value: getFilterValue(type),
        validator: actionTypesValidator
      }),
      actionTags: createField({
        value: getFilterValue(tags),
        validator: actionTagsValidator
      }),
      applications: createField({
        value: initValues?.applications ?? undefined
      }),
      businessPerspectives: createField({
        value: initValues?.businessPerspectives ?? undefined
      }),
      infraDfqFilters: createField({
        value: initValues?.infraDfqFilters ?? undefined
      }),
      kubernetesClusters: createField({
        value: initValues?.kubernetesClusters ?? undefined
      }),
      kubernetesNamespaces: createField({
        value: initValues?.kubernetesNamespaces ?? undefined
      }),
      logFilters: createField({
        value: initValues?.logFilters ?? undefined
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
    }
  });
}
