/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import BusinessMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/BusinessMonitoringWidget';

describe('Business Monitoring Widget Tests', () => {
  it('render business monitoring widget without crashing', () => {
    render(<BusinessMonitoringWidget />);
  });

  it('displays correct headers for business monitoring', () => {
    render(<BusinessMonitoringWidget />);
    expect(screen.getByText(t('in-plg:welcomepage.component.bizopsWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.bizopsWidget.activities'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.bizopsWidget.started'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.bizopsWidget.health'))).toBeInTheDocument();
  });

  it('Check if search is rendered', () => {
    const { getByLabelText } = render(<BusinessMonitoringWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
