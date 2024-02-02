/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { minutes } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface ErrorBudgetKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function ErrorBudgetKpiCard({ configuration }: ErrorBudgetKpiCardProps) {
  const { id, entity } = configuration;
  const formatter = isTimeBasedSli(configuration.indicator) ? minutes.fixedCompact : createSloEventFormatter(entity);
  const timeConfig = useTimeConfig();

  return (
    <BigNumberKpiCard
      title={t('in-service-levels:sloDashboard.components.errorBudgetKpiCard.remainingBudget')}
      formatter={formatter}
      companionFormatter={value => {
        return t('in-service-levels:sloDashboard.components.errorBudgetKpiCard.totalBudget', {
          value: formatter(value)
        });
      }}
      config={{
        metricConfiguration: sloMetrics.remainingBudget.singleNumber({ timeConfig, configId: id! }),
        companionMetricConfiguration: sloMetrics.totalBudget.singleNumber({ timeConfig, configId: id! }),
        getColor: value => (value != null && value < 0 ? themes.default.ids.color.option.red['500'] : undefined)
      }}
    />
  );
}
