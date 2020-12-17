import { just } from 'reactive-observables';
import React from 'react';

import {
  getApplicationResult,
  getApplicationsResult,
  getEndpointsResult,
  getServicesResult,
  storedApplicationsSelection
} from './servicesAndEndpointsListData';
import ServicesAndEndpointsListPresenter from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ServicesAndEndpointsListPresenter';

export default {
  title: 'Organisms|smartAlerts|ServicesAndEndpointsListPresenter',
  component: ServicesAndEndpointsListPresenter
};

export function servicesAndEnpointsListGlobalAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplications: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServices: () => just(getServicesResult),
        getEndpoints: () => just(getEndpointsResult)
      }}
      applicationsSelection={{}}
    />
  );
}

export function servicesAndEnpointsListIndividualAlerts() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplications: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServices: () => just(getServicesResult),
        getEndpoints: () => just(getEndpointsResult)
      }}
      applicationId="btg-B701Rx6o9QNXUS4TVw"
      applicationsSelection={{}}
    />
  );
}

export function servicesAndEnpointsListGlobalAlertsWithStaleConfig() {
  return (
    <ServicesAndEndpointsListPresenter
      apiSubscriptions={{
        getApplications: () => just(getApplicationsResult),
        getApplication: () => just(getApplicationResult),
        getServices: () => just(getServicesResult),
        getEndpoints: () => just(getEndpointsResult)
      }}
      applicationsSelection={storedApplicationsSelection}
    />
  );
}
