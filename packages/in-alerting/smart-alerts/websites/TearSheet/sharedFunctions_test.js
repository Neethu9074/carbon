/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  duplicateAlertConfig,
  deriveAlertType,
  getButtonLabel
} from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import { customEvent, slowness, specificJsError } from 'in-alerting/smart-alerts/websites/constants';

describe('duplicateAlertConfig', () => {
  it('should return a new object with duplicateFrom property set to the id of the original config', () => {
    const originalConfig = {
      id: '123',
      name: 'Original Alert'
    };
    const expectedResult = {
      ...originalConfig,
      duplicateFrom: '123',
      name: '(Copy of) Original Alert'
    };
    expect(duplicateAlertConfig(originalConfig)).toEqual(expectedResult);
  });
});

// Assisted by watsonx Code Assistant
describe('deriveAlertType', () => {
  it('should return specificJsError if errorId is not blank', () => {
    expect(deriveAlertType('errorId', undefined)).toBe(specificJsError);
  });

  it('should return customEvent if customEventName is not blank', () => {
    expect(deriveAlertType(undefined, 'customEventName')).toBe(customEvent);
  });

  it('should return slowness if both errorId and customEventName are blank', () => {
    expect(deriveAlertType(undefined, undefined)).toBe(slowness);
  });
});

// Assisted by watsonx Code Assistant
describe('getButtonLabel', () => {
  it('should return "Save" when editMode is true', () => {
    expect(getButtonLabel(true)).toBe('Save');
  });

  it('should return "Create" when editMode is false', () => {
    expect(getButtonLabel(false)).toBe('Create');
  });

  it('should return "Create" when editMode is not provided', () => {
    expect(getButtonLabel()).toBe('Create');
  });
});
