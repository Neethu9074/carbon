/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

export const convertMinutesToHours = (testFrequency: number) => {
  return testFrequency / 60;
};

export const sslCertificateTestFrequencyDescription = (testFrequency: number) => {
  if (testFrequency < 60) {
    return t('in-synthetics:dialog.createTest.advancedMode.frequency', { frequencyValue: testFrequency });
  } else if (testFrequency % 60 === 0) {
    return t('in-synthetics:dialog.createTest.advancedMode.frequencyHours', {
      frequencyHours: Math.floor(convertMinutesToHours(testFrequency))
    });
  } else {
    return t('in-synthetics:dialog.createTest.advancedMode.frequencyHoursAndMinutes', {
      frequencyHours: Math.floor(convertMinutesToHours(testFrequency)),
      frequencyMinutes: testFrequency % 60
    });
  }
};

export const convertHoursToMinutes = (syntheticType: string, testFrequency: number) => {
  return syntheticType == 'SSLCertificate' ? testFrequency * 60 : testFrequency;
};

export const testFrequencyDescription = (syntheticType: string, testFrequency: number) => {
  return syntheticType != 'SSLCertificate'
    ? t('in-synthetics:dialog.createTest.advancedMode.frequency', { frequencyValue: testFrequency })
    : sslCertificateTestFrequencyDescription(testFrequency);
};
