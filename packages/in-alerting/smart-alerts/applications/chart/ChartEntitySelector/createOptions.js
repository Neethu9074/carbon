/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { fetchEndpoints } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/selectionApi';
import ApplicationScopePath from 'in-alerting/smart-alerts/applications/components/ApplicationScopePath';
import { compareIgnoreCase } from 'in-services/util/string';

export function createOptionsList(
  applicationList,
  applicationIds,
  isSelectApLevel,
  isSelectServiceLevel,
  timeConfig,
  tagFilterExpression,
  boundaryScope,
  includeSynthetic,
  applications
) {
  if (!applicationIds || applicationIds.length === 0) return [];

  if (isSelectApLevel) {
    return applicationList
      .map(({ data }) => data)
      .filter(Boolean)
      .sort((appA, appB) => compareIgnoreCase(appA.label, appB.label))
      .map(({ id, label }) => {
        return {
          label,
          id,
          /* used in search results */
          breadcrumbAndLabel: <ApplicationScopePath applicationName={label} />,
          icon: 'lib_application',
          type: 'APPLICATION'
        };
      });
  }

  if (applicationIds.length === 1) {
    const { app, services } = applicationList.map(({ data }) => data)[0];
    return [
      {
        label: 'Services:',
        children: mapServicesToOptions(
          app,
          services,
          isSelectServiceLevel,
          timeConfig,
          boundaryScope,
          includeSynthetic,
          tagFilterExpression,
          applications
        )
      }
    ];
  }

  return [
    {
      label: 'Applications:',
      children: applicationList
        .filter(result => Boolean(result?.data?.app))
        .sort((resultA, resultB) => compareIgnoreCase(resultA.data.app.label, resultB.data.app.label))
        .map(({ data: { app, services } }) => ({
          breadcrumbAndLabel: app.label, // used as a header on next level or in search
          id: app.id,
          label: app.label,
          icon: 'lib_application',
          type: 'APPLICATION',
          children: mapServicesToOptions(
            app,
            services,
            isSelectServiceLevel,
            timeConfig,
            boundaryScope,
            includeSynthetic,
            tagFilterExpression,
            applications
          )
        }))
    }
  ];
}

const hasNoEndpoints = metrics => metrics?.endpoints?.[0]?.[1] === 0;

function mapServicesToOptions(
  app,
  services,
  isSelectServiceLevel,
  timeConfig,
  boundaryScope,
  includeSynthetic,
  tagFilterExpression,
  applications
) {
  return (services ?? []) //
    .map(({ service, metrics }) => ({
      appId: app.id,
      id: service.id,
      breadcrumbAndLabel: service.id, // used as a header above endpoints-list
      icon: 'lib_application_service',
      label: service.label,
      type: 'SERVICE',
      children: hasNoEndpoints(metrics) ? [] : undefined, // undefined will be replaced in case list will have been fetched
      loadChildren:
        isSelectServiceLevel || hasNoEndpoints(metrics) // ignore if only showing services (or APs) or
          ? // if we already know it has no endpoints
            undefined
          : () =>
              fetchEndpoints({
                applicationId: app.id,
                serviceId: service.id,
                boundaryScope,
                tagFilterExpression,
                applications,
                timeConfig,
                includeSynthetic
              }) //
                .map(({ data, progress }) => ({
                  data: {
                    items: mapEndpointsToOptions(app, service, data?.items)
                  },
                  progress
                }))
    }));
}

function mapEndpointsToOptions(app, service, itemsWithEndpoints) {
  return (itemsWithEndpoints ?? []) //
    .map(({ endpoint }) => ({
      breadcrumbAndLabel: <ApplicationScopePath endpointName={endpoint.label} serviceName={service.label} />,
      serviceId: service.id,
      serviceName: service.label,
      appId: app.id,
      appName: app.label,
      label: endpoint.label,
      id: endpoint.id,
      type: 'ENDPOINT',
      icon: 'lib_application_endpoint'
    }));
}
