/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { testFrequencyDescription } from 'in-synthetics/utils/testFrequencyUtil';

describe('testFrequencyDescription()', () => {
  it('should display the test frequency base on test type and the value of frequency', () => {
    expect(testFrequencyDescription('HTTPAction', 5)).toBe('This test will run every 5 minutes.');
    expect(testFrequencyDescription('SSLCertificate', 15)).toBe('This test will run every 15 minutes.');
    expect(testFrequencyDescription('SSLCertificate', 1440)).toBe('This test will run every 24 hours.');
    expect(testFrequencyDescription('SSLCertificate', 150)).toBe('This test will run every 2 hours and 30 minutes.');
  });
});
