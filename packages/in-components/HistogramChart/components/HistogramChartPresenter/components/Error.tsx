/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Message } from '@instana/components';
import { t } from '@instana/i18n-react';

import locals from 'in-components/HistogramChart/components/HistogramChartPresenter/HistogramChartPresenter.mless';

export default function Error() {
  return (
    <div className={locals.container}>
      <Message
        title={t('in-components:chart.resultAwareChartSomethingWentWrong')}
        description={t('in-components:chart.resultAwareChartPleaseTryAgainLater')}
        type="warning"
        withIcon
      />
    </div>
  );
}
