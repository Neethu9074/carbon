import React from 'react';

import ApplicationViewBreadcrumbWithSwitcher from 'in-applications/breadcrumbs/ApplicationViewBreadcrumbWithSwitcher';
import ApplicationEndpointViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationEndpointViewBreadcrumb';
import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import { applicationDashboard, endpointDashboard } from 'in-applications/navigation/paths';
import HomeViewBreadcrumb from 'in-applications/breadcrumbs/HomeViewBreadcrumb';

export default function applicationBreadcrumbs(props) {
  const { applicationId, serviceId, endpointId, viewPath } = props;
  return [
    <HomeViewBreadcrumb inApplicationContext={applicationId != null} />,
    applicationId != null && <ApplicationViewBreadcrumbWithSwitcher {...props} />,
    serviceId != null && viewPath !== applicationDashboard && <ApplicationServiceViewBreadcrumb {...props} />,
    endpointId != null && viewPath === endpointDashboard && <ApplicationEndpointViewBreadcrumb {...props} />
  ];
}
