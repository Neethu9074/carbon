import { text } from '@storybook/addon-knobs/react';
import { deepFreeze } from 'in-services/util/object';

export function enrichWithJSONInput(defaultInput = '', map = obj => obj) {
  const jsonString = text('JSON', defaultInput);
  let object;
  try {
    object = JSON.parse(jsonString);
    map(object);
    object = deepFreeze(object);
  } catch (e) {
    object = null;
  }
  return object;
}
