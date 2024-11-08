/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import LogMessages, {
  getColumnDefinition
} from 'in-alerting/smart-alerts/applications/tearSheet/components/LogMessages/LogMessages';
//@ts-expect-error
import LogMessagesList from 'in-alerting/smart-alerts/applications/components/LogMessagesList';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('LogMessages', () => {
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
    render(<LogMessages {...props} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.logMessages.selectLogMessageTitle'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:components.optional'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.applications.logMessages.levelColumn'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.applications.logMessages.messageColumn'))).toBeInTheDocument();
  });

  it('test onLogMessageSelect event', () => {
    const wrapper = shallow(<LogMessages {...props} />);

    //@ts-expect-error type error
    wrapper.find(LogMessagesList).props().onLogMessageSelect();
    expect(props.updateForm).toHaveBeenCalled();

    //@ts-expect-error type error
    wrapper.find(LogMessagesList).props().slideOut();
  });

  it('test getColumnDefinition ', () => {
    const message = '';
    const level = 'ERROR';
    const expected = [
      {
        id: 'radio',
        lable: '',
        width: 10,
        sortable: false,
        getContent: expect.any(Function)
      },
      {
        id: 'level',
        label: 'Log level',
        width: 20,
        sortable: false,
        getContent: expect.any(Function)
      }
    ];

    const result = getColumnDefinition(message, level);
    expect(result).toEqual(expected);
  });
});
