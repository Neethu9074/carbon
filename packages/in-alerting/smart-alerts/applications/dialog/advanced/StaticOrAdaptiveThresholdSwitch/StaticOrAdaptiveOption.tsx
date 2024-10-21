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
  isDisabled?: boolean;
  badgeTitle?: string;
  tooltipContent?: string;
}

export default function StaticOrAdaptiveOption({
  currentType,
  baselineType,
  onChange,
  isTearSheet,
  isDisabled,
  badgeTitle,
  tooltipContent
}: Props) {
  const { icon, title, description, isBeta } = isTearSheet
    ? tearSheetStaticOrAdaptiveThresholds.info[baselineType]
    : staticOrAdaptiveThresholds.info[baselineType];

  return (
    <>
      {isTearSheet && (
        <RadioButton
          key={Math.random()}
          label={
            <LabelDescriptionWithIcon
              icon={icon}
              label={title}
              description={description}
              disabled={isDisabled}
              badgeTitle={badgeTitle}
              tooltipContent={tooltipContent}
            />
          }
          checked={currentType === baselineType}
          onChange={() => onChange(baselineType)}
          disabled={isDisabled}
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
          isBeta={isBeta}
          asRadioButton
        />
      )}
    </>
  );
}
