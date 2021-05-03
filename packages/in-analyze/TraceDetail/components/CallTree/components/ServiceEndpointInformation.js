/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { getServiceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { isUnknownTypeSpan, isInternalCall } from 'in-analyze/TraceDetail/shared/CallHelper';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ServiceEndpointInformation.mless';

export default function ServiceEndpointInformation({ call, nonInternalParentCall, onCallClicked, marginLeft }) {
  if (
    ((!call.service || call.service.id === 'UNKNOWN') && (!call.endpoint || call.endpoint.id === 'UNKNOWN')) ||
    isUnknownTypeSpan(call)
  ) {
    return null;
  }

  const handleCallLinkClick = e => {
    e.preventDefault();
    e.stopPropagation();
    onCallClicked(nonInternalParentCall);
  };

  return (
    <div
      style={{
        marginLeft: `${marginLeft}px`
      }}
      className={locals.serviceEndpointInformation}
    >
      <span className={locals.text}>{isInternalCall(call) ? 'In' : 'To'}</span>

      <SvgIcon className={locals.endpointIcon} type="lib_application_endpoint" size="xs" />
      <Tooltip themeStyle="light" content={call.endpoint.label}>
        <Link className={locals.link} href$={getEndpointDashboard(call.endpoint.id, { serviceId: call.service.id })}>
          {call.endpoint.label}
        </Link>
      </Tooltip>

      <span className={locals.text}>{t('in-analyze:traceDetail.components.callTree.of')}</span>

      <SvgIcon className={locals.serviceIcon} type="lib_application_service" size="xs" />
      <Tooltip themeStyle="light" content={call.service.label}>
        <Link className={locals.link} href$={getServiceDashboard(call.service.id)}>
          {call.service.label}
        </Link>
      </Tooltip>

      {isInternalCall(call) && nonInternalParentCall && (
        <Fragment>
          <span className={locals.text}>{t('in-analyze:traceDetail.components.callTree.inheritedFrom')}</span>
          <Tooltip themeStyle="light" content={nonInternalParentCall.label}>
            <a className={locals.link} href="" onClick={handleCallLinkClick}>
              {nonInternalParentCall.label || 'Undefined'}
            </a>
          </Tooltip>
        </Fragment>
      )}
    </div>
  );
}
