/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import { getApplicationDashboard, getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getServiceDashboard as getKubernetesServiceDashboard } from 'in-kubernetes/navigation/paths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getDashboardForEntity } from 'in-kubernetes/navigation/paths';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ScopeNotification.mless';

export default connectTo(
  ({ applicationId, serviceId, endpointId, snapshotId }) => ({
    applicationLabel: applicationId ? getApplication({ id: applicationId }).map(getLabel) : alwaysNull,
    serviceLabel: serviceId ? getServiceLabel({ id: serviceId }).map(getLabel) : alwaysNull,
    endpointLabel: endpointId
      ? timeConfig$.flatMap(timeConfig => getEndpoint({ id: endpointId, filter: { timeConfig } })).map(getLabel)
      : alwaysNull,
    snapshotLabel: snapshotId ? getSnapshot(snapshotId).map(getSnapshotLabel) : alwaysNull
  }),
  function ScopeNotification({
    productArea,
    contextScope,
    applicationId,
    serviceId,
    endpointId,
    applicationLabel,
    serviceLabel,
    endpointLabel,
    icon,
    onClose,
    tagFilters,
    snapshotId,
    plugin,
    snapshotLabel
  }) {
    let entityLabel;
    let href;
    if (endpointId) {
      entityLabel = endpointLabel;
      href = getEndpointDashboard(endpointId, { applicationId, serviceId });
    } else if (serviceId && tagFilters.length === 0) {
      entityLabel = serviceLabel;
      href = getServiceDashboard(serviceId, { applicationId });
    } else if (applicationId) {
      entityLabel = applicationLabel;
      href = getApplicationDashboard(applicationId);
    } else if (snapshotLabel && !serviceLabel) {
      entityLabel = snapshotLabel;
      href = getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
    } else if (tagFilters.map(tagFilter => tagFilter.name.includes('kubernetes'))) {
      entityLabel = getKubernetesLabel(tagFilters);
      href = getKubernetesDashboardLink(snapshotId, plugin, tagFilters, serviceId);
    }

    return (
      <div className={locals.wrapper}>
        <SvgIcon size="s" className={locals.icon} type={icon} />
        <div className={locals.notificationText}>
          Showing {productArea}s <span className={locals.bold}>{contextScope.toLowerCase()}</span> of{' '}
          <Link className={locals.bold} href$={href}>
            {entityLabel}
          </Link>
          {applicationLabel && (serviceLabel || endpointLabel) && (
            <>
              <span> in context of </span>
              <Link className={locals.bold} href$={getApplicationDashboard(applicationId)}>
                {applicationLabel}
              </Link>
            </>
          )}
        </div>
        <div>
          <Button icon="lib_openclose_circle" size="compact" onClick={onClose}>
            Show all {productArea}s
          </Button>
        </div>
      </div>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getKubernetesLabel(tagFilters) {
  return tagFilters[tagFilters.length - 1]?.value;
}

function getKubernetesDashboardLink(snapshotId, plugin, tagFilters, serviceId) {
  if (!tagFilters.map(tagFilter => tagFilter.name.includes('kubernetes.service.name'))) {
    return getDashboardForEntity(snapshotId, plugin);
  }
  return getKubernetesServiceDashboard(serviceId);
}
