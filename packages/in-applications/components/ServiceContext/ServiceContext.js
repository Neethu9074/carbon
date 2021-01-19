/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Tooltip from 'in-components/Tooltip/Tooltip';
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
      <Tooltip content={service.data ? service.data.label : 'Service'} delay={500}>
        <Link className={locals.link} href$={getServiceDashboard(serviceId, { applicationId, boundaryScope })}>
          {service.data ? service.data.label : 'Service'}
        </Link>
      </Tooltip>
    );
  }
);
