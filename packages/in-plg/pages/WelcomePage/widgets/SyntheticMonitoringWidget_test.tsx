/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import SyntheticMonitoringWidget from 'in-plg/pages/WelcomePage/widgets/SyntheticMonitoringWidget';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
  });
});

describe('Synthetic Monitoring Widget Tests', () => {
  it('render synthetic monitoring widget without crashing', () => {
    render(<SyntheticMonitoringWidget />);
  });

  it('displays correct headers for infrastructure widget when type selected is host', () => {
    render(<SyntheticMonitoringWidget syntheticTypeValue={'test'} />);
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.type'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.successRate'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.latency'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.health'))).toBeInTheDocument();
  });

  it('displays correct headers for infrastructure widget when type selected is host', () => {
    render(<SyntheticMonitoringWidget syntheticTypeValue={'location'} />);
    fireEvent.click(screen.getByText('Locations'));
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.type'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.lastTestRunOn'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.version'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.health'))).toBeInTheDocument();
  });

  it('displays correct headers for infrastructure widget when type selected is host', () => {
    render(<SyntheticMonitoringWidget syntheticTypeValue={'smartalerts'} />);
    fireEvent.click(screen.getByText('Smart alerts'));
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.timeThreshold'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.testsApplied'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.syntheticWidget.health'))).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<SyntheticMonitoringWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
