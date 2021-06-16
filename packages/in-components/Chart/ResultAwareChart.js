/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import InfiniteCircle from 'in-components/Loading/InfiniteCircle/InfiniteCircle';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { warning } from 'in-components/Message/types';
import PieChart from 'in-components/PieChart';
import Message from 'in-components/Message';
import { t } from 'in-i18n';

export default function ResultAwareChart({ result, config, renderLegend = true }) {
  let { timeConfig, y1, frontBufferWidth, customHeight, cardTitle, showNoDataInfoWhenEmpty = true } = config;
  let content;
  let withoutPadding = false;

  const height = customHeight || 160;
  if (result.errors.length > 0) {
    content = (
      <Message
        type={warning}
        withIcon
        title={t('in-components:chart.resultAwareChartSomethingWentWrong')}
        description={t('in-components:chart.resultAwareChartPleaseTryAgainLater')}
      />
    );
  } else if (result.progress.loading) {
    if (result.progress.percentage) {
      content = <InfiniteCircle height={height} width={frontBufferWidth} percentage={result.progress.percentage} />;
    } else {
      content = <LoadingIndicator height={height} width={frontBufferWidth} />;
    }
    withoutPadding = true;
  } else {
    if (!timeConfig || !y1 || !y1.metrics || (showNoDataInfoWhenEmpty && containsOnlyEmptyData(y1.metrics))) {
      content = <NoDataAvailable width={frontBufferWidth} height={height} />;
    } else {
      if (config.y1.renderer.id === Renderer.pie.id) {
        content = <PieChart renderLegend={renderLegend} config={config} />;
      } else {
        config = normalizeTimeShiftedTimestamps(result, config);
        content = <Chart renderLegend={renderLegend} {...config} />;
      }
    }
  }

  if (cardTitle == null) {
    return content;
  }

  return (
    <Card
      title={cardTitle}
      useMaxAvailableHeight={config.cardUseMaxAvailableHeight}
      withoutPadding={withoutPadding}
      header={config.cardHeader}
    >
      {content}
    </Card>
  );
}

function containsOnlyEmptyData(metrics) {
  const keys = Object.keys(metrics);
  for (let i = 0; i < keys.length; i++) {
    if (metrics[keys[i]] && metrics[keys[i]].length > 0) {
      return false;
    }
  }
  return true;
}

function normalizeTimeShiftedTimestamps(result, config) {
  const copiedConfig = {
    ...config
  };
  copiedConfig.y1 = normalizeTimeShiftedTimestampsForAxis(result, config.y1);
  if (config.y2) {
    copiedConfig.y2 = normalizeTimeShiftedTimestampsForAxis(result, config.y2);
  }

  return copiedConfig;
}

function normalizeTimeShiftedTimestampsForAxis(result, axis) {
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
