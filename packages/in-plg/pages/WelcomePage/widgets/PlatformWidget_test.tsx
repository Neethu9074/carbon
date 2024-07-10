/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import PlatformWidget from 'in-plg/pages/WelcomePage/widgets/PlatformWidget';

describe('Platform Widget Tests', () => {
  it('render platform widget without crashing', () => {
    render(<PlatformWidget />);
  });

  it('displays correct headers for platform', () => {
    render(<PlatformWidget />);
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.platform'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.nodes'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.namespaces'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.pods'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.platformWidget.health'))).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<PlatformWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
