import React from 'react';

import ApplicationEndpointViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationEndpointViewBreadcrumb';
import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import ApplicationsViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationsViewBreadcrumb';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BreadcrumbHeader.mless';

const separator = <SvgIcon className={locals.chevron} type="chevron_right" height={9} color="#E2E9EC" />;

export default function BreadcrumbHeader({ location, applicationId, serviceId, endpointId, timeframe }) {
  const crumbs = breadcrumbs(location, applicationId, serviceId, endpointId, timeframe).reduce((agg, curr) => {
    if (agg.length !== 0) {
      agg.push(separator);
    }
    agg.push(curr);
    return agg;
  }, []);

  return <ul className={locals.breadcrumbHeader}>{crumbs.map((crumb, i) => <li key={i}>{crumb}</li>)}</ul>;
}

function breadcrumbs(location, applicationId, serviceId, endpointId, timeframe) {
  const breadcrumbInfos = [];

  breadcrumbInfos.push(<ApplicationsViewBreadcrumb />);

  if (applicationId != null) {
    breadcrumbInfos.push('Application');
  }
  if (serviceId != null) {
    breadcrumbInfos.push(
      <ApplicationServiceViewBreadcrumb applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
    );
  }

  if (endpointId != null) {
    breadcrumbInfos.push(
      <ApplicationEndpointViewBreadcrumb
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeframe={timeframe}
      />
    );
  }

  return breadcrumbInfos;
}
