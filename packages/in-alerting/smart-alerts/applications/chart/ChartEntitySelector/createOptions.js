/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fetchEndpoints } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/selectionApi';
import { compareIgnoreCase } from 'in-services/util/string';

/*
  Use Cases:

  0 APs -> empty

  PerAP-only:

  PerService:
  * only 1 AP -> just services
  * many APs

  PerEndpoints:
  * only 1 AP -> just services + endpoints
  * many APs
 */
export function createOptionsList(
  applicationList,
  applicationIds,
  isSelectApLevel,
  isSelectServiceLevel,
  applications,
  timeConfig,
  tagFilterExpression,
  boundaryScope,
  includeSynthetic
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
          icon: 'lib_application',
          type: 'APPLICATION'
        };
      });
  }

  const createServicesAndEndpointsList = isSelectServiceLevel
    ? (app, services) => mapServicesToOptions(app, services)
    : (app, services) =>
        mapServicesWithEndpointsToOptions(
          app,
          services,
          timeConfig,
          boundaryScope,
          includeSynthetic,
          tagFilterExpression,
          applications
        );

  if (applicationIds.length === 1) {
    const { app, services } = applicationList.map(({ data }) => data)[0];
    return [
      {
        label: 'Services:',
        children: createServicesAndEndpointsList(app, services)
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
          children: createServicesAndEndpointsList(app, services)
        }))
    }
  ];
}

function mapServicesToOptions(app, services) {
  return (services ?? []) //
    .map(({ service }) => ({
      appId: app.id,
      id: service.id,
      icon: 'lib_application_service',
      label: service.label,
      type: 'SERVICE'
    }));
}

const hasNoEndpoints = metrics => metrics?.endpoints?.[0]?.[1] === 0;

function mapServicesWithEndpointsToOptions(
  app,
  services,
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
      loadChildren: hasNoEndpoints(metrics)
        ? undefined // optimisation, when we already know it has no endpoints
        : () =>
            fetchEndpoints({
              applicationId: app.id,
              serviceId: service.id,
              boundaryScope,
              tagFilterFormModel: tagFilterExpression,
              applications,
              timeConfig,
              includeSynthetic
            }) //
              .map(({ data, progress }) => ({
                data: {
                  items: mapEndpointItemsToOptions(app, service, data?.items)
                },
                progress
              }))
    }));
}

function mapEndpointItemsToOptions(app, service, itemsWithEndpoints) {
  return (itemsWithEndpoints ?? []) //
    .map(({ endpoint }) => ({
      serviceId: service.id,
      appId: app.id,
      label: endpoint.label,
      id: endpoint.id,
      type: 'ENDPOINT',
      icon: 'lib_application_endpoint'
    }));
}
