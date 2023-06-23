/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { useTheme } from '@instana/components';
import { t } from '@instana/i18n-react';

import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { minutes } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';

interface ErrorBudgetKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function ErrorBudgetKpiCard({ configuration, timeConfig }: ErrorBudgetKpiCardProps) {
  const { id, entity } = configuration;
  const formatter = isTimeBasedSli(configuration.indicator) ? minutes.fixedCompact : createSloEventFormatter(entity);
  const theme = useTheme();

  return (
    <BigNumberKpiCard
      title={sloMetrics.remainingBudget.label}
      formatter={formatter}
      companionFormatter={value => {
        return t('in-service-levels:sloDashboard.components.errorBudgetKpiCard.totalBudget', {
          value: formatter(value)
        });
      }}
      config={{
        metricConfiguration: sloMetrics.remainingBudget.singleNumber({ timeConfig, configId: id! }),
        companionMetricConfiguration: sloMetrics.totalBudget.singleNumber({ timeConfig, configId: id! }),
        getColor: value => (value != null && value < 0 ? theme.ids.color.option.red['500'] : undefined)
      }}
    />
  );
}
