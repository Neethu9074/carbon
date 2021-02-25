/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
  function ServiceContext({ service, serviceId, applicationId, boundaryScope, syntheticCalls }) {
    return (
      <Tooltip content={service.data ? service.data.label : t('in-applications:labelService')} delay={500}>
        <Link
          className={locals.link}
          href$={getServiceDashboard(serviceId, { applicationId, boundaryScope, syntheticCalls })}
        >
          {service.data ? service.data.label : t('in-applications:labelService')}
        </Link>
      </Tooltip>
    );
  }
);
