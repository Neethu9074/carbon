import { createMapForm, notBlankValidator, createField } from 'formalistic';

export function createForm() {
  return createMapForm().put(
    'type',
    createField({
      // Not configurable for some time
      value: 'TIME_SERIES',
      validator: notBlankValidator
    })
  );
}
