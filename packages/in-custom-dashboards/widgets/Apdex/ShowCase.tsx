/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import { MetricDataSeries } from 'in-components/Chart/types';
import { success } from 'in-services/util/result';
import { minutes } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Apdex/ShowCase.mless';

export default function ShowCase() {
  const granularity = minutes.toMillis(5);
  const windowSize = minutes.toMillis(300);
  const to = Date.now();

  const { data, errors, progress } = success<MetricDataSeries[]>(getShowCaseMetrics(to, windowSize, granularity));

  return (
    <div className={locals.showCase}>
      <ApdexWidget
        title={t('in-custom-dashboards:widgets.apdex.demo.title')}
        actions={[]}
        dragHandle={null}
        entityLabel={t('in-custom-dashboards:widgets.apdex.demo.entityLabel')}
        entityType="website"
        errors={errors}
        progress={progress}
        granularity={granularity}
        timeConfig={{ windowSize, to, autoRefresh: false }}
        metrics={data!}
        automaticallySize
        nonInteractive
      />
    </div>
  );
}

function getShowCaseMetrics(to: number, windowSize: number, granularity: number): MetricDataSeries[] {
  const minSatisfiedApdex = 0.8;
  const metrics: MetricDataSeries = [];
  let nextTimestamp = to - windowSize;

  while (nextTimestamp < to) {
    const randApdex = Math.random() * (1 - minSatisfiedApdex) + minSatisfiedApdex;
    metrics.push([nextTimestamp, randApdex]);
    nextTimestamp = nextTimestamp + granularity;
  }

  return [[...metrics]];
}
