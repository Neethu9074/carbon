/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import PredictiveTriggerDescription from 'in-alerting/smart-alerts/infrastructure/details/PredictiveTriggerDescription';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/details/PredictiveTriggerDescription', () => {
  it('renders correctly when there is no predictive trigger', () => {
    // WHEN
    const wrapper = shallow(<PredictiveTriggerDescription predictiveTrigger={null} />);

    // THEN
    expect(wrapper.type()).toEqual(null);
  });

  it('renders correctly when there is a predictive trigger', () => {
    // WHEN
    render(<PredictiveTriggerDescription predictiveTrigger={{ timeToFailure: 60000 }} />);
    const formattedTimeToFailure = formatDurationAccurately(60000, 60000, false);
    // THEN
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.alertTitle', {
          value: formattedTimeToFailure
        })
      )
    ).toBeInTheDocument();
  });
});
