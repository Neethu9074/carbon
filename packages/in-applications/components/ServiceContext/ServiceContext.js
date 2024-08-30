/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { useLinkToServiceDashboard } from 'in-applications/navigation/paths';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import { pendingResult } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ServiceContext.mless';

export default function ServiceContext({ serviceId, applicationId, boundaryScope, syntheticCalls }) {
  const service = useObservable(getServiceLabel({ id: serviceId }), [serviceId]) ?? pendingResult;
  const getLinkToServiceDashboard = useLinkToServiceDashboard();

  return (
    <Tooltip content={service.data ? service.data.label : t('in-applications:labelService')} delay={500}>
      <Link
        className={locals.link}
        href={getLinkToServiceDashboard({ serviceId, applicationId, boundaryScope, syntheticCalls })}
      >
        {service.data ? service.data.label : t('in-applications:labelService')}
      </Link>
    </Tooltip>
  );
}
