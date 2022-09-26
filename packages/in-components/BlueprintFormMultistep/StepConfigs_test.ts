/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

import { isStepInvalid } from 'in-components/BlueprintFormMultistep/StepConfigs';
import { notBlankValidator } from 'in-services/validators/string';

describe('in-components/BlueprintFormMultistep/StepConfigs:isStepInvalid', () => {
  const form = createMapForm({
    items: {
      name: createField({
        value: 'name',
        validator: notBlankValidator
      }),
      empty: createField({
        value: '',
        validator: notBlankValidator
      })
    }
  });

  it('is false for step with no fields to validate', () => {
    expect(isStepInvalid(0, [{ title: '1' }], form)).toBe(false);
    expect(isStepInvalid(0, [{ title: '1', validateIntermediately: [] }], form)).toBe(false);
  });

  it('is false for checking empty field path or valid fields', () =>
    expect(
      isStepInvalid(
        0,
        [
          {
            title: '1',
            validateIntermediately: [[], ['name']]
          }
        ],
        form
      )
    ).toBe(false));

  it('is true for invalid fields', () =>
    expect(
      isStepInvalid(
        0,
        [
          {
            title: '1',
            validateIntermediately: [[], ['empty']]
          }
        ],
        form
      )
    ).toBe(true));
});
