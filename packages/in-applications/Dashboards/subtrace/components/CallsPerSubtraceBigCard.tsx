/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ConfigWithCompanionMetric } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { SubtraceUnifiedMetricConfiguration } from 'in-types';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface Props {
  config: ConfigWithCompanionMetric<SubtraceUnifiedMetricConfiguration>;
}

export default function CallsPerSubtraceBigCard({ config }: Props): JSX.Element {
  return (
    <BigNumberKpiCard
      title={t('in-applications:subtraces.labelCallsPerSubtrace')}
      formatter={number.compact}
      companionFormatter={(v: number) =>
        t('in-applications:dashboards.subtraceCount', {
          formattedCount: number.compact(v),
          count: v
        })
      }
      config={config}
    />
  );
}
