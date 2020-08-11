import { createMapForm, notBlankValidator, createField } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { numericValidator } from 'in-services/validators/number';
import { demo } from 'in-custom-dashboards/widgets/Slo';

export const SliConfigId = 'sliConfigId';
export const SloTarget = 'slo';
export const SloApName = 'apName';

export function createForm(oldSavedState) {
  const savedState = oldSavedState ?? {
    ...demo
  };

  let form = createMapForm();

  form = form.put(
    SloApName,
    createField({
      value: savedState[SloApName] ?? demo[SloApName]
    })
  );
  form = form.put(
    SloTarget,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, numericValidator),
      value: savedState[SloTarget] ?? demo[SloTarget]
    })
  );
  form = form.put(
    SliConfigId,
    createField({
      validator: composeAndShortCircuitOnError(notUndefinedValidator, notBlankValidator),
      value: savedState[SliConfigId]
    })
  );
  return form;
}
