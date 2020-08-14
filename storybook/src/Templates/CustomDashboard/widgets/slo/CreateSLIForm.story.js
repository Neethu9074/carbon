import React from 'react';

import { getApplicationConfigsAsResultObservable, getSliConfigurations } from './apiMock';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';

export default {
  title: 'Templates|CustomDashboard/widgets/slo/createSLI',
  component: CreateNewSLIForm
};

export function Default() {
  const api = {
    getSliConfigurations,
    getApplicationConfigsAsResultObservable
  };
  const savedState = {
    id: 'joschi-test-1',
    sliName: 'SLI on all services latency p90 <10ms',
    metricConfiguration: {
      metricName: 'latency',
      metricAggregation: 'P90',
      threshold: 10
    },
    sliEntity: {
      sliType: 'application',
      applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
      serviceId: null,
      endpointId: null,
      boundaryScope: 'ALL'
    }
  };

  const sliConfig = savedState;

  return <CreateNewSLIForm api={api} sliConfig={sliConfig} applicationName={'All Servics'} />;
}
