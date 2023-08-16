/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm } from 'formalistic';

import {
  getIndicatorFieldsFromForm,
  getNameTagFieldsFromForm,
  getTimeWindowFormFieldFromForm
} from 'in-service-levels/components/ConfigDialog/createSloForm/createSloFormFromForm';
import {
  getDefaultEntityFields,
  getDefaultScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';

export default function createSloFormFromPreviousForm(previousForm: SloForm): SloForm {
  const entityType = previousForm.getIn(['entity', 'type']).value;

  return createMapForm({
    items: {
      entity: createMapForm({
        items: getDefaultEntityFields(entityType)
      }),
      indicator: createMapForm({
        items: getIndicatorFieldsFromForm(previousForm)
      }),
      scope: createMapForm({
        items: getDefaultScopeFields()
      }),
      timeWindow: createMapForm({
        items: getTimeWindowFormFieldFromForm(previousForm)
      }),
      nameTags: createMapForm({
        items: getNameTagFieldsFromForm(previousForm)
      })
    }
  });
}
