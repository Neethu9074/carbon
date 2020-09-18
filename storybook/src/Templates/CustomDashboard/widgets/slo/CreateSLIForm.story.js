import React from 'react';

import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';

export default {
  title: 'Templates/CustomDashboard/widgets/SLO/SLI-management/SLIForm',
  component: CreateNewSLIForm
};

export function ViewExistingTimeBasedSLI() {
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

  return <CreateNewSLIForm sliConfig={sliConfig} apName="All Services" />;
}

export function WithGoodBadFilters() {
  const somefilters = [
    {
      name: 'call.http.status',
      stringValue: '2',
      numberValue: null,
      booleanValue: null,
      operator: 'STARTS_WITH',
      entity: 'NOT_APPLICABLE'
    }
  ];
  const sliConfig = {
    id: 'event-based--incomplete-data',
    sliName: 'good-bad-events-filters--missing',
    sliEntity: {
      sliType: 'availability',
      applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
      serviceId: null,
      endpointId: null,
      goodEventFilters: somefilters,
      badEventFilters: somefilters,
      boundaryScope: 'ALL'
    }
  };

  return <CreateNewSLIForm sliConfig={sliConfig} apName="All Services" />;
}

export function CreateNewSLI() {
  const sliConfig = {};

  return <CreateNewSLIForm sliConfig={sliConfig} apName="All Services" />;
}
