/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, MapFormItems, Path } from 'formalistic';

interface UseSubFormProps<T extends MapFormItems> {
  form: MapForm<T>;
  path: string[];
  updateForm: (form: MapForm<T>) => void;
}

export default function useSubForm<T extends MapFormItems>({ form, path, updateForm }: UseSubFormProps<T>) {
  const subForm = form.getIn(path as Path<T>);

  const update = (subForm: MapForm<any>) => updateForm(form.updateIn(path as Path<T>, () => subForm));
  return { form: subForm, update };
}
