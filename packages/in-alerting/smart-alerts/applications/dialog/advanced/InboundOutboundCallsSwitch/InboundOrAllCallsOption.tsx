/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { RadioButton } from '@instana/components';

import {
  boundaryScopes,
  tearSheetBoundaryScopes
} from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import OptionBox from 'in-applications/components/OptionBox';
import { BoundaryScope } from 'in-types';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';

interface InboundOrAllCallsOptionProps {
  boundaryScope: BoundaryScope; // This is the currently selected value
  scope: Exclude<BoundaryScope, 'DEFAULT'>; // This is the scope to display in this option
  onBoundaryStateChange: (newValue: { boundaryScope: Exclude<BoundaryScope, 'DEFAULT'> }) => void;
  tearSheetView?: boolean;
}

export default function InboundOrAllCallsOption({
  boundaryScope,
  onBoundaryStateChange,
  scope,
  tearSheetView
}: InboundOrAllCallsOptionProps) {
  const { icon, text, dashboard } = tearSheetView ? tearSheetBoundaryScopes.info[scope] : boundaryScopes.info[scope];
  return (
    <>
      {tearSheetView && (
        <RadioButton
          key={text}
          label={<LabelDescriptionWithIcon icon={icon} label={text} description={dashboard} />}
          checked={scope === boundaryScope}
          onChange={() => onBoundaryStateChange({ boundaryScope: scope })}
        />
      )}
      {!tearSheetView && (
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
      )}
    </>
  );
}
