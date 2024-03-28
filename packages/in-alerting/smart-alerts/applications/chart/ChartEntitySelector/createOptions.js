/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fetchEndpoints } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/selectionApi';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

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
    return createAPsList(applicationList);
  }

  const createServicesAndEndpointsListMapper = appId =>
    isSelectServiceLevel
      ? servicesResult => ({
          ...servicesResult,
          data: {
            items: mapServicesToOptions(appId, servicesResult?.data?.items)
          }
        })
      : servicesResult => ({
          ...servicesResult,
          data: {
            items: mapServicesWithEndpointsToOptions(
              appId,
              servicesResult?.data?.items,
              timeConfig,
              boundaryScope,
              includeSynthetic,
              tagFilterExpression,
              applications
            )
          }
        });

  if (applicationIds.length === 1) {
    const { app, services } = applicationList.map(({ data }) => data)[0];
    return [
      {
        label: t('in-alerting:smartAlerts.applications.chart.entitySelection.services'),
        children: isSelectServiceLevel
          ? mapServicesToOptions(app.id, services)
          : mapServicesWithEndpointsToOptions(
              app.id,
              services,
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
      label: t('in-alerting:smartAlerts.applications.chart.entitySelection.applications'),
      children: applicationList
        .filter(result => Boolean(result?.data?.app))
        .sort((resultA, resultB) => compareIgnoreCase(resultA.data.app.label, resultB.data.app.label))
        .map(({ data: { app, services } }) => ({
          parentLabels: [],
          id: app.id,
          label: app.label,
          icon: 'lib_application',
          type: 'APPLICATION',
          loadChildren: () => services().map(createServicesAndEndpointsListMapper(app.id))
        }))
    }
  ];
}

export function createAPsList(applicationList) {
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

function mapServicesToOptions(appId, services) {
  return (services ?? []).map(({ service }) => ({
    applicationId: appId,
    id: service.id,
    icon: 'lib_application_service',
    label: service.label,
    type: 'SERVICE'
  }));
}

const hasNoEndpoints = metrics => metrics?.endpoints?.[0]?.[1] === 0;

function mapServicesWithEndpointsToOptions(
  appId,
  services,
  timeConfig,
  boundaryScope,
  includeSynthetic,
  tagFilterExpression,
  applications
) {
  const loadServiceEndpoints = service =>
    fetchEndpoints({
      applicationId: appId,
      serviceId: service.id,
      boundaryScope,
      tagFilterFormModel: tagFilterExpression,
      applications,
      timeConfig,
      includeSynthetic
    }).map(({ data, progress }) => ({
      data: {
        items: mapEndpointItemsToOptions(appId, service, data?.items)
      },
      progress
    }));

  const serviceWithEndpointMetricsMapper = ({ service, metrics }) => {
    const withoutEndpoint = {
      applicationId: appId,
      id: service.id,
      parentLabels: [],
      icon: 'lib_application_service',
      label: service.label,
      type: 'SERVICE',
      children: []
    };

    if (hasNoEndpoints(metrics)) {
      return withoutEndpoint;
    }

    return {
      ...withoutEndpoint,

      children: undefined, // undefined will be replaced in case list will have been fetched
      loadChildren: () => loadServiceEndpoints(service)
    };
  };

  return (services ?? []).map(serviceWithEndpointMetricsMapper);
}

function mapEndpointItemsToOptions(appId, service, itemsWithEndpoints) {
  return (itemsWithEndpoints ?? []).map(({ endpoint }) => ({
    serviceId: service.id,
    applicationId: appId,
    label: endpoint.label,
    id: endpoint.id,
    type: 'ENDPOINT',
    icon: 'lib_application_endpoint'
  }));
}

export const loadingOptions = [
  { label: t('in-alerting:smartAlerts.components.smartAlertDialog.Loading'), loadChildren: () => pendingResult }
];
