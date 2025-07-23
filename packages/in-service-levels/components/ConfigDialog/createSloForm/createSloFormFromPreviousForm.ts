/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm } from 'formalistic';

import {
  getDefaultEntityFields,
  getDefaultObjectiveFields,
  getDefaultScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import {
  getIndicatorFieldsFromForm,
  getNameTagFieldsFromForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import {
  indicatorFormValidator,
  timeWindowValidator
} from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import type { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';

export default function createSloFormFromPreviousForm(previousForm: SloForm): SloForm {
  const entityType = previousForm.getIn(['entity', 'type']).value;

  return createMapForm({
    items: {
      entity: createMapForm({
        items: getDefaultEntityFields(entityType)
      }),
      indicator: createMapForm({
        items: getIndicatorFieldsFromForm(previousForm),
        validator: indicatorFormValidator
      }),
      scope: createMapForm({
        items: getDefaultScopeFields()
      }),
      objective: createMapForm({
        items: getDefaultObjectiveFields(),
        validator: timeWindowValidator
      }),
      nameTags: createMapForm({
        items: getNameTagFieldsFromForm(previousForm)
      })
    }
  });
}
