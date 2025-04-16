/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

export type EntitiesFormFields = {
  selectedIds: Field<string[]>;
};

export type DefaultEntitiesFormFieldValues = {
  [key in keyof EntitiesFormFields]: EntitiesFormFields[key]['value'];
};

export function createEntitiesForm(initValues?: DefaultEntitiesFormFieldValues): MapForm<EntitiesFormFields> {
  return createMapForm<EntitiesFormFields>({
    items: {
      selectedIds: createField({
        value: initValues?.selectedIds ?? []
      })
    }
  });
}
