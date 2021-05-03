/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { boundaryScopes } from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/config';

import locals from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls.mless';

export default function ReadOnlyInboundOutboundCalls({ alertConfig }) {
  const { icon, text, dashboard } = boundaryScopes.info[alertConfig.boundaryScope];
  return (
    <div className={locals.container}>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <div className={locals.title}>{text}</div>
        <div className={locals.description}>{dashboard}</div>
      </div>
    </div>
  );
}
