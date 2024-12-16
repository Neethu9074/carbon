/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import ProvideLogMessage from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/ProvideLogMessage';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
//@ts-expect-error
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('ProvideLogMessage', () => {
  const logsAlertConfig = {
    ...alertConfig,
    rules: [{ rule: { level: 'ERROR', alertType: 'logs', message: '', metricName: 'calls', operator: 'EQUALS' } }]
  };
  let props: any;
  beforeEach(() => {
    props = {
      form: createSmartAlertForm(logsAlertConfig as any, true, true),
      updateForm: jest.fn(),
      timeConfig: {
        windowSize: 604800000
      }
    };
  });

  it('renders correctly', () => {
    render(<ProvideLogMessage {...props} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.components.provideLogMessageLogLevel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.components.provideLogMessageErrorMessage'))
    ).toBeInTheDocument();
  });

  it('test levelField onChange event', () => {
    const wrapper = shallow(<ProvideLogMessage {...props} />);

    //@ts-expect-error type error
    wrapper.find('[name="ruleLevel"]').props().onChange();
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test operatorField onChange event', () => {
    const wrapper = shallow(<ProvideLogMessage {...props} />);

    //@ts-expect-error type error
    wrapper.find('[name="ruleOperator"]').props().onChange();
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test ruleMessage onChange event', () => {
    const wrapper = shallow(<ProvideLogMessage {...props} />);

    //@ts-expect-error type error
    wrapper.find(DebouncedTextArea).props().onValueChange();
    expect(props.updateForm).toHaveBeenCalled();
  });
});
