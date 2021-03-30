/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';
import React from 'react';

import ServicesAndEndpointsListPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import {
  getApplicationResult,
  getApplicationsResult,
  getEndpointsResult,
  getServicesResult,
  storedApplicationsSelection
} from './servicesAndEndpointsListData';
import { noop } from 'in-services/fixedObjects';

const oneDayTimeConfig = Object.freeze({
  windowSize: 86400000
});

export default {
  title: 'Organisms|smartAlerts|ServicesAndEndpointsListPresenter',
  component: ServicesAndEndpointsListPresenter
};

export function servicesAndEndpointsListGlobalAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
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

export function servicesAndEndpointsListIndividualAlerts() {
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

export function servicesAndEndpointsListAlertsWithStaleConfig() {
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
