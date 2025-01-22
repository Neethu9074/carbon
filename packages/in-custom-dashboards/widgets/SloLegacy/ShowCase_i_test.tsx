/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ShowCase from 'in-custom-dashboards/widgets/SloLegacy/ShowCase';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/SloLegacy/ShowCase', () => {
  global.matchMedia =
    global.matchMedia ||
    function () {
      return {
        matches: false,
        matchMedia: function () {},
        addEventListener: function () {},
        removeListener: function () {}
      };
    };

  it('should render the render without an issue', async () => {
    render(<ShowCase />);

    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.status'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.title'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.demo.appName'), { exact: false })).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.timeWindow'), { exact: true })
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
