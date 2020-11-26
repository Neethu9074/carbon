import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import { just } from 'reactive-observables';

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
