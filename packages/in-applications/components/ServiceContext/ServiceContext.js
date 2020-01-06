import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ServiceContext.mless';

export default connectTo(
  props => ({
    service: getServiceLabel({
      id: props.serviceId
    })
  }),
  function ServiceContext({ service, serviceId, applicationId, boundaryScope }) {
    return (
      <Link className={locals.link} href$={getServiceDashboard(serviceId, { applicationId, boundaryScope })}>
        {service.data ? service.data.label : 'Service'}
      </Link>
    );
  }
);
