/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm, notBlankValidator } from 'formalistic';

import { IdpGroupMapping } from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';

export type RoleMappingFields = {
  id: Field<string | null>;
  key: Field<string>;
  value: Field<string>;
  groupId: Field<string>;
  teamId: Field<string | null>;
};

export function createMappingRuleForm(initValues?: Partial<IdpGroupMapping>): MapForm<RoleMappingFields> {
  return createMapForm<RoleMappingFields>({
    items: {
      id: createField({
        value: initValues?.id ?? null
      }),
      key: createField({
        value: initValues?.key ?? '',
        validator: notBlankValidator
      }),
      value: createField({
        value: initValues?.value ?? '',
        validator: notBlankValidator
      }),
      groupId: createField({
        value: initValues?.groupId ?? '',
        validator: notBlankValidator
      }),
      teamId: createField({
        value: initValues?.teamId ?? null
      })
    }
  });
}
