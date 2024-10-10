/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, MapFormItems, Path } from 'formalistic';

interface useFormFieldProps<I extends MapFormItems> {
  form: MapForm<I>;
  path: string[];
  updateForm: (form: MapForm<I>) => void;
}

export default function useFormField<T extends string | boolean, I extends MapFormItems = any>({
  form,
  path,
  updateForm
}: useFormFieldProps<I>) {
  const field: Field<T> = form.getIn(path as Path<I>);

  const update = (updater: (item: Field<T>) => Field<string>) => updateForm(form.updateIn(path as Path<I>, updater));
  const change = (newValue: T) =>
    updateForm(form.updateIn(path as Path<I>, (field: Field<T>) => field.setValue(newValue).setTouched(true)));
  return { form: field, update, change };
}
