/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { boundaryScopes } from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/config';
import OptionBox from 'in-applications/components/OptionBox';

import locals from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function InboundOrAllCallsOption({ boundaryScope, onBoundaryStateChange, scope }) {
  const { icon, text, dashboard } = boundaryScopes.info[scope];
  return (
    <OptionBox
      icon={icon}
      title={text}
      asRadioButton
      className={classNames({
        [locals.optionBox]: true,
        [locals.optionBoxUnchecked]: scope !== boundaryScope
      })}
      description={dashboard}
      checked={scope === boundaryScope}
      onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
    />
  );
}
