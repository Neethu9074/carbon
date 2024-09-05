/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Field, createMapForm, notBlankValidator, createField } from 'formalistic';
import { useState } from 'react';

type PolicyFormItems = {
  name: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
};

export type PolicyForm = MapForm<PolicyFormItems>;

function createPolicyForm() {
  const form: PolicyForm = createMapForm({
    items: {
      name: createField({
        value: '',
        validator: notBlankValidator
      }),
      description: createField({
        value: '',
        validator: notBlankValidator
      }),
      tags: createField<string[]>({
        value: []
      })
    }
  });
  return form;
}

export default function usePolicyForm() {
  return useState(createPolicyForm());
}
