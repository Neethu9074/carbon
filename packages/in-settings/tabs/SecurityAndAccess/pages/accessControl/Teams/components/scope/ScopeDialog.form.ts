/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import { AccessRestriction, RestrictedApplicationFilter } from 'in-types';

export type ScopeFormFields = {
  accessPermissions: Field<AccessRestriction[]>;
  actionFilters: Field<string[]>;
  applications: Field<string[]>;
  businessPerspectives: Field<string[]>;
  infraDfqFilters: Field<string[]>;
  kubernetesClusters: Field<string[]>;
  kubernetesNamesspaces: Field<string[]>;
  logFilters: Field<string[]>;
  mobileApps: Field<string[]>;
  restrictedApplicationFilter: Field<RestrictedApplicationFilter>;
  syntheticCredentials: Field<string[]>;
  syntheticTests: Field<string[]>;
  tagIds: Field<string[]>;
  websites: Field<string[]>;
};

export type DefaultScopeFormFieldValues = {
  [key in keyof ScopeFormFields]: ScopeFormFields[key]['value'];
};

export function createScopeForm(initValues?: DefaultScopeFormFieldValues): MapForm<ScopeFormFields> {
  return createMapForm<ScopeFormFields>({
    items: {
      accessPermissions: createField({
        value: initValues?.accessPermissions ?? []
      }),
      actionFilters: createField({
        value: initValues?.actionFilters ?? []
      }),
      applications: createField({
        value: initValues?.applications ?? []
      }),
      businessPerspectives: createField({
        value: initValues?.businessPerspectives ?? []
      }),
      infraDfqFilters: createField({
        value: initValues?.infraDfqFilters ?? []
      }),
      kubernetesClusters: createField({
        value: initValues?.kubernetesClusters ?? []
      }),
      kubernetesNamesspaces: createField({
        value: initValues?.kubernetesNamesspaces ?? []
      }),
      logFilters: createField({
        value: initValues?.logFilters ?? []
      }),
      mobileApps: createField({
        value: initValues?.mobileApps ?? []
      }),
      restrictedApplicationFilter: createField({
        value: initValues?.restrictedApplicationFilter ?? {}
      }),
      syntheticCredentials: createField({
        value: initValues?.syntheticCredentials ?? []
      }),
      syntheticTests: createField({
        value: initValues?.syntheticTests ?? []
      }),
      tagIds: createField({
        value: initValues?.tagIds ?? []
      }),
      websites: createField({
        value: initValues?.websites ?? []
      })
    }
  });
}
