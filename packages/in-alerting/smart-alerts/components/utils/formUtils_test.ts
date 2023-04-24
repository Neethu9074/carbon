/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createListForm, createMapForm, Item, ListForm, notBlankValidator } from 'formalistic';

import { isCustomPayloadValidOrUntouched } from 'in-alerting/smart-alerts/components/utils/formUtils';

function createTestForm(valid?: boolean, touched?: boolean) {
  return createMapForm().put(
    'customPayloadFields',
    createListForm({
      touched,
      validator: () => (valid ? null : [{ severity: 'error', message: 'some error' }]),
      items: [
        createMapForm({ items: { key: createField({ value: 'key', validator: notBlankValidator }) } }),
        createMapForm({ items: { value: createField({ value: 'value' }) } })
      ]
    })
  );
}

describe('in-alerting/smart-alerts/components/utils/formUtils ::isCustomPayloadValidOrUntouched', () => {
  const emptyForm = createMapForm();

  it('should be valid for an empty emptyForm', () => {
    expect(isCustomPayloadValidOrUntouched(emptyForm)).toBe(true);
  });

  it('should be valid for a valid, untouched form', () => {
    expect(isCustomPayloadValidOrUntouched(createTestForm(true, false))).toBe(true);
  });

  it('should be valid for valid, touched form', () => {
    expect(isCustomPayloadValidOrUntouched(createTestForm(true, true))).toBe(true);
  });

  it('should be valid for invalid, untouched form', () => {
    expect(isCustomPayloadValidOrUntouched(createTestForm(false, false))).toBe(true);
  });

  it('should be INVALID for invalid, touched form', () => {
    expect(isCustomPayloadValidOrUntouched(createTestForm(false, true))).toBe(false);
  });

  it('should be INVALID for valid, touched form with invalid entry', () => {
    const invalidTouchedKeyField = createField({ value: '', validator: notBlankValidator }).setTouched(true);
    const invalidPayloadItem = createMapForm({ items: { key: invalidTouchedKeyField } });
    const withInvalidPayloadItem = createTestForm(true, true).updateIn(['customPayloadFields'], (payloadItems: Item) =>
      (payloadItems as ListForm<any>).push(invalidPayloadItem)
    );

    expect(isCustomPayloadValidOrUntouched(withInvalidPayloadItem)).toBe(false);
  });
});
