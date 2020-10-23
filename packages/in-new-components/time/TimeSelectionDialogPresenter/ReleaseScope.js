import React from 'react';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import locals from './Releases.mless';

export default function ReleaseScope({ serviceId, applicationId }) {
  if (serviceId) {
    const service = useObservable(getServiceLabel({ id: serviceId }).map(getLabel), [serviceId]);
    return (
      <div className={locals.iconAndType}>
        <SvgIcon type="lib_application_service" size="s" /> {service}
      </div>
    );
  } else if (applicationId) {
    const application = useObservable(getApplication({ id: applicationId }).map(getLabel), [applicationId]);
    return (
      <div className={locals.iconAndType}>
        <SvgIcon type="lib_application" size="s" /> {application}
      </div>
    );
  } else return <div />;
}

function getLabel(result) {
  return result?.data?.label ?? null;
}
