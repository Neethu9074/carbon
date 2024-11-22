/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useContext, useRef } from 'react';
import classNames from 'classnames';

import { Card } from '@instana/components';

import {
  getFilterResultNote,
  useFilteredMetricConfiguration
} from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import {
  CustomDashboardContext,
  CustomDashboardContextProps
} from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { customDashboardsExportPdfWidget, customDashboardsFastQueryModeEnabled } from 'in-services/featureFlags';
import { metricConfigurationPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import downloadPDFAction from 'in-components/Chart/components/ContextMenu/actions/downloadPDF';
import useResultData from 'in-custom-dashboards/widgets/Histogram/hooks/useResultData';
import { CUSTOM_DASHBOARD_WIDGET_DOWNLOAD_PDF } from 'in-services/tracking/tracking';
import WidgetCardHeader from 'in-components/WidgetCardHeader/WidgetCardHeader';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import HistogramChart from 'in-components/HistogramChart/HistogramChart';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { UnifiedMetricConfigurationUnion } from 'in-types';
import { HistogramConfig } from '../form';
import { t } from 'in-i18n';

import locals from './HistogramWidgetCard.mless';

export interface HistogramWidgetCardProps {
  title: string;
  useMaxAvailableHeight?: boolean;
  config: HistogramConfig;
  isInModal?: boolean;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  height?: number;
}

export default function HistogramWidgetCard({
  title,
  config: baseConfig,
  actions,
  dragHandle,
  isInModal,
  height,
  useMaxAvailableHeight
}: HistogramWidgetCardProps) {
  const { metricConfiguration, result: filterResult } = useFilteredMetricConfiguration(
    baseConfig[metricConfigurationPath] as UnifiedMetricConfigurationUnion
  );
  //Using stable instance to avoid unnecessary rendering
  const config = useStableObjectInstance({ ...baseConfig, metricConfiguration });
  const result = useResultData({ config });
  const ref = useRef<HTMLDivElement>(null);
  const { matchLocation } = useNavigation();
  const [tooltip, setTooltip] = React.useState<HTMLElement>(document.createElement('div'));
  const { setExportWidgetId, setTooltipRef, setShouldExportWidget } =
    useContext<CustomDashboardContextProps>(CustomDashboardContext);
  const { trackCta } = useSegmentTracking();

  const tooltipRef = (tooltip: HTMLElement) => (tooltip ? setTooltip(tooltip) : null);
  const isCustomDashboard = matchLocation(customDashboardsPath);

  const hasNoData = result?.data?.length === 0;
  const hasNoErrors = result?.errors.length === 0;
  const isLoading = result?.progress.loading;

  const selectionMenuItems = [];
  const approximateTooltipProps = {
    renderApproximateDataTooltip: false,
    approximateTooltipText: t('in-components:approximateDataIndicator.dataRetention')
  };

  // Add export to pdf only if in custom dashboards
  if (isCustomDashboard && customDashboardsExportPdfWidget) {
    selectionMenuItems.push({
      ...downloadPDFAction,
      onClick: () => {
        const cardNode = ref.current;
        const widgetNode = cardNode?.closest('[id^="widget-"]') as HTMLElement;
        const widgetId = widgetNode?.id.replace(/^widget-/, '') || '';
        trackCta(CUSTOM_DASHBOARD_WIDGET_DOWNLOAD_PDF, { widgetId });
        setTooltipRef(tooltip);
        setShouldExportWidget(true);
        downloadPDFAction.onClick({ widgetId, setExportWidgetId });
      }
    });
    if (
      customDashboardsFastQueryModeEnabled &&
      hasApplicationMetrics(baseConfig) &&
      result?.data?.some(elem => elem?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE')
    ) {
      approximateTooltipProps.renderApproximateDataTooltip = true;
      approximateTooltipProps.approximateTooltipText = t(
        'in-components:approximateDataIndicator.dataRetentionOrFastQueryMode'
      );
    }
  }

  return (
    <Card
      title={title}
      useMaxAvailableHeight={useMaxAvailableHeight}
      className={classNames({
        [locals.modal]: isInModal
      })}
      bodyClassName={classNames({
        [locals.modal]: isInModal
      })}
      headerClassName={classNames({
        [locals.modal]: isInModal
      })}
      leftHeaderContent={
        isInModal ? undefined : (
          <WidgetCardHeader {...approximateTooltipProps} extraInfoTooltip={getFilterResultNote(filterResult)} />
        )
      }
      rightHeaderContent={
        isInModal ? undefined : (
          <>
            {dragHandle}
            {actions}
          </>
        )
      }
    >
      <div
        ref={ref}
        className={classNames({
          [locals.container]: !hasNoData && hasNoErrors && !isLoading
        })}
      >
        <HistogramChart
          tooltipRef={tooltipRef}
          result={result}
          config={config}
          height={height}
          selectionMenuItems={selectionMenuItems}
        />
      </div>
    </Card>
  );
}
