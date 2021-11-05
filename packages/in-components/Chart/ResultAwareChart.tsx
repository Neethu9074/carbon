/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, HorizontalIndicator, Message } from '@instana/components';
import { Progress } from '@instana/components/types/util/dataRetrieval';

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

  const height = customHeight || 160;
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
    content = <QueryProgress height={height} progress={result.progress} />;
  } else if (!timeConfig || !y1 || !y1.metrics || (showNoDataInfoWhenEmpty && containsOnlyEmptyData(y1.metrics))) {
    content = <NoDataAvailable width={frontBufferWidth} height={height} />;
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

  return (
    <Card
      title={cardTitle}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      header={config.cardHeader}
      size="l"
    >
      {content}
    </Card>
  );
}

interface QueryProgressProps {
  progress: Progress;
  height: number;
}

function QueryProgress(queryProgressProps: QueryProgressProps) {
  return (
    <div className={locals.stateWrapper} style={{ height: queryProgressProps.height }}>
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator className={locals.horizontalIndicator} progress={queryProgressProps.progress} rounded />
      </div>
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
