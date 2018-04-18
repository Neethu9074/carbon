import React from 'react';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './ServiceEndpointInformation.mless';

export default function ServiceEndpointInformation({ call, getColor, marginLeft }) {
  return (
    <div
      style={{
        marginLeft: `${marginLeft}px`
      }}
      className={locals.serviceEndpointInformation}
    >
      <div style={{ background: getColor(call) }} className={locals.colorIndicator} />

      <SvgIcon type="app_service" width={12} height={12} className={locals.serviceIcon} color="#47626A" />
      <Link className={locals.link} href$={getServiceDashboard(call.service.id)}>
        <span className={locals.label}>{call.service.label}</span>
      </Link>

      <SvgIcon type="chevron_right" width={8} height={8} className={locals.arrowIcon} color="#47626A" />

      <SvgIcon type="app_endpoint" width={12} height={12} className={locals.endpointIcon} color="#47626A" />
      <Link className={locals.link} href$={getEndpointDashboard(call.endpoint.id, { serviceId: call.service.id })}>
        <span className={locals.label}>{call.endpoint.label}</span>
      </Link>
    </div>
  );
}
