/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import ServiceLevelsWidget from 'in-plg/pages/WelcomePage/widgets/ServiceLevelsWidget';

describe('Service Levels Widget Tests', () => {
  const mockDashboardTileProps = {
    key: 1,
    header: 'Service level objectives'
  };

  it('render service level objectives widget without crashing', () => {
    render(<ServiceLevelsWidget dashboardTileProps={mockDashboardTileProps} />);
  });

  it('displays correct headers for service level objectives', () => {
    render(<ServiceLevelsWidget dashboardTileProps={mockDashboardTileProps} />);
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.name'))).toBeInTheDocument();
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.entity'))).toBeInTheDocument();
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.blueprint'))).toBeInTheDocument();
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.errorBudget'))).toBeInTheDocument();
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.status'))).toBeInTheDocument();
    expect(screen.getByText(t('in-service-levels:sloList.columnLabels.tags'))).toBeInTheDocument();
  });

  it('Check if search is renedered', () => {
    const { getByLabelText } = render(<ServiceLevelsWidget dashboardTileProps={mockDashboardTileProps} />);
    const svgElement = getByLabelText('Handle button');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement.tagName).toBe('svg');
  });
});
