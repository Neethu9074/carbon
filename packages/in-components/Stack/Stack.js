/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import {
  getStackForInfrastructure,
  getStackForApplication,
  getStackForService,
  getStackForEndpoint,
  getStackForBusinessProcess,
  getStackForBusinessActivity
} from 'in-components/Stack/subscriptions/getStack';
import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getApplication from 'in-applications/subscriptions/getApplication';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import getService from 'in-applications/subscriptions/getService';
import StackPresenter from 'in-components/Stack/StackPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getSnapshot } from 'in-stores/snapshot';

export function getStackResult({ id, applicationId, timeConfig, productArea }) {
  switch (productArea) {
    case 'application':
      return getStackForApplication({ id, timeConfig });
    case 'service':
      return getStackForService({ id, applicationId, timeConfig });
    case 'endpoint':
      return getStackForEndpoint({ id, applicationId, timeConfig });
    case 'businessProcess':
      return getStackForBusinessProcess({ id, timeConfig });
    case 'businessActivity':
      return getStackForBusinessActivity({ id, applicationId, timeConfig });
    default:
      return getStackForInfrastructure({ id, timeConfig });
  }
}

function getSelfEntity({
  id,
  timeConfig,
  applicationId,
  productArea,
  getLinkToApplicationDashboard,
  getLinkToServiceDashboard,
  getLinkToEndpointDashboard,
  getDashboardLink
}) {
  switch (productArea) {
    case 'application':
      return getApplication({ id }).map(result => resolveApplicationResult(result, getLinkToApplicationDashboard));
    case 'service':
      return getService({
        id,
        filter: {
          timeConfig
        }
      }).map(result => resolveServiceResult(result, applicationId, getLinkToServiceDashboard));
    case 'endpoint':
      return getEndpoint({
        id,
        filter: {
          timeConfig
        }
      }).map(result => resolveEndpointResult(result, applicationId, getLinkToEndpointDashboard));
    default:
      return getSnapshot(id, timeConfig).map(result => resolveSnapshotResult(result, getDashboardLink));
  }
}

export default function Stack({
  id,
  applicationId,
  timeConfig,
  includeSelfEntity,
  boundaryScope,
  serviceId,
  productArea,
  plugin,
  syntheticCalls
}) {
  const stackResult =
    useObservable(
      getStackResult({
        id,
        applicationId,
        timeConfig,
        productArea
      }),
      [id, applicationId, timeConfig, productArea]
    ) ?? pendingResult;
  const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
  const getLinkToServiceDashboard = useLinkToServiceDashboard();
  const getLinkToEndpointDashboard = useLinkToEndpointDashboard();
  const getDashboardLink = useGetDashboardLink();

  const selfEntity =
    useObservable(
      getSelfEntity({
        id,
        applicationId,
        timeConfig,
        productArea,
        getLinkToApplicationDashboard,
        getLinkToServiceDashboard,
        getLinkToEndpointDashboard,
        getDashboardLink
      }),
      [
        id,
        applicationId,
        timeConfig,
        productArea,
        getLinkToApplicationDashboard,
        getLinkToServiceDashboard,
        getLinkToEndpointDashboard,
        getDashboardLink
      ]
    ) ?? pendingResult;

  if (hasError(stackResult)) {
    return <ErroneousResultPresenter errors={stackResult.errors} />;
  }

  return (
    <StackPresenter
      applicationId={applicationId}
      boundaryScope={boundaryScope}
      serviceId={serviceId}
      stack={stackResult.data}
      isLoading={isLoading(stackResult)}
      productArea={productArea}
      selfEntity={includeSelfEntity ? selfEntity : undefined}
      plugin={plugin}
      syntheticCalls={syntheticCalls}
    />
  );
}

function resolveApplicationResult(result, getLinkToApplicationDashboard) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application',
    label: result.data.label,
    href: getLinkToApplicationDashboard({ applicationId: result.data.id })
  };
}

function resolveServiceResult(result, applicationId, getLinkToServiceDashboard) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application_service',
    label: result.data.label,
    href: getLinkToServiceDashboard({ serviceId: result.data.id, applicationId })
  };
}

function resolveEndpointResult(result, applicationId, getLinkToEndpointDashboard) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application_endpoint',
    label: result.data.label,
    href: getLinkToEndpointDashboard({ applicationId, endpointId: result.data.id })
  };
}

function resolveSnapshotResult(result, getDashboardLink) {
  if (!result) {
    return undefined;
  }
  return {
    icon: getIconType(result),
    label: result.get('label'),
    href: getDashboardLink(result.get('id'), { pathname: '/physical/dashboard' })
  };
}
