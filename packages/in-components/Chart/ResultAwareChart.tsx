/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, HorizontalIndicator, LoadingSkeleton, Message } from '@instana/components';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import Chart, { ChartReactComponentProps } from 'in-components/Chart/ChartReactComponent';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
// @ts-expect-error
import PieChart from 'in-components/PieChart';
import { AxisConfiguration } from 'in-components/Chart/types';
import Renderer from 'in-components/Chart/renderer/Renderer';
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
    customChartSkeletonHeight
  } = config;
  let content;

  const height = customHeight || '100%';
  if (result.errors.length > 0) {
    content = (
      <Message
        type="warning"
        withIcon
        title={t('in-components:chart.resultAwareChartSomethingWentWrong')}
        description={
          renderErrorDetail && ['CLIENT', 'VALIDATION'].includes(result.errors[0].code)
            ? result.errors[0].message
            : t('in-components:chart.resultAwareChartPleaseTryAgainLater')
        }
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
    if (config.y1?.renderer.id === Renderer.pie.id) {
      content = <PieChart renderLegend={renderLegend} config={config} />;
    } else {
      config = normalizeTimeShiftedTimestamps(config as ChartReactComponentProps);
      content = <Chart renderLegend={renderLegend} {...(config as ChartReactComponentProps)} />;
    }
  }

  if (title == null) {
    return content;
  }

  const leftHeaderContent =
    renderHistoricDataIndicator && hasApproximateData ? (
      <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
    ) : (
      undefined
    );

  const card = (
    <Card
      title={title}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      leftHeaderContent={leftHeaderContent}
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
