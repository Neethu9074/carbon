/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

export default function ShowCase() {
  return (
    <div>
      <ResultAwareChart
        result={success(null)}
        config={{
          metricsConfiguration: { metrics: [] },
          timeConfig: { windowSize: 60000, to: 1624888952857 },
          y1: {
            formatter: x => x,
            renderer: { id: 'pie' },
            labels: [
              t('in-custom-dashboards:widgets.pie.index.testLegendItem1'),
              t('in-custom-dashboards:widgets.pie.index.testLegendItem2'),
              t('in-custom-dashboards:widgets.pie.index.testLegendItem3')
            ],
            metricIds: [],
            metrics: [[[1624888892000, 50]], [[1624888892000, 10]], [[1624888892000, 40]]],
            colors: ['#8258d9', '#fe403f', '#ff8c19']
          }
        }}
      />
    </div>
  );
}
