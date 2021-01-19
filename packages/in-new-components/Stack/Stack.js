/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getStackForInfrastructure,
  getStackForApplication,
  getStackForService,
  getStackForEndpoint
} from 'in-new-components/Stack/subscriptions/getStack';
import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import getApplication from 'in-subscription/application/getApplication';
import StackPresenter from 'in-new-components/Stack/StackPresenter';
import getEndpoint from 'in-subscription/application/getEndpoint';
import getService from 'in-subscription/application/getService';
import { hasError, isLoading } from 'in-services/util/result';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

function getStackResult({ id, applicationId, timeConfig, productArea }) {
  switch (productArea) {
    case 'application':
      return getStackForApplication({ id, timeConfig });
    case 'service':
      return getStackForService({ id, applicationId, timeConfig });
    case 'endpoint':
      return getStackForEndpoint({ id, applicationId, timeConfig });
    default:
      return getStackForInfrastructure({ id, timeConfig });
  }
}

function getSelfEntity({ id, timeConfig, applicationId, productArea }) {
  switch (productArea) {
    case 'application':
      return getApplication({ id }).map(resolveApplicationResult);
    case 'service':
      return getService({
        id,
        filter: {
          timeConfig
        }
      }).map(result => resolveServiceResult(result, applicationId));
    case 'endpoint':
      return getEndpoint({
        id,
        filter: {
          timeConfig
        }
      }).map(result => resolveEndpointResult(result, applicationId));
    default:
      return getSnapshot(id, timeConfig).map(resolveSnapshotResult);
  }
}

export default connectTo(
  ({ id, applicationId, timeConfig, productArea, includeSelfEntity }) => {
    const observables = { stackResult: getStackResult({ id, applicationId, timeConfig, productArea }) };
    if (includeSelfEntity) {
      observables.selfEntity = getSelfEntity({ id, applicationId, timeConfig, productArea });
    }
    return observables;
  },
  function Stack({ applicationId, boundaryScope, serviceId, stackResult, productArea, selfEntity, plugin }) {
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
        selfEntity={selfEntity}
        plugin={plugin}
      />
    );
  }
);

function resolveApplicationResult(result) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application',
    label: result.data.label,
    href$: getApplicationDashboard(result.data.id)
  };
}

function resolveServiceResult(result, applicationId) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application_service',
    label: result.data.label,
    href$: getServiceDashboard(result.data.id, { applicationId })
  };
}

function resolveEndpointResult(result, applicationId) {
  if (hasError(result) || isLoading(result)) {
    return undefined;
  }
  return {
    icon: 'lib_application_endpoint',
    label: result.data.label,
    href$: getEndpointDashboard(result.data.id, { applicationId })
  };
}

function resolveSnapshotResult(result) {
  if (!result) {
    return undefined;
  }
  return {
    icon: getIconType(result),
    label: result.get('label'),
    href$: getDashboardLink(result.get('id'), { pathname: '/physical/dashboard' })
  };
}
