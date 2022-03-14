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

    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.status'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.title'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.appName'), { exact: false })).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.timeWindow'), { exact: false })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', { context: 'rolling' }), {
        exact: false
      })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.errorBudgetSpent'), { exact: false })
    ).toBeVisible();

    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.errorBudget'), { exact: false })
    ).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.target'), { exact: false })).toBeVisible();
  });
});
