/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { just } from '@instana/observables';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';

import locals from './ReleaseScope.mless';

export default function ReleaseScope({ serviceId, serviceName, applicationId, applicationName }) {
  const service = useObservable(
    ([serviceId]) => (serviceName ? just(serviceName) : serviceId && getServiceLabel({ id: serviceId }).map(getLabel)),
    [serviceId]
  );
  const application = useObservable(
    ([applicationId]) =>
      applicationName ? just(applicationName) : applicationId && getApplication({ id: applicationId }).map(getLabel),
    [applicationId]
  );

  const serviceItem = service && (
    <span className={locals.iconAndType}>
      <SvgIcon type="lib_application_service" size="s" />
      {service}
    </span>
  );

  const applicationItem = application && (
    <span className={locals.iconAndType}>
      <SvgIcon type="lib_application" size="s" />
      {application}
    </span>
  );

  if (!applicationItem && !serviceItem) {
    return null;
  }

  if (applicationItem && serviceItem) {
    return (
      <div className={locals.serviceApplicationRow}>
        {serviceItem}
        <span className={locals.serviceApplicationSpan}>-</span>
        {applicationItem}
      </div>
    );
  }

  return (
    <div>
      {applicationItem} {serviceItem}
    </div>
  );
}

function getLabel(result) {
  return result?.data?.label;
}
