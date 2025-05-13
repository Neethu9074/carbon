/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode, useRef } from 'react';
import classNames from 'classnames';

import { Card } from '@instana/components';

import {
  getFilterResultNote,
  useFilteredMetricConfiguration
} from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
// @ts-expect-error needs ts migration
import { customDashboardsPath } from 'in-custom-dashboards/navigation/url';
import { customDashboardsExportPdfWidget, customDashboardsFastQueryModeEnabled } from 'in-services/featureFlags';
import { metricConfigurationPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { useCustomDashboardContext } from 'in-custom-dashboards/CustomDashboard/CustomDashboardContext';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import downloadPDFAction from 'in-components/Chart/components/ContextMenu/actions/downloadPDF';
import useResultData from 'in-custom-dashboards/widgets/Histogram/hooks/useResultData';
import WidgetCardHeader from 'in-components/WidgetCardHeader/WidgetCardHeader';
import { HistogramConfig } from 'in-custom-dashboards/widgets/Histogram/form';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import HistogramChart from 'in-components/HistogramChart/HistogramChart';
import usePdfExport from 'in-components/DownloadPdf/hooks/usePdfExport';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { UnifiedMetricConfigurationUnion } from 'in-types';
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
  const { PdfExportRenderer } = usePdfExport();
  const { exportWidgetToPdf } = useCustomDashboardContext();
  //Using stable instance to avoid unnecessary rendering
  const config = useStableObjectInstance({ ...baseConfig, metricConfiguration });
  const result = useResultData({ config });
  const ref = useRef<HTMLDivElement>(null);
  const { matchLocation } = useNavigation();
  const [tooltip, setTooltip] = React.useState<HTMLElement>(document.createElement('div'));

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
      onClick: () => exportWidgetToPdf({ target: ref?.current, tooltipRef: tooltip, isHistogram: true })
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
      {PdfExportRenderer}
    </Card>
  );
}
