/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';

import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-hooks/useFormSideEffects';
import { sourcePath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { WidgetSource } from 'in-custom-dashboards/widgets/Table/types';
import { createForm } from 'in-custom-dashboards/widgets/Table/form';

// @ts-expect-error not fully matching EffectFunction
const handleDataSourceChange: EffectFunction = (form: MapForm<any>): Item => {
  const sourceField = form.get('source') as Field<WidgetSource>;
  const source = sourceField?.value;
  // re-create a new form for given data source:
  const updatedForm = createForm({ source });
  return updatedForm;
};

const formSideEffects = [
  {
    path: [sourcePath],
    effects: [handleDataSourceChange]
  }
];

export function useDataSourceFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT]
  });
}
