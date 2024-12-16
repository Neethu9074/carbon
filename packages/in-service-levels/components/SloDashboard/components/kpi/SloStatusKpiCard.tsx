/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import NoValueKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/NoValueKpiCard';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { createSloPercentageFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { sloMetrics } from 'in-service-levels/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface SloStatusKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function SloStatusKpiCard({ configuration }: SloStatusKpiCardProps) {
  const { id, target } = configuration;
  const formatter = createSloPercentageFormatter();
  const timeConfig = useTimeConfig();
  const { timeWindows } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;

  if (!hasMatchingTimeWindows) return <NoValueKpiCard title={sloMetrics.status.label} />;

  return (
    <BigNumberKpiCard
      title={sloMetrics.status.label}
      formatter={formatter}
      config={{
        metricConfiguration: sloMetrics.status.singleNumber({ timeConfig, configId: id! }),
        staticCompanionValue: t('in-service-levels:sloDashboard.components.sloStatusKpiCard.target', {
          value: formatter(target)
        }),
        getColor: value => (value != null && value < target ? themes.default.ids.color.option.red['500'] : undefined)
      }}
    />
  );
}
