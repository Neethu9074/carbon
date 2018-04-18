import { get } from 'lodash';
import React from 'react';

import EntryOrExitWrapper from 'in-analyze/TraceDetail/components/CallDetails/components/EntryOrExitWrapper';
import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './EntryExitInformation.mless';

export default function EntryExitInformation({ call }) {
  return (
    <div className={locals.entryExitInformation}>
      <ConnectionLine />
      <ServiceEndpointInformation spanRelation={call.source} />
      <ServiceEndpointInformation isCalled spanRelation={call.destination} />
    </div>
  );
}

function ServiceEndpointInformation({ spanRelation, isCalled }) {
  const service = get(spanRelation, 'service');
  const endpoint = get(spanRelation, 'endpoint');

  return (
    <div className={locals.serviceEndpointInformation}>
      <EntryOrExitWrapper isCalled={isCalled}>
        <div className={locals.serviceRow}>
          <SvgIcon className={locals.serviceIcon} type="app_service" width={14} height={14} color="#47626a" />
          {service ? (
            <Link className={locals.link} href$={getServiceDashboard(service.id)}>
              <span className={locals.serviceLabel}>{service.label}</span>
            </Link>
          ) : (
            <span className={locals.serviceLabel}>Unknown Service</span>
          )}
        </div>

        <div className={locals.endpointRow}>
          {endpoint && (
            <SvgIcon className={locals.endpointIcon} type="app_endpoint" width={13} height={13} color="#5e777f" />
          )}
          {endpoint && (
            <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: get(service, 'id') })}>
              <span className={locals.endpointLabel}>{endpoint.label}</span>
            </Link>
          )}
        </div>
      </EntryOrExitWrapper>
    </div>
  );
}

function ConnectionLine() {
  return (
    <div className={locals.connectionLineWrapper}>
      <div className={locals.connectionAnchor} />
      <div className={locals.connectionLine} />
      <div className={locals.connectionAnchor} />
    </div>
  );
}
