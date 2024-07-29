/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ConfigureTimeWindow from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTimeWindow';
import { t } from 'in-i18n';

describe('ConfigureTimeWindow : in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureTimeWindow', () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const onChangeViolations = jest.fn();
  const granularityInMinutes = 10;
  it('should render correctly and changa inputs', async () => {
    render(
      <ConfigureTimeWindow
        label={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter')}
        timeThresholdType="violationsInPeriod"
        granularity={600000}
        granularityInMinutes={granularityInMinutes}
        timeThresholdTimeWindow={600000}
        onChange={onChange}
        onChangeViolations={onChangeViolations}
        violations={1}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.outOfConsecutiveEvaluations'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsPostLabel', {
          granularity: granularityInMinutes
        })
      )
    ).toBeInTheDocument();

    const timeWindowInput = screen.getByTestId('timeWindowInput');
    await user.type(timeWindowInput, '5');
    expect(onChange).toHaveBeenCalled();
    const violationCountInput = screen.getByTestId('violationCountInput');
    await user.type(violationCountInput, '2');
    expect(onChangeViolations).toHaveBeenCalled();
  });
  it('Violations in random intervals', async () => {
    render(
      <ConfigureTimeWindow
        label={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter')}
        timeThresholdType="violationsInSequence"
        granularity={600000}
        granularityInMinutes={granularityInMinutes}
        timeThresholdTimeWindow={600000}
        onChange={onChange}
        onChangeViolations={onChangeViolations}
        violations={1}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter'))
    ).toBeInTheDocument();
    expect(
      screen.queryByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.outOfConsecutiveEvaluations'))
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfConsecutiveViolationsPostLabel', {
          granularity: granularityInMinutes
        })
      )
    ).toBeInTheDocument();
  });
});
