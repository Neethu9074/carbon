/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import ForecastAlertingDescription from 'in-alerting/smart-alerts/infrastructure/details/ForecastAlertingDescription';

describe('in-alerting/smart-alerts/infrastructure/details/ForecastAlertingDescription', () => {
  it('renders correctly when there is no predictive trigger', () => {
    // WHEN
    const wrapper = shallow(<ForecastAlertingDescription forecastingConfig={null} />);

    // THEN
    expect(wrapper.type()).toEqual(null);
  });

  it('renders correctly when there is a forecastingConfig', () => {
    // WHEN
    render(
      <ForecastAlertingDescription
        forecastingConfig={{
          forecastTimeframe: 60000,
          fitTimeframe: 120000
        }}
      />
    );
    // THEN
    expect(screen.getByText('up to 1 minute')).toBeInTheDocument();
    expect(screen.getByText('last 2 minutes')).toBeInTheDocument();
  });
});
