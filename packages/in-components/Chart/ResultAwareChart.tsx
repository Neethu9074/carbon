/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, HorizontalIndicator, LoadingSkeleton, Message } from '@instana/components';

// @ts-ignore
import Renderer from 'in-components/Chart/renderer/Renderer';
// @ts-ignore
import Chart from 'in-components/Chart/ChartReactComponent';
import { Axis, Config } from 'in-components/Chart/ResultAwareChart.d';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
// @ts-ignore
import PieChart from 'in-components/PieChart';
import { Result } from 'in-types';
import { t } from 'in-i18n';

import locals from './ResultAwareChart.mless';

interface Props {
  config: Config;
  renderLegend?: boolean;
  result: Result<null>;
}

export default function ResultAwareChart({ result, config, renderLegend = true }: Props) {
  let {
    timeConfig,
    y1,
    frontBufferWidth,
    customHeight,
    cardTitle,
    showNoDataInfoWhenEmpty = true,
    renderErrorDetail = false
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
  } else if (!timeConfig || !y1 || !y1.metrics || (showNoDataInfoWhenEmpty && containsOnlyEmptyData(y1.metrics))) {
    content = <NoDataAvailable width={frontBufferWidth} height={height} />;
  } else if (result.progress.loading) {
    if (config.y1.renderer.id === Renderer.pie.id) {
      content = <PieSkeleton height={height} />;
    } else {
      content = <ChartSkeleton height={height} />;
    }
  } else {
    if (config.y1.renderer.id === Renderer.pie.id) {
      content = <PieChart renderLegend={renderLegend} config={config} />;
    } else {
      config = normalizeTimeShiftedTimestamps(config);
      content = <Chart renderLegend={renderLegend} {...config} />;
    }
  }

  if (cardTitle == null) {
    return content;
  }

  const card = (
    <Card
      title={cardTitle}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      header={config.cardHeader}
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

function normalizeTimeShiftedTimestamps(config: Config) {
  const copiedConfig = {
    ...config
  };
  copiedConfig.y1 = normalizeTimeShiftedTimestampsForAxis(config.y1);
  if (config.y2) {
    copiedConfig.y2 = normalizeTimeShiftedTimestampsForAxis(config.y2);
  }

  return copiedConfig;
}

function normalizeTimeShiftedTimestampsForAxis(axis: Axis) {
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
