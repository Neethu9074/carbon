/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm } from 'formalistic';

import {
  getDefaultEntityFields,
  getDefaultIndicatorFields,
  getDefaultScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
import { createIndicatorThresholdField } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import { indicatorFormValidator } from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { getMaxTimeWindowDurationValue } from 'in-service-levels/utils/time';

function resetScopes(form: SloForm): SloForm {
  return form.updateIn(['scope'], () =>
    createMapForm({
      items: getDefaultScopeFields()
    })
  );
}

function resetEntity(form: SloForm): SloForm {
  const entityType = form.getIn(['entity', 'type']).value;

  return form.updateIn(['entity'], () =>
    createMapForm({
      items: getDefaultEntityFields(entityType)
    })
  );
}

function resetIndicatorForm(form: SloForm): SloForm {
  return form.updateIn(['indicator'], () =>
    createMapForm({
      items: getDefaultIndicatorFields(),
      validator: indicatorFormValidator
    })
  );
}

function resetIndicatorFormAndPreserveBlueprint(form: SloForm) {
  const blueprintField = form.getIn(['indicator', 'blueprint']);

  return resetIndicatorForm(form)
    .updateIn(['indicator', 'blueprint'], () => blueprintField)
    .updateIn(['indicator', 'type'], defaultField => defaultField);
}

function clampTimeWindowDuration(form: SloForm): SloForm {
  const unit = form.getIn(['objective', 'durationUnit']).value;

  const oldDuration = form.getIn(['objective', 'duration']);

  const maxDurationForThisUnit = getMaxTimeWindowDurationValue(unit);

  return form.updateIn(['objective', 'duration'], () =>
    oldDuration.setValue(Math.min(oldDuration.value, maxDurationForThisUnit))
  );
}

function updateIndicatorThresholdValidator(form: SloForm): SloForm {
  const blueprint = form.getIn(['indicator', 'blueprint']).value;
  const type = form.getIn(['indicator', 'type']).value;
  return form.updateIn(['indicator', 'threshold'], field => {
    return createIndicatorThresholdField({
      value: field.value,
      touched: field.touched,
      blueprint,
      indicatorType: type
    });
  });
}

const formSideEffects: Effect<SloForm>[] = [
  {
    path: ['entity', 'type'],
    effects: [resetEntity, resetScopes, resetIndicatorForm]
  },
  {
    path: ['entity', 'entityIds'],
    effects: [resetScopes, resetIndicatorForm]
  },
  {
    path: ['indicator', 'blueprint'],
    effects: [resetIndicatorFormAndPreserveBlueprint, updateIndicatorThresholdValidator]
  },
  {
    path: ['indicator', 'type'],
    effects: [updateIndicatorThresholdValidator]
  },
  {
    path: ['objective', 'durationUnit'],
    effects: [clampTimeWindowDuration]
  }
];

export type SloFormSideEffectsReturnType = (form: SloForm) => void;

export default function useSloFormSideEffects(
  form: SloForm,
  setForm: (field: SloForm) => void
): SloFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
