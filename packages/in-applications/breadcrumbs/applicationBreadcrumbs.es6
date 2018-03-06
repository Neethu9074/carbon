import React from 'react';

import ApplicationBreadcrumbWithSwitcher from 'in-applications/breadcrumbs/ApplicationBreadcrumbWithSwitcher';
import { applicationDashboard, endpointDashboard } from 'in-applications/navigation/paths';
import ApplicationBreadcrumb from 'in-applications/breadcrumbs/ApplicationBreadcrumb';
import EndpointBreadcrumb from 'in-applications/breadcrumbs/EndpointBreadcrumb';
import HomeViewBreadcrumb from 'in-applications/breadcrumbs/HomeViewBreadcrumb';
import ServiceBreadcrumb from 'in-applications/breadcrumbs/ServiceBreadcrumb';

export function ApplicationBreadcrumbs(props) {
  const { applicationId } = props;
  return [
    <HomeViewBreadcrumb inApplicationContext={applicationId != null} />,
    applicationId && <ApplicationBreadcrumb {...props} />
  ];
}

export function ServiceBreadcrumbs(props) {
  const { applicationId, serviceId, viewPath } = props;
  return [
    <HomeViewBreadcrumb inApplicationContext={applicationId != null} />,
    applicationId && <ApplicationBreadcrumbWithSwitcher {...props} />,
    serviceId && viewPath !== applicationDashboard && <ServiceBreadcrumb {...props} />
  ];
}

export function EndpointBreadcrumbs(props) {
  const { applicationId, serviceId, endpointId, viewPath } = props;
  return [
    <HomeViewBreadcrumb inApplicationContext={applicationId != null} />,
    applicationId && <ApplicationBreadcrumbWithSwitcher {...props} />,
    serviceId && viewPath !== applicationDashboard && <ServiceBreadcrumb {...props} />,
    endpointId && viewPath === endpointDashboard && <EndpointBreadcrumb {...props} />
  ];
}
