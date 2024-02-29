/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getRetryIntervalDescriptionText } from 'in-synthetics/utils/getRetryIntervalDescriptionText';

describe('getRetryIntervalDescriptionText()', () => {
  it('should provide correct description for different values of retry and retryInterval', () => {
    expect(getRetryIntervalDescriptionText(1, 1)).toBe('This test will retry once after 1 second.');
    expect(getRetryIntervalDescriptionText(1, 5)).toBe('This test will retry once after 5 seconds.');
    expect(getRetryIntervalDescriptionText(2, 1)).toBe('This test will retry twice after 1 second.');
    expect(getRetryIntervalDescriptionText(2, 5)).toBe('This test will retry twice after 5 seconds.');
  });
});
