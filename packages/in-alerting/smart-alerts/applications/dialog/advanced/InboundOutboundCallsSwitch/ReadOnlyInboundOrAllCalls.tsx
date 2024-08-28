/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { boundaryScopes } from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import { ApplicationSmartAlertConfig } from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls.mless';

interface Props {
  alertConfig: ApplicationSmartAlertConfig;
}

export default function ReadOnlyInboundOutboundCalls({ alertConfig }: Props) {
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
