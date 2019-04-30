import React, { Fragment } from 'react';
import { get } from 'lodash';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';
import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import { isUnknownTypeSpan } from 'in-analyze/TraceDetail/shared/CallHelper';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import HierarchicalLink from 'in-components/Link/HierarchicalLink';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ call, onClose, getColor }) {
  const service = get(call, ['destination', 'service']);
  const endpoint = get(call, ['destination', 'endpoint']);

  const isLogSpan = get(call, ['spans', '0', 'name'], '').indexOf('log') === 0 && call.spans.length === 1;

  return (
    <Fragment>
      <h1 className={locals.title}>
        Call Details
        <CloseButton onClick={onClose} />
      </h1>
      <Seperator />

      {call && (
        <div className={locals.entityInformation}>
          <span className={locals.callLabel}>{call.label || 'Undefined'}</span>
          {!isUnknownTypeSpan(call) &&
            endpoint &&
            !isLogSpan && (
              <Pill kind="light" color={getColorForEndpointType(endpoint.type)}>
                {endpoint.type}
              </Pill>
            )}
        </div>
      )}
      {service &&
        endpoint &&
        service.id !== 'ROOT' &&
        service.id !== 'UNKNOWN' && (
          <Fragment>
            <span className={locals.serviceLabel}>Service</span>

            <div className={locals.serviceLine}>
              <div className={locals.rect} style={{ background: getColor({ service, endpoint }) }} />
              <span className={locals.text}>{endpoint.type === 'INTERNAL' ? 'In' : 'To'}</span>
              <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" width={24} height={24} />
              <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: service.id })}>
                {endpoint.label}
              </Link>
              <span className={locals.text}>of</span>
              <SvgIcon className={locals.entityIcon} type="lib_application_service" width={24} height={24} />
              <Link className={locals.link} href$={getServiceDashboard(service.id)}>
                {service.label}
              </Link>
            </div>
          </Fragment>
        )}
      <Infrastructure call={call} />
    </Fragment>
  );
}

const Infrastructure = connectTo(({ call }) => {
  let snapshotId =
    get(call, ['destination', 'physicalContext', 'process', 'id']) ||
    get(call, ['destination', 'physicalContext', 'cluster', 'id']) ||
    get(call, ['destination', 'physicalContext', 'container', 'id']) ||
    get(call, ['destination', 'physicalContext', 'host', 'id']);
  if (!snapshotId) {
    return {};
  }

  return {
    snapshot: getSnapshot(snapshotId, getTimeConfigAtMoment(call.start))
  };
})(function Infrastructure({ snapshot, call }) {
  if (!snapshot) {
    return null;
  }

  return (
    <Fragment>
      <span className={locals.infraLabel}>Infrastructure</span>
      <div className={locals.infraLine}>
        <HierarchicalLink
          snapshot={snapshot}
          calculateHierarchy
          pathname={physicalDashboardPath}
          linkClassName={locals.infraLink}
          kind="dark"
          timeConfig={getTimeConfigAtMoment(call.start)}
        />
      </div>
    </Fragment>
  );
});

function CloseButton({ onClick }) {
  return (
    <Tooltip content="Close call details">
      <SvgIcon
        className={locals.closeIcon}
        onClick={onClick}
        aria-label="Close call details"
        type="lib_openclose_cancel"
        width={24}
        height={24}
      />
    </Tooltip>
  );
}
