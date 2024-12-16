/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import ThroughputThresholdCondition from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThroughputThresholdCondition';
import { blueprintConfig } from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/SlownessThresholdCondition_test';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdOperatorDropDown';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ThroughputThresholdCondition', () => {
  let props;
  beforeEach(() => {
    props = {
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig,
      editMode: false,
      isGlobalSmartAlert: false
    };
  });
  it('renders correctly ..', () => {
    render(<ThroughputThresholdCondition {...props} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.threshold.thresholdValue'))
    ).toBeInTheDocument();
  });

  it('test ThresholdOperatorDropDown onChange function', () => {
    const wrapper = shallow(<ThroughputThresholdCondition {...props} />);

    wrapper.find(ThresholdOperatorDropDown).props().customOnChange();
    expect(props.updateForm).toHaveBeenCalled();
  });
});
