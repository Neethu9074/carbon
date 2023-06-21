/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

// @ts-expect-error
import HistogramChartPresenter from 'in-components/HistogramChart/components/HistogramChartPresenter/HistogramChartPresenter';
import { demo } from 'in-components/HistogramChart/fixture';
import { t } from 'in-i18n';

export default function ShowCase() {
  return (
    <Card title={t('in-custom-dashboards:widgets.histogram.demo.title')} useMaxAvailableHeight={false}>
      <HistogramChartPresenter width={700} customHeight={200} result={demo} config={{ formatter: 'number.compact' }} />
    </Card>
  );
}
