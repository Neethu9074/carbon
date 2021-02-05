/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React from 'react';

import {
  getApplicationResult,
  getApplicationsResult,
  getEndpointsResult,
  getServicesResult,
  storedApplicationsSelection
} from './servicesAndEndpointsListData';
import ServicesAndEndpointsListPresenter from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';
import { noop } from 'in-services/fixedObjects';

export default {
  title: 'Organisms|smartAlerts|ServicesAndEndpointsListPresenter',
  component: ServicesAndEndpointsListPresenter
};

export function servicesAndEnpointsListGlobalAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplicationsCursorPaginated: () => just(getApplicationsResult),
        getServicesCursorPaginated: () => just(getServicesResult),
        getEndpointsCursorPaginated: () => just(getEndpointsResult)
      }}
      applicationsSelection={{}}
      boundaryScope="INBOUND"
      onChange={noop}
      isGlobalSmartAlert
    />
  );
}

export function servicesAndEnpointsListIndividualAlerts() {
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
      onChange={noop}
    />
  );
}

export function servicesAndEnpointsListAlertsWithStaleConfig() {
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
      onChange={noop}
      isGlobalSmartAlert
    />
  );
}
