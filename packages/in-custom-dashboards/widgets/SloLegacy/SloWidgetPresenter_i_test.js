/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import useSliConfiguration from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration';
import useMonitoredEntity from 'in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity';
import SloWidgetPresenter from 'in-custom-dashboards/widgets/SloLegacy/SloWidgetPresenter';
import useSloMetrics from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSloMetrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { t } from 'in-i18n';

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useSliConfiguration', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useMonitoredEntity', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('in-custom-dashboards/widgets/SloLegacy/hooks/useSloMetrics', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('in-applications/hooks/useTagCatalog', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/SloLegacy/SloWidgetPresenter', () => {
  beforeEach(jest.clearAllMocks);

  const widgetConfig = {
    entityType: 'application',
    entityId: 'test-entity',
    slo: 0,
    sliConfigId: 'test-config',
    timeWindowType: 'dynamic'
  };

  const useTagCatalogReturnValue = { errors: [], progress: { loading: false } };
  const sliConfigurationMock = { id: widgetConfig.sliConfigId, sliEntity: { sliType: widgetConfig.entityType } };
  const sloEntityMock = { id: widgetConfig.entityId, label: 'Test Entity Label' };
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
  it('should render loader and skeletons if status are pending.', async () => {
    useTagCatalog.mockReturnValue(useTagCatalogReturnValue);
    useSliConfiguration.mockReturnValue([sliConfigurationMock, 'pending', [], { loading: false }]);
    useMonitoredEntity.mockReturnValue([sloEntityMock, 'pending', [], { loading: true }]);
    useSloMetrics.mockReturnValue([[], 'pending', [], { loading: true }]);

    render(
      <SloWidgetPresenter
        actions={<></>}
        config={widgetConfig}
        isPreview
        title="Test SloWidgetPresenter"
        dragHandle={<></>}
      />
    );

    expect(screen.getByTestId('sli-summary-skeleton')).toBeVisible();
    expect(screen.getByTestId('widget-loader')).toBeVisible();
    expect(screen.getAllByTestId('slo-tile-skeleton')).toHaveLength(3);
  });

  it('should render correctly if status are resolved.', async () => {
    useTagCatalog.mockReturnValue(useTagCatalogReturnValue);
    useSliConfiguration.mockReturnValue([sliConfigurationMock, 'resolved', [], { loading: false }]);
    useMonitoredEntity.mockReturnValue([sloEntityMock, 'resolved', [], { loading: false }]);
    useSloMetrics.mockReturnValue([[], 'resolved', [], { loading: false }]);

    render(
      <SloWidgetPresenter actions={<></>} config={widgetConfig} isPreview title="Test Widget" dragHandle={<></>} />
    );

    expect(screen.getByText('Test Widget')).toBeVisible();
    expect(screen.getByText('Test Entity Label')).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.status'), { exact: false })).toBeVisible();
    expect(screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.target'), { exact: false })).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.errorBudgetSpent'), { exact: false })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.errorBudget'), { exact: false })
    ).toBeVisible();
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.slo.sliSummary.timeWindowType', { context: 'dynamic' }), {
        exact: false
      })
    ).toBeVisible();
  });
});
