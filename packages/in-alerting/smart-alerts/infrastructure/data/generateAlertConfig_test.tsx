/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import generateAlertConfig from 'in-alerting/smart-alerts/infrastructure/data/generateAlertConfig';
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData.json';

describe('in-alerting/smart-alerts/infrastructure/data/generateAlertConfig.tsx', () => {
  delete (alertConfig as any).forecastingConfig;
  delete (alertConfig as any).threshold;

  const alertConfigData = {
    ...alertConfig,
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      lastUpdated: 0
    }
  };

  it('returns an alert configuration object with default values', () => {
    // GIVEN
    const config = generateAlertConfig();
    // THEN
    expect(config).toEqual(alertConfigData);
  });
});
