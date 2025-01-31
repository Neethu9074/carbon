/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { validateStep } from 'in-alerting/components/AlertingFullScreenTearSheet';

describe('validateStep', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();

  it('should return true if the step is valid', () => {
    // act
    const result = validateStep(form, updateForm, [['severity']]);

    // result
    expect(result).toBe(true);
  });

  it('should return true if the validateIntermediately is empty', () => {
    // act
    const result = validateStep(form, updateForm, []);

    // result
    expect(result).toBe(true);
  });

  it('should return false if the form is empty', () => {
    // act
    const result = validateStep(form, updateForm, [['name']]);

    // result
    expect(result).toBe(false);
  });
});
