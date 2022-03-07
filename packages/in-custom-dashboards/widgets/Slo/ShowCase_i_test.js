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

    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.status'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.title'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.appName'), { exact: false })).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.timeWindow'), { exact: false })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.rollingTimeWindow'), { exact: false })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudgetSpent'), { exact: false })
    ).toBeVisible();

    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.errorBudget'), { exact: false })
    ).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.widgetHeader.target'), { exact: false })).toBeVisible();
  });
});
