import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './SpanEndpointInformation.mless';

export default function SpanEndpointInformation({ span, getColor, marginLeft }) {
  return (
    <div
      style={{
        marginLeft: `${marginLeft}px`
      }}
      className={locals.spanEndpointInformation}
    >
      <div style={{ background: getColor(span) }} className={locals.colorIndicator} />
      <SvgIcon type="app_service" width={12} height={12} className={locals.serviceIcon} color="#47626A" />
      <span className={locals.label}>{span.service.label}</span>
      <SvgIcon type="chevron_right" width={8} height={8} className={locals.arrowIcon} color="#47626A" />
      <SvgIcon type="app_endpoint" width={12} height={12} className={locals.endpointIcon} color="#47626A" />
      <span className={locals.label}>{span.endpoint.label}</span>
    </div>
  );
}
