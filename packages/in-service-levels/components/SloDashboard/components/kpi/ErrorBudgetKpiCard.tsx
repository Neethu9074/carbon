/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { minutes, number } from 'in-services/formatters/number';
import metrics from 'in-service-levels/metrics';

interface ErrorBudgetKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function ErrorBudgetKpiCard({ configuration, timeConfig }: ErrorBudgetKpiCardProps) {
  const { id } = configuration;
  const formatter = isTimeBasedSli(configuration.indicator) ? minutes.fixedCompact : number.compact;

  return (
    <BigNumberKpiCard
      title={metrics.remainingBudget.label}
      formatter={formatter}
      companionFormatter={value => {
        return t('in-service-levels:sloDashboard.components.errorBudgetKpiCard.totalBudget', {
          value: formatter(value)
        });
      }}
      config={{
        metricConfiguration: metrics.remainingBudget.singleNumber({ timeConfig, configId: id! }),
        companionMetricConfiguration: metrics.totalBudget.singleNumber({ timeConfig, configId: id! })
      }}
    />
  );
}
