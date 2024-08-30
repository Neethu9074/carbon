/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { timeThresholdTypes } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/formData';
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

export default function ConfigureTimeWindow({
  label,
  timeThresholdType,
  onChange,
  granularity,
  granularityInMinutes,
  timeThresholdTimeWindow,
  min = 1,
  maxTimeWindow = 12,
  step = 1,
  hasErrorViolations,
  hasErrorTimeWindow,
  type = 'number',
  onChangeViolations,
  violations,
  maxViolations
}) {
  return (
    <AlertThresholdConfigItemContainer
      noIcon
      isTearSheet
      isColumns3WithError={timeThresholdType !== timeThresholdTypes.violationsInPeriod && hasErrorTimeWindow}
      isTSFiveColumn={
        timeThresholdType === timeThresholdTypes.violationsInPeriod && !hasErrorViolations && !hasErrorTimeWindow
      }
      isTSColumn5WithErrorOn1stField={
        timeThresholdType === timeThresholdTypes.violationsInPeriod && hasErrorViolations && !hasErrorTimeWindow
      }
      isTSColumn5WithErrorOnBothField={
        timeThresholdType === timeThresholdTypes.violationsInPeriod && hasErrorViolations && hasErrorTimeWindow
      }
    >
      <AlertTypography variant={'body-regular'} color={'color900'} content={label} noMargin />

      {timeThresholdType === timeThresholdTypes.violationsInPeriod && (
        <>
          <DebouncedInput
            delay={300}
            id="violationCount"
            data-testid="violationCountInput"
            name="violationCountInput"
            type={type}
            min={min}
            max={maxViolations}
            step={step}
            onValueChange={value => {
              if (value && value > maxViolations) {
                value = maxViolations;
              }
              onChangeViolations(value);
            }}
            value={violations}
            hasError={hasErrorViolations}
            pure={false}
          />
          <AlertTypography
            variant={'body-small'}
            color={'color600'}
            content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.outOfConsecutiveEvaluations')}
            noMargin
          />
        </>
      )}
      <DebouncedInput
        delay={300}
        id="timeWindow"
        name="timeWindowInput"
        data-testid="timeWindowInput"
        type={type}
        min={min}
        max={maxTimeWindow}
        step={step}
        onValueChange={value => {
          if (value && value > maxTimeWindow) {
            value = maxTimeWindow;
          }
          onChange(value * granularity);
        }}
        value={timeThresholdTimeWindow / granularity ?? ''}
        hasError={hasErrorTimeWindow}
        pure={false}
      />

      <AlertTypography
        variant={'body-small'}
        color={'color600'}
        content={t(
          'in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsPostLabel',
          {
            granularity: granularityInMinutes
          }
        )}
        noMargin
      />
    </AlertThresholdConfigItemContainer>
  );
}

ConfigureTimeWindow.propTypes = {
  label: PropTypes.string.isRequired,
  timeThresholdType: PropTypes.string.isRequired,
  timeThresholdTimeWindow: PropTypes.number.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  granularityInMinutes: PropTypes.number,
  min: PropTypes.number,
  maxTimeWindow: PropTypes.number,
  step: PropTypes.number,
  hasErrorViolations: PropTypes.bool,
  hasErrorTimeWindow: PropTypes.bool,
  type: PropTypes.string,
  onChangeViolations: PropTypes.func,
  violations: PropTypes.number,
  maxViolations: PropTypes.number
};
