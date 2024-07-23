/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import { Link, SvgIcon, Button } from '@instana/components';

import {
  useLinkToApplicationDashboard,
  useLinkToEndpointDashboard,
  useLinkToServiceDashboard
} from 'in-applications/navigation/paths';
import { useDashboardForEntity, useServiceDashboard } from 'in-kubernetes/navigation/paths';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t, Trans } from 'in-i18n';

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
    const getLinkToApplicationDashboard = useLinkToApplicationDashboard();
    const getLinkToServiceDashboard = useLinkToServiceDashboard();
    const getLinkToEndpointDashboard = useLinkToEndpointDashboard();

    const kubernetesDashboardLink = useDashboardForEntity(snapshotId, plugin);
    const kubernetesServiceDashboardLink = useServiceDashboard(serviceId);
    const getDashboardLink = useGetDashboardLink();
    let entityLabel;
    let href;
    if (endpointId) {
      entityLabel = endpointLabel;
      href = getLinkToEndpointDashboard({ applicationId, serviceId, endpointId });
    } else if (serviceId && tagFilters.length === 0) {
      entityLabel = serviceLabel;
      href = getLinkToServiceDashboard({ serviceId, applicationId });
    } else if (applicationId) {
      entityLabel = applicationLabel;
      href = getLinkToApplicationDashboard({ applicationId });
    } else if (snapshotLabel && !serviceLabel) {
      entityLabel = snapshotLabel;
      href = getDashboardLink(snapshotId, { pathname: '/physical/dashboard' });
    } else if (tagFilters.map(tagFilter => tagFilter.name.includes('kubernetes'))) {
      href = !tagFilters.map(tagFilter => tagFilter.name.includes('kubernetes.service.name'))
        ? kubernetesDashboardLink
        : kubernetesServiceDashboardLink;

      entityLabel = getKubernetesLabel(tagFilters);
    }

    return (
      <div className={locals.wrapper}>
        <SvgIcon size="s" className={locals.icon} type={icon} />
        <div className={locals.notificationText}>
          {applicationLabel && (serviceLabel || endpointLabel) ? (
            productArea.toLowerCase() === 'application' ? (
              <Trans
                i18nKey="in-applications:list.showApplicationsScopeWithApplicationLabel"
                values={{
                  contextScope: contextScope.toLowerCase(),
                  entityLabel: entityLabel,
                  applicationLabel: applicationLabel
                }}
                components={{
                  bold: <span className={locals.bold} />,
                  linkToEntity: <Link className={locals.bold} href={href} />,
                  linkToApplication: (
                    <Link className={locals.bold} href={getLinkToApplicationDashboard({ applicationId })} />
                  )
                }}
              />
            ) : (
              <Trans
                i18nKey="in-applications:list.showServicesScopeWithServiceLabel"
                values={{
                  contextScope: contextScope.toLowerCase(),
                  entityLabel: entityLabel,
                  applicationLabel: applicationLabel
                }}
                components={{
                  bold: <span className={locals.bold} />,
                  linkToEntity: <Link className={locals.bold} href={href} />,
                  linkToApplication: (
                    <Link className={locals.bold} href={getLinkToApplicationDashboard({ applicationId })} />
                  )
                }}
              />
            )
          ) : productArea.toLowerCase() === 'application' ? (
            <Trans
              i18nKey="in-applications:list.showApplicationsScope"
              values={{
                contextScope: contextScope.toLowerCase(),
                entityLabel: entityLabel
              }}
              components={{
                bold: <span className={locals.bold} />,
                linkToEntity: <Link className={locals.bold} href={href} />
              }}
            />
          ) : (
            <Trans
              i18nKey="in-applications:list.showServicesScope"
              values={{
                contextScope: contextScope.toLowerCase(),
                entityLabel: entityLabel
              }}
              components={{
                bold: <span className={locals.bold} />,
                linkToEntity: <Link className={locals.bold} href={href} />
              }}
            />
          )}
        </div>
        <div>
          <Button icon="lib_openclose_circle" size="compact" onClick={onClose}>
            {productArea.toLowerCase() === 'application'
              ? t('in-applications:buttonShowAllApplications')
              : t('in-applications:buttonShowAllServices')}
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
