/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Router } from 'react-router-dom';
import React from 'react';

import { just } from '@instana/observables';

import {
  getApplicationResult,
  getApplicationsResult,
  getEndpointsResult,
  getServicesResult,
  storedApplicationsSelection
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/stories/servicesAndEndpointsListData';
import ServicesAndEndpointsListPresenter from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import history from 'in-stores/navigation/history';
import { noop } from 'in-services/fixedObjects';

const oneDayTimeConfig = Object.freeze({
  windowSize: 86400000
});

// for enabling use of useLocation-hook
const routerDecorator = Story => (
  <Router history={history}>
    <Story />
  </Router>
);

export default {
  decorators: [routerDecorator],
  component: ServicesAndEndpointsListPresenter
};

export function GlobalAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServicesCursorPaginated: () => just(getServicesResult),
        getEndpointsCursorPaginated: () => just(getEndpointsResult)
      }}
      applicationsSelection={{}}
      boundaryScope="INBOUND"
      timeConfig={oneDayTimeConfig}
      onChange={noop}
      includeSynthetic
      isGlobalSmartAlert
    />
  );
}
export function WithError() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServicesCursorPaginated: () => just(getServicesResult),
        getEndpointsCursorPaginated: () => just(getEndpointsResult)
      }}
      validationError={'Please select at least one entry.'}
      applicationsSelection={{}}
      boundaryScope="INBOUND"
      timeConfig={oneDayTimeConfig}
      onChange={noop}
      isGlobalSmartAlert
    />
  );
}

export function IndividualAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServicesCursorPaginated: () => just(getServicesResult),
        getEndpointsCursorPaginated: () => just(getEndpointsResult)
      }}
      alertApplicationId="btg-B701Rx6o9QNXUS4TVw"
      applicationsSelection={{}}
      boundaryScope="INBOUND"
      timeConfig={oneDayTimeConfig}
      onChange={noop}
      includeSynthetic={false}
    />
  );
}

export function WithStaleConfig() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServicesCursorPaginated: () => just(getServicesResult),
        getEndpointsCursorPaginated: () => just(getEndpointsResult)
      }}
      applicationsSelection={storedApplicationsSelection}
      boundaryScope="INBOUND"
      timeConfig={oneDayTimeConfig}
      onChange={noop}
      includeSynthetic
      isGlobalSmartAlert
    />
  );
}
