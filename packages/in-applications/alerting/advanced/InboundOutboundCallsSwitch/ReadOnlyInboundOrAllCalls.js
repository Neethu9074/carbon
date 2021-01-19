/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { boundaryScopes } from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/config';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ReadOnlyInboundOrAllCalls.mless';

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
