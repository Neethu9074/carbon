import React from 'react';

import ApplicationViewBreadcrumbWithSwitcher from 'in-applications/breadcrumbs/ApplicationViewBreadcrumbWithSwitcher';
import ApplicationEndpointViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationEndpointViewBreadcrumb';
import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import HomeViewBreadcrumb from 'in-applications/breadcrumbs/HomeViewBreadcrumb';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export default function applicationBreadcrumbs(location, timeframe, showSubMenu = false) {
  const view = `/${location.pathname.substring(1, location.pathname.slice(1).indexOf('/') + 1)}`;

  const application = getMatrixParameter(location, view, applicationId);
  const service = getMatrixParameter(location, view, serviceId);
  const endpoint = getMatrixParameter(location, view, endpointId);

  const breadcrumbs = [];
  breadcrumbs.push(<HomeViewBreadcrumb />);

  if (application != null) {
    if (!showSubMenu) {
      breadcrumbs.push(
        <ApplicationViewBreadcrumb
          applicationId={application}
          serviceId={service}
          endpointId={endpoint}
          timeframe={timeframe}
        />
      );
    } else {
      breadcrumbs.push(
        <ApplicationViewBreadcrumbWithSwitcher
          applicationId={application}
          serviceId={service}
          endpointId={endpoint}
          timeframe={timeframe}
          location={location}
        />
      );
    }
  }

  if (service != null) {
    breadcrumbs.push(
      <ApplicationServiceViewBreadcrumb
        applicationId={application}
        serviceId={service}
        endpointId={endpoint}
        timeframe={timeframe}
      />
    );
  }
  if (endpoint != null) {
    breadcrumbs.push(
      <ApplicationEndpointViewBreadcrumb
        applicationId={application}
        serviceId={service}
        endpointId={endpoint}
        timeframe={timeframe}
      />
    );
  }

  return breadcrumbs;
}
