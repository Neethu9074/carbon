/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import getAlertingUrlParameters from 'in-alerting/smart-alerts/websites/TearSheet/getAlertingUrlParameters';

describe('getAlertingUrlParameters', () => {
  it('should return correct values', () => {
    // arrange
    const location = {
      pathname: '/websiteMonitoring/smartAlerts',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/smartAlerts': {
          websiteId: '_h0oqf-vQLuSAh6JLu4JBw',
          tagFilters: '[{"name":"beacon.website.id","operator":"EQUALS","stringValue":"_h0oqf-vQLuSAh6JLu4JBw"}]',
          cancelUrl:
            '/#/websiteMonitoring/website;websiteId=_h0oqf-vQLuSAh6JLu4JBw/alerts;alertId=4rctT62FR3uyz5dIl-yVqA;alertCreated=1741613795445/details'
        }
      }
    };
    // act
    const result = getAlertingUrlParameters(location);
    // assert
    expect(result.editMode).toBe(false);
    expect(result.duplicateMode).toBe(false);
    expect(result.websiteId).toBe('_h0oqf-vQLuSAh6JLu4JBw');

    expect(result.cancelTearSheet).toBe(
      '/#/websiteMonitoring/website;websiteId=_h0oqf-vQLuSAh6JLu4JBw/alerts;alertId=4rctT62FR3uyz5dIl-yVqA;alertCreated=1741613795445/details'
    );
  });
});
