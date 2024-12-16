/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import ConfigureForecastTimeframe, {
  ConfigureForecastTimeframeProps
} from 'in-alerting/smart-alerts/infrastructure/components/ConfigureForecastTimeframe';
//@ts-expect-error
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/components/ConfigureForecastTimeframe.tsx', () => {
  const props: ConfigureForecastTimeframeProps = {
    form: alertFormDefinition(alertConfig, false),
    updateForm: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should contain predictiveTrigger forecastTimeframe label', () => {
    // GIVEN
    render(<ConfigureForecastTimeframe {...props} />);

    // THEN
    expect(
      screen.getByText(
        t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.forecastTimeframe')
      )
    ).toBeInTheDocument();
  });

  it('should call the updateForm function when the user selects an option from the dropdown menu', () => {
    // GIVEN
    const wrapper = shallow(<ConfigureForecastTimeframe {...props} />);

    // WHEN
    const select = wrapper.find(SelectInSection);
    select.simulate('change', { target: { value: 'minutes20' } });

    // THEN
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test ConfigureForecastTimeframe without updateForm', () => {
    // GIVEN
    const wrapper = shallow(<ConfigureForecastTimeframe form={alertFormDefinition(alertConfig, false)} />);

    // WHEN
    const select = wrapper.find(SelectInSection);
    select.simulate('change', { target: { value: 'minutes30' } });

    // THEN
    expect(props.updateForm).not.toHaveBeenCalled();
  });

  it('should set the predictiveTrigger field to 0', () => {
    // GIVEN
    const wrapper = shallow(<ConfigureForecastTimeframe form={alertFormDefinition(alertConfig, false)} />);

    // WHEN
    const select = wrapper.find(SelectInSection);
    select.simulate('change', { target: { value: 0 } });

    // THEN
    expect(props.updateForm).not.toHaveBeenCalled();
  });
});
