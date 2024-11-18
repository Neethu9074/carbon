/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, HorizontalIndicator, LoadingSkeleton, Message } from '@instana/components';

import { AxisConfiguration, ChartConfig, MetricDataPoint, MetricsConfiguration } from 'in-components/Chart/types';
import Renderer, { extendTimeConfigForBarRenderer } from 'in-components/Chart/renderer/Renderer';
import Chart, { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import { clickhouseTimeoutErrorMessage } from 'in-components/AnalyzeView/utils';
import WidgetCardHeader from 'in-components/WidgetCardHeader/WidgetCardHeader';
import { getUnit, getUnitByFormatterFn } from 'in-stores/metric/units';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
// @ts-expect-error
import PieChart from 'in-components/PieChart';
import { FormatterFn } from 'in-stores/metric/formatters';
import { Result } from 'in-types';
import { t } from 'in-i18n';

import locals from './ResultAwareChart.mless';

export type ResultAwareChartConfig = Omit<ChartReactComponentProps, 'y1'> & {
  y1?: AxisConfiguration;
};

interface Props {
  config: ResultAwareChartConfig;
  renderLegend?: boolean;
  result: Result<unknown>;
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
}

export default function ResultAwareChart({ result, config, renderLegend = true }: Props) {
  let {
    timeConfig,
    y1,
    frontBufferWidth,
    customHeight,
    title,
    showNoDataInfoWhenEmpty = true,
    renderErrorDetail = false,
    renderHistoricDataIndicator = false,
    hasApproximateData,
    extraInfo,
    customChartSkeletonHeight,
    renderWidgetNotSupportedIndicator = false,
    granularity,
    extendBar = false,
    disableChartInLive,
    approximateTooltipText = t('in-components:approximateDataIndicator.dataRetention'),
    onLegendItemToggle
  } = config;

  let content;

  const height = customHeight || '100%';
  if (result.errors.length > 0) {
    const errorDescription = getErrorDescription(
      renderErrorDetail,
      result,
      t('in-components:chart.resultAwareChartPleaseTryAgainLater')
    );

    content = (
      <Message
        type="warning"
        withIcon
        title={t('in-components:chart.resultAwareChartSomethingWentWrong')}
        description={errorDescription}
      />
    );
  } else if (result.progress.loading) {
    if (config?.y1?.renderer.id === Renderer.pie.id) {
      content = <PieSkeleton height={height} />;
    } else {
      content = <ChartSkeleton height={customChartSkeletonHeight ?? height} />;
    }
  } else if (!timeConfig || !y1 || !y1.metrics || (showNoDataInfoWhenEmpty && containsOnlyEmptyData(y1.metrics))) {
    content = <NoDataAvailable width={frontBufferWidth} height={height} />;
  } else {
    const rendererId = config.y1?.renderer.id;
    if (rendererId === Renderer.pie.id) {
      if (unitForInfraMetricsEnabled) {
        config = convertMetricForAxis(config as ChartReactComponentProps);
      }
      content = <PieChart renderLegend={renderLegend} config={config} />;
    } else {
      if (extendBar && granularity && (rendererId === Renderer.bar.id || rendererId === Renderer.stackedBar.id)) {
        config.timeConfig = extendTimeConfigForBarRenderer(config.timeConfig, granularity);
      }
      config = normalizeTimeShiftedTimestamps(config as ChartReactComponentProps);
      if (unitForInfraMetricsEnabled) {
        config = convertMetricForAxis(config as ChartReactComponentProps);
      }
      content = (
        <Chart
          renderLegend={renderLegend}
          onLegendItemToggle={onLegendItemToggle}
          {...(config as ChartReactComponentProps)}
          disableChartInLive={disableChartInLive}
        />
      );
    }
  }

  if (title == null) {
    return content;
  }

  const card = (
    <Card
      headingVariant="heading-3"
      className={renderWidgetNotSupportedIndicator ? locals.disabledChart : ''}
      title={title}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      leftHeaderContent={
        <WidgetCardHeader
          renderApproximateDataTooltip={renderHistoricDataIndicator && hasApproximateData}
          approximateTooltipText={approximateTooltipText}
          renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
          extraInfoTooltip={extraInfo}
        />
      }
      rightHeaderContent={config.rightHeaderContent}
      size="l"
    >
      {content}
    </Card>
  );

  if (result.progress.loading) {
    return (
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator progress={result.progress} />
        {card}
      </div>
    );
  } else {
    return card;
  }
}

interface SkeletonProps {
  height: string | number;
}

function ChartSkeleton(skeletonProps: SkeletonProps) {
  return (
    <div className={locals.skeletonWrapper} style={{ height: skeletonProps.height }}>
      <LoadingSkeleton className={locals.legendSkeleton} />
      <LoadingSkeleton className={locals.chartSkeleton} />
    </div>
  );
}

function PieSkeleton(skeletonProps: SkeletonProps) {
  const pieSize = `calc(${skeletonProps.height} - 2rem)`;
  return (
    <div className={locals.skeletonWrapper} style={{ height: skeletonProps.height }}>
      <LoadingSkeleton className={locals.legendSkeleton} />
      <LoadingSkeleton className={locals.pieSkeleton} style={{ height: pieSize, width: pieSize }} />
    </div>
  );
}

function containsOnlyEmptyData(metrics: [number, number][][]) {
  for (const dataSeries of metrics) {
    if (dataSeries && dataSeries.length > 0) {
      return false;
    }
  }
  return true;
}

function convertMetricForAxis(config: ChartReactComponentProps) {
  return {
    ...config,
    y1:
      (config.y1 &&
        config.metricsConfiguration &&
        getConvertedMetricForUnits(config.y1, config.metricsConfiguration)) ??
      config.y1,
    y2:
      (config.y2 &&
        config.metricsConfiguration &&
        getConvertedMetricForUnits(config.y2, config.metricsConfiguration)) ??
      config.y2
  };
}

function getConvertedMetricForUnits(
  axisConfig: AxisConfiguration,
  metricConfig: MetricsConfiguration
): AxisConfiguration {
  const units = axisConfig?.metricIds?.map(id => getUnit(metricConfig?.metrics[id]?.unit ?? 'number'));
  const appliedUnit = getUnitByFormatterFn(axisConfig?.formatter as FormatterFn);
  const metrics = axisConfig?.metrics?.map((dataSeries: MetricDataPoint[], index) => {
    if (units[index]?.baseUnit === appliedUnit?.baseUnit) {
      return dataSeries.map(data => [data[0], units[index]?.converter(data[1])]) as MetricDataPoint[];
    }
    return dataSeries;
  });
  return {
    ...axisConfig,
    ...(metrics.length && { metrics })
  };
}

function normalizeTimeShiftedTimestamps(config: ChartReactComponentProps) {
  const copiedConfig = {
    ...config
  };
  if (config.y1) {
    copiedConfig.y1 = normalizeTimeShiftedTimestampsForAxis(config.y1);
  }
  if (config.y2) {
    copiedConfig.y2 = normalizeTimeShiftedTimestampsForAxis(config.y2);
  }

  return copiedConfig;
}

function normalizeTimeShiftedTimestampsForAxis(axis: AxisConfiguration) {
  if (!axis.timeShifts) {
    return axis;
  }

  const copiedAxis = {
    ...axis
  };

  copiedAxis.metrics = axis.timeShifts.map(({ offset }, i) => {
    if (offset === 0) {
      return axis.metrics[i];
    }

    return axis.metrics[i].map(([ts, v]) => [ts - offset, v]);
  });

  return copiedAxis;
}

function getErrorDescription(
  renderErrorDetail: boolean,
  result: Result<unknown>,
  defaultErrorDescription: string
): React.ReactNode {
  let errorDescription: React.ReactNode = defaultErrorDescription;

  if (renderErrorDetail) {
    if (
      result.errors
        .map(({ message }) => message)
        .some(
          message =>
            message.includes('The query would take too long to run') || message.includes(clickhouseTimeoutErrorMessage)
        )
    ) {
      errorDescription = <span>{`${t('in-components:error.timeout')} ${t('in-components:error.timeoutInfo')}`}</span>;
    } else if (['CLIENT', 'VALIDATION'].includes(result.errors[0].code)) {
      errorDescription = result.errors[0].message;
    }
  }

  return errorDescription;
}
