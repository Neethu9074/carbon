/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCase from './ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Slo/ShowCase', () => {
  it('should render the render without an issue', async () => {
    render(<ShowCase />);

    await screen.findByText(t('in-custom-dashboards:widgets.slo.widgetHeader.status'));
    await screen.findByText(t('in-custom-dashboards:widgets.slo.demo.title'));
    await screen.findByText(t('in-custom-dashboards:widgets.slo.demo.appName'));
    await screen.findByText(t('in-custom-dashboards:widgets.slo.widgetHeader.timeWindow'));
    await screen.findByText(t('in-custom-dashboards:widgets.slo.widgetHeader.rollingTimeWindow'));
    await screen.findByText(t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudgetSpent'));

    const errorBudgetItems = await screen.findAllByText(t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudget'));
    const targetItems = await screen.findAllByText(t('in-custom-dashboards:widgets.slo.widgetHeader.target'));

    expect(errorBudgetItems).toHaveLength(2);
    expect(targetItems).toHaveLength(2);
  });
});
