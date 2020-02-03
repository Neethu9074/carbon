import { createField, notBlankValidator } from 'formalistic';

export function createForm(savedState) {
  return createField({
    value: savedState || '',
    validator: notBlankValidator
  });
}
