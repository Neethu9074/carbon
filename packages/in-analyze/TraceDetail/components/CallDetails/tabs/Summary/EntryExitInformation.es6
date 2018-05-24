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
      <ServiceEndpointInformation className={locals.serviceEndpointInformationFrom} spanRelation={call.source} />
      <ServiceEndpointInformation
        className={locals.serviceEndpointInformationTo}
        isCalled
        spanRelation={call.destination}
      />
    </div>
  );
}

function ServiceEndpointInformation({ className, spanRelation, isCalled }) {
  const service = get(spanRelation, 'service');
  const endpoint = get(spanRelation, 'endpoint');

  return (
    <div className={className}>
      <EntryOrExitWrapper isCalled={isCalled}>
        <div>
          <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
          {service ? (
            <Link className={locals.link} href$={getServiceDashboard(service.id)}>
              {service.label}
            </Link>
          ) : (
            <span className={locals.serviceLabel}>Unknown Service</span>
          )}
        </div>

        <div className={locals.endpointRow}>
          {endpoint && (
            <SvgIcon className={locals.endpointIcon} type="lib_application_endpoint" width={24} height={24} />
          )}
          {endpoint && (
            <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: get(service, 'id') })}>
              {endpoint.label}
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
      <div className={locals.connectionLineVertical} />
      <div className={locals.connectionLineHorizontal} />
    </div>
  );
}
