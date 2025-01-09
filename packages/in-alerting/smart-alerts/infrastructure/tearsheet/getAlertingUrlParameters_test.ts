/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import getAlertingUrlParameters from 'in-alerting/smart-alerts/infrastructure/tearsheet/getAlertingUrlParameters';

describe('getAlertingUrlParameters', () => {
  it('should return correct values', () => {
    // arrange
    const location = {
      pathname: '/infraSmartAlerts',
      query: {},
      matrix: {
        '/infraSmartAlerts': {
          alertId: '123456',
          alertCreated: '1732001460711',
          isEditMode: 'true',
          cancelUrl: '/#/infraAlerts;orderBy=created;orderDirection=DESC;page=1;query'
        }
      }
    };

    // act
    const result = getAlertingUrlParameters(location);

    // assert
    expect(result.editMode).toBe(true);
    expect(result.duplicateMode).toBe(false);
    expect(result.alertConfigId).toBe('123456');
    expect(result.alertConfigCreated).toBe(1732001460711);
    expect(result.cancelTearSheet).toBe('/#/infraAlerts;orderBy=created;orderDirection=DESC;page=1;query');
  });
});
