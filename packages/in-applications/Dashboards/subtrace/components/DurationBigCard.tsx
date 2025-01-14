/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ConfigWithCompanionMetric } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { latency, meanLatency } from 'in-services/formatters/number';
import { SubtraceUnifiedMetricConfiguration } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  config: ConfigWithCompanionMetric<SubtraceUnifiedMetricConfiguration>;
}
export default function DurationBigCard({ config }: Props): JSX.Element {
  return (
    <BigNumberKpiCard
      title={t('in-applications:labelDuration')}
      formatter={latency.detailed}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.meanLatencyFor90th', {
          meanLatencyDetail: meanLatency.detailed(v)
        })
      }
      config={config}
    />
  );
}
