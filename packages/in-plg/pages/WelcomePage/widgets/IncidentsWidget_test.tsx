/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import IncidentsWidget from 'in-plg/pages/WelcomePage/widgets/IncidentsWidget';

describe('Incidents Widget Tests', () => {
  it('render incidents widget without crashing', () => {
    render(<IncidentsWidget />);
  });

  it('displays correct headers for incidents', () => {
    render(<IncidentsWidget />);
    expect(screen.getByText(t('in-plg:welcomepage.component.incidentsWidget.title'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.incidentsWidget.on'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.incidentsWidget.started'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.incidentsWidget.end'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.incidentsWidget.severity'))).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<IncidentsWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
