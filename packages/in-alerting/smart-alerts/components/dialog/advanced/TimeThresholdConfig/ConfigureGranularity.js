/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import DebouncedRestrictedSlider from 'in-components/Slider/DebouncedRestrictedSlider';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import { t } from 'in-i18n';

const defaultAllowedGranularity = [5, 10, 15, 20, 30];
const adaptiveBaselineAllowedGranularity = [10, 15, 20, 30];

export function getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed) {
  return getAllowedGranularities(thresholdType, oneMinuteGranularityAllowed).map(min => ({
    value: min,
    label: `${min} min`,
    millis: minutes.toMillis(min)
  }));
}

function getAllowedGranularities(thresholdType, oneMinuteGranularityAllowed) {
  if (thresholdType === ADAPTIVE_BASELINE) {
    return adaptiveBaselineAllowedGranularity;
  }
  return oneMinuteGranularityAllowed ? [1].concat(defaultAllowedGranularity) : defaultAllowedGranularity;
}

export function getDefaultMark(marks, thresholdType) {
  return thresholdType === ADAPTIVE_BASELINE ? 20 : 10;
}

export default function ConfigureGranularity({ onChange, granularity, thresholdType, oneMinuteGranularityAllowed }) {
  const marks = getMarksForThresholdType(thresholdType, oneMinuteGranularityAllowed);
  const currentValue = marks.find((i => i.millis === granularity) ?? getDefaultMark(marks, thresholdType)).value;

  return (
    <AlertThresholdConfigItemContainer noIcon>
      <Stack gap="xsmall" align="center" direction="horizontal">
        <label>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigEvaluationGranularity')}
        </label>
        <Tooltip
          align="bottomMiddle"
          content={t('in-alerting:smartAlerts.components.smartAlertDialog.granularityTooltipText')}
        >
          <SvgIcon type="lib_help_error_info_outline" size="s" color={themes.default.ids.color.option.neutral['700']} />
        </Tooltip>
      </Stack>

      <DebouncedRestrictedSlider
        marks={marks}
        max={marks[marks.length - 1].value}
        min={0}
        value={currentValue}
        onChange={value => {
          onChange(minutes.toMillis(value));
        }}
        valueLabelDisplay="off"
        key={currentValue}
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureGranularity.propTypes = {
  onChange: PropTypes.func,
  granularity: PropTypes.number.isRequired,
  thresholdType: PropTypes.string,
  oneMinuteGranularityAllowed: PropTypes.bool
};
