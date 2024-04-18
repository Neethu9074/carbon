/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import OptionBox from 'in-applications/components/OptionBox';
import { BoundaryScope } from 'in-types';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';

interface InboundOrAllCallsOptionProps {
  boundaryScope: BoundaryScope; // This is the currently selected value
  scope: Exclude<BoundaryScope, 'DEFAULT'>; // This is the scope to display in this option
  onBoundaryStateChange: (newValue: { boundaryScope: Exclude<BoundaryScope, 'DEFAULT'> }) => void;
  boundaryScopes: any;
}

export default function InboundOrAllCallsOption({
  boundaryScope,
  onBoundaryStateChange,
  scope,
  boundaryScopes
}: InboundOrAllCallsOptionProps) {
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
