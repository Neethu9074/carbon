/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import { t } from 'in-i18n';

describe('in-alerting/components/AlertPropertyInfos', () => {
  it('renders component correctly', () => {
    const props = {
      alertConfig: { name: 'foo', description: 'bar', severity: 5 },
      disableTrigger: false
    };

    render(<AlertPropertyInfos {...props} />);

    expect(screen.getByText(t('in-alerting:components.alertPropertyInfosLabelTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:components.alertPropertyInfosLabelDescription'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:components.alertPropertyInfosLabelTriggersIncident'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:components.alertPropertyInfosLabelAlertLevel'))).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:components.alertPropertyInfosWarning'))).toBeInTheDocument();
  });
});
