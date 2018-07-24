import React, { Fragment } from 'react';
import { get } from 'lodash';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getColor as getColorForEndpointType } from 'in-applications/endpointTypes';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

import locals from './Header.mless';

export default function Header({ call, callTreeNode, onClose, getColor }) {
  const service = get(call, ['source', 'service']);
  const endpoint = get(call, ['source', 'endpoint']);

  return (
    <div>
      <div className={locals.entityInformation}>
        <span className={locals.callLabel}>{call.label}</span>
        {callTreeNode.endpoint && (
          <Pill kind="light" color={getColorForEndpointType(callTreeNode.endpoint.type)}>
            {callTreeNode.endpoint.type}
          </Pill>
        )}
        <CloseButton onClick={onClose} />
      </div>
      {service &&
        service.id !== 'ROOT' && (
          <Fragment>
            <span className={locals.serviceLabel}>Service</span>
            <div className={locals.serviceLine}>
              <div className={locals.rect} style={{ background: getColor({ service, endpoint }) }} />
              <SvgIcon className={locals.entityIcon} type="lib_application_service" width={24} height={24} />
              <Link className={locals.link} href$={getServiceDashboard(service.id)}>
                {service.label}
              </Link>
              <SvgIcon className={locals.chevron} type="lib_arrow_expand_right" width={16} height={16} />
              <SvgIcon className={locals.entityIcon} type="lib_application_service" width={24} height={24} />
              <Link className={locals.link} href$={getEndpointDashboard(endpoint.id, { serviceId: service.id })}>
                {endpoint.label}
              </Link>
            </div>
          </Fragment>
        )}
    </div>
  );
}

function CloseButton({ onClick }) {
  return (
    <SvgIcon
      className={locals.closeIcon}
      onClick={onClick}
      aria-label="Close sidebar"
      type="lib_openclose_cancel"
      width={24}
      height={24}
    />
  );
}
