/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, createMapForm } from 'formalistic';

import {
  getDefaultEntityFields,
  getDefaultIndicatorFields,
  getDefaultScopeFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/createDefaultSloForm';
// eslint-disable-next-line
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { getMaxTimeWindowDurationValue } from 'in-service-levels/utils/time';

function resetScopes(form: SloForm) {
  return form.updateIn(['scope'], () =>
    createMapForm({
      items: getDefaultScopeFields()
    })
  );
}

function resetEntity(form: SloForm) {
  const entityType = form.getIn(['entity', 'type']).value;

  return form.updateIn(['entity'], () =>
    createMapForm({
      items: getDefaultEntityFields(entityType)
    })
  );
}

function resetIndicatorForm(form: SloForm) {
  return form.updateIn(['indicator'], () => createMapForm({ items: getDefaultIndicatorFields() }));
}

function resetIndicatorFormAndPreserveBlueprint(form: SloForm) {
  const blueprintField = form.getIn(['indicator', 'blueprint']);
  const typeField = form.getIn(['indicator', 'type']);

  const isBlueprintCustom = blueprintField.value === 'custom';
  const isIndicatorCustomEventBased = typeField.value === 'customEventBased';

  return resetIndicatorForm(form)
    .updateIn(['indicator', 'blueprint'], () => blueprintField)
    .updateIn(['indicator', 'type'], defaultField => {
      if (isBlueprintCustom && !isIndicatorCustomEventBased) return defaultField.setValue('customEventBased');

      return defaultField;
    });
}

function clampTimeWindowDuration(form: SloForm): Item {
  const unit = form.getIn(['objective', 'durationUnit']).value;

  const oldDuration = form.getIn(['objective', 'duration']);

  const maxDurationForThisUnit = getMaxTimeWindowDurationValue(unit);

  return form.updateIn(['objective', 'duration'], () =>
    oldDuration.setValue(Math.min(oldDuration.value, maxDurationForThisUnit))
  );
}

const formSideEffects = [
  {
    path: ['entity', 'type'],
    effects: [resetEntity, resetScopes, resetIndicatorForm] as EffectFunction[]
  },
  {
    path: ['entity', 'entityId'],
    effects: [resetScopes, resetIndicatorForm] as EffectFunction[]
  },
  {
    path: ['indicator', 'blueprint'],
    effects: [resetIndicatorFormAndPreserveBlueprint] as EffectFunction[]
  },
  {
    path: ['objective', 'durationUnit'],
    effects: [clampTimeWindowDuration] as EffectFunction[]
  }
];

export type SloFormSideEffectsReturnType = (form: Item) => void;

export default function useSloFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): SloFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
