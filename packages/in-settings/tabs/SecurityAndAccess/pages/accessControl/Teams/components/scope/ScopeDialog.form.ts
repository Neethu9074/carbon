/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import { AccessRestriction, RestrictedApplicationFilter } from 'in-types';

export const SCOPE_FORM_ID = 'rbac-scope-form';

export type ScopeFormFields = {
  accessPermissions: Field<AccessRestriction[] | undefined>;
  actionFilters: Field<string[] | undefined>;
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

export type ScopeTableFormFields = Exclude<ScopeFormFields, 'accessPermissions' | 'restrictedApplicationFilter'>;

export type ScopeFormFieldType = keyof ScopeFormFields;

export type ScopeTableFormFieldType = Exclude<ScopeFormFieldType, 'accessPermissions' | 'restrictedApplicationFilter'>;

export type DefaultScopeFormFieldValues = {
  [key in keyof ScopeFormFields]: ScopeFormFields[key]['value'];
};

export function createScopeForm(initValues?: Partial<DefaultScopeFormFieldValues>): MapForm<ScopeFormFields> {
  return createMapForm<ScopeFormFields>({
    items: {
      accessPermissions: createField({
        value: initValues?.accessPermissions ?? undefined
      }),
      actionFilters: createField({
        value: initValues?.actionFilters ?? undefined
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
