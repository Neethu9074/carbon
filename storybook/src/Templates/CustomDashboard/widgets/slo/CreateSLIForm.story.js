import React from 'react';

import { getApplicationConfigsAsResultObservable, getSliConfigurations } from './apiMock';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/SLI-management/SLIForm',
  component: CreateNewSLIForm
};

export function ViewExistingSLI() {
  const api = {
    getSliConfigurations,
    getApplicationConfigsAsResultObservable
  };
  const sliConfig = {
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

  return <CreateNewSLIForm api={api} sliConfig={sliConfig} apName={'All Servics'} />;
}

export function CreateNewSLI() {
  const api = {
    getSliConfigurations,
    getApplicationConfigsAsResultObservable
  };
  const sliConfig = {};

  return <CreateNewSLIForm api={api} sliConfig={sliConfig} apName={'All Servics'} />;
}
