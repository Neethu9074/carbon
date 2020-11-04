import React from 'react';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ReleaseScope.mless';

export default function ReleaseScope({ serviceId, applicationId }) {
  const service = useObservable(([serviceId]) => serviceId && getServiceLabel({ id: serviceId }).map(getLabel), [
    serviceId
  ]);
  const serviceItem = service && (
    <span className={locals.iconAndType}>
      <SvgIcon type="lib_application_service" size="s" />
      {service}
    </span>
  );

  const application = useObservable(
    ([applicationId]) => applicationId && getApplication({ id: applicationId }).map(getLabel),
    [applicationId]
  );
  const applicationItem = application && (
    <span className={locals.iconAndType}>
      <SvgIcon type="lib_application" size="s" />
      {application}
    </span>
  );

  if (!applicationItem && !serviceItem) {
    return null;
  } else if (applicationItem && serviceItem) {
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
