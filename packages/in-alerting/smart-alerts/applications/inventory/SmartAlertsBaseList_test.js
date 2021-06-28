/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render } from '@testing-library/react';
import { useLocation } from 'react-router';
import React from 'react';

import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import { successObservable } from 'in-services/util/result';

jest.mock('react-router');

describe('in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList', () => {
  const onNoData = jest.fn();
  const getGlobalAlertConfigFetchFunction = jest.fn();
  const getLocalAlertConfigsFetchFunction = jest.fn();
  const additionalMatrixKeys = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    getGlobalAlertConfigFetchFunction.mockReturnValue(successObservable([]));
    getLocalAlertConfigsFetchFunction.mockReturnValue(successObservable([]));
    additionalMatrixKeys.mockReturnValue([]);
    useLocation.mockReturnValue({
      pathname: '/',
      query: {},
      matrix: {}
    });
  });

  it('must trigger onNoData when both fetch calls return no entries', async () => {
    render(
      <SmartAlertsBaseList
        onNoData={onNoData}
        getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
        getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
        additionalMatrixKeys={additionalMatrixKeys}
      />
    );
    expect(getGlobalAlertConfigFetchFunction).toHaveBeenCalledTimes(1);
    expect(getLocalAlertConfigsFetchFunction).toHaveBeenCalledTimes(1);
    expect(onNoData).toHaveBeenCalledTimes(1);
  });

  it('must not trigger onNoData when there are local alerts', () => {
    getLocalAlertConfigsFetchFunction.mockReturnValue(successObservable(getDummyAlertsList()));

    render(
      <SmartAlertsBaseList
        onNoData={onNoData}
        getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
        getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
        additionalMatrixKeys={additionalMatrixKeys}
      />
    );

    expect(onNoData).toHaveBeenCalledTimes(0);
  });

  it('must not trigger onNoData when there are global alerts', () => {
    getGlobalAlertConfigFetchFunction.mockReturnValue(successObservable(getDummyAlertsList()));

    render(
      <SmartAlertsBaseList
        onNoData={onNoData}
        getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
        getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
        additionalMatrixKeys={additionalMatrixKeys}
      />
    );

    expect(onNoData).toHaveBeenCalledTimes(0);
  });
});

function getDummyAlertsList() {
  return [
    {
      name: 'Calls are slower than usual',
      description: '',
      boundaryScope: 'INBOUND',
      applicationId: 'btg-B701Rx6o9QNXUS4TVw',
      applications: {
        'btg-B701Rx6o9QNXUS4TVw': {
          applicationId: 'btg-B701Rx6o9QNXUS4TVw',
          inclusive: true,
          services: {}
        }
      },
      severity: 5,
      triggering: false,
      tagFilters: [],
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'OR',
        elements: []
      },
      includeInternal: false,
      includeSynthetic: false,
      rule: {
        alertType: 'slowness',
        aggregation: 'P90',
        metricName: 'latency'
      },
      threshold: {
        type: 'historicBaseline',
        operator: '>=',
        seasonality: 'DAILY',
        deviationFactor: 3.0,
        lastUpdated: 0
      },
      alertChannelIds: [],
      granularity: 600000,
      timeThreshold: { type: 'violationsInSequence', timeWindow: 600000 },
      evaluationType: 'PER_AP',
      customPayloadFields: [],
      id: 'V_TlQSWrReuE8Glxh2yfBw',
      created: 1624533122079,
      readOnly: false,
      enabled: true,
      derivedFromGlobalAlert: false
    }
  ];
}
