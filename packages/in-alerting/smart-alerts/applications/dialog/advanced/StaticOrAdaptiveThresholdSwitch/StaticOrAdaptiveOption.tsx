/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { RadioButton } from '@instana/components';

import {
  StaticOrAdaptiveType,
  staticOrAdaptiveThresholds,
  tearSheetStaticOrAdaptiveThresholds
} from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/config';
import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import OptionBox from 'in-applications/components/OptionBox';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch.mless';

interface Props {
  currentType: StaticOrAdaptiveType;
  baselineType: StaticOrAdaptiveType;
  onChange: (baselineType: StaticOrAdaptiveType) => void;
  isTearSheet?: boolean;
}

export default function StaticOrAdaptiveOption({ currentType, baselineType, onChange, isTearSheet }: Props) {
  const { icon, title, description, featureFeedbackLink } = isTearSheet
    ? tearSheetStaticOrAdaptiveThresholds.info[baselineType]
    : staticOrAdaptiveThresholds.info[baselineType];

  return (
    <>
      {isTearSheet && (
        <RadioButton
          key={Math.random()}
          label={<LabelDescriptionWithIcon icon={icon} label={title} description={description} />}
          checked={currentType === baselineType}
          onChange={() => onChange(baselineType)}
        />
      )}
      {!isTearSheet && (
        <OptionBox
          icon={icon}
          title={title}
          className={classNames(locals.optionBox, { [locals.optionBoxUnchecked]: currentType !== baselineType })}
          description={description}
          checked={currentType === baselineType}
          onChange={() => onChange(baselineType)}
          featureFeedbackLink={featureFeedbackLink}
          asRadioButton
        />
      )}
    </>
  );
}
