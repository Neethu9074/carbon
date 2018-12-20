import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { isUnknownTypeSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ServiceEndpointInformation.mless';

export default function ServiceEndpointInformation({ call, marginLeft }) {
  if (((!call.service || !call.service.label) && (!call.endpoint || !call.endpoint.label)) || isUnknownTypeSpan(call)) {
    return null;
  }
  return (
    <div
      style={{
        marginLeft: `${marginLeft}px`
      }}
      className={locals.serviceEndpointInformation}
    >
      <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={16} height={16} />
      <Link className={locals.link} href$={getServiceDashboard(call.service.id)}>
        {call.service.label}
      </Link>

      <SvgIcon className={locals.arrowIcon} type="lib_arrow_expand_right" width={16} height={16} />

      <SvgIcon className={locals.endpointIcon} type="lib_application_endpoint" width={16} height={16} />
      <Link className={locals.link} href$={getEndpointDashboard(call.endpoint.label, { serviceId: call.service.id })}>
        {call.endpoint.label}
      </Link>
    </div>
  );
}
