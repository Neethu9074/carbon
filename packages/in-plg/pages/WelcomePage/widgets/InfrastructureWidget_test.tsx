/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import InfrastructureWidget from 'in-plg/pages/WelcomePage/widgets/InfrastructureWidget';

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

describe('Infrastructure Widget Tests', () => {
  it('render infrastructure widget without crashing', () => {
    render(<InfrastructureWidget />);
  });

  it('displays correct headers for infrastructure widget when type selected is host', () => {
    render(<InfrastructureWidget infraTypeValue={'host'} />);
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.technologies'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.os'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.cpuNum'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.health'))).toBeInTheDocument();
  });

  it('displays correct headers for infrastructure widget when type selected is docker', () => {
    render(<InfrastructureWidget infraTypeValue={'docker'} />);
    fireEvent.click(screen.getByText('Containers'));
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.technologies'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.created'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.started'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.health'))).toBeInTheDocument();
  });

  it('displays correct headers for infrastructure widget when type selected is docker', () => {
    render(<InfrastructureWidget infraTypeValue={'process'} />);
    fireEvent.click(screen.getByText('Processes'));
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.technologies'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.cpuUsage'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.infrastructureWidget.health'))).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<InfrastructureWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
