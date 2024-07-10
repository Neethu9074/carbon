/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import ApplicationWidget from 'in-plg/pages/WelcomePage/widgets/ApplicationWidget';

describe('Application Widget Tests', () => {
  it('render application widget without crashing', () => {
    render(<ApplicationWidget />);
  });

  it('displays correct headers for applicatons', () => {
    render(<ApplicationWidget />);
    expect(screen.getByText(t('in-plg:welcomepage.component.applicationWidget.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.applicationWidget.calls'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.applicationWidget.latency'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.applicationWidget.erroneousCallRate'))).toBeInTheDocument();
    expect(screen.getByText(t('in-plg:welcomepage.component.applicationWidget.health'))).toBeInTheDocument();
  });

  it('render application with add button', () => {
    jest.mock('in-stores/permission', () =>
      jest.fn(() => {
        return true;
      })
    );

    const { container } = render(<ApplicationWidget playwithEnabled={false} />);
    const addButton = container.querySelector('button.dashboardButton') as Element | Node | Document | Window;
    expect(addButton).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<ApplicationWidget />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
