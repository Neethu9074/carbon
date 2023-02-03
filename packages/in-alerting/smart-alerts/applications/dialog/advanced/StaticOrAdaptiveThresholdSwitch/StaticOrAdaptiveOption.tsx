/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import {
  StaticOrAdaptiveType,
  staticOrAdaptiveThresholds
} from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/config';
import OptionBox from 'in-applications/components/OptionBox';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch.mless';

interface Props {
  currentType: StaticOrAdaptiveType;
  baselineType: StaticOrAdaptiveType;
  onChange: (baselineType: StaticOrAdaptiveType) => void;
}

export default function StaticOrAdaptiveOption({ currentType, baselineType, onChange }: Props) {
  const { icon, title, description, featureFeedbackLink } = staticOrAdaptiveThresholds.info[baselineType];

  return (
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
  );
}
