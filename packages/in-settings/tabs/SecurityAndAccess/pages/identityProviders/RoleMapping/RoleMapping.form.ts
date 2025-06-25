/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

export type RoleMappingFormFields = {
  restrictEmptyIdpRoles: Field<boolean>;
};

export const createRoleMappingForm = (restrictEmptyIdpRoles: boolean | undefined): MapForm<RoleMappingFormFields> => {
  return createMapForm<RoleMappingFormFields>({
    items: {
      restrictEmptyIdpRoles: createField({
        value: restrictEmptyIdpRoles ?? false
      })
    }
  });
};
