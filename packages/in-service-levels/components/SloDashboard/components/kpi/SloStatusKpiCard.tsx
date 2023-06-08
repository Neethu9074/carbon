/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { useTheme } from '@instana/components';
import { t } from '@instana/i18n-react';

import { createSloPercentageFormatter } from 'in-service-levels/utils';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import metrics from 'in-service-levels/metrics';

interface SloStatusKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function SloStatusKpiCard({ configuration, timeConfig }: SloStatusKpiCardProps) {
  const { id, target } = configuration;
  const formatter = useMemo(() => createSloPercentageFormatter(target), [target]);
  const theme = useTheme();

  return (
    <BigNumberKpiCard
      title={metrics.status.label}
      formatter={formatter}
      config={{
        metricConfiguration: metrics.status.singleNumber({ timeConfig, configId: id! }),
        staticCompanionValue: t('in-service-levels:sloDashboard.components.sloStatusKpiCard.target', {
          value: formatter(target)
        }),
        getColor: value => (value != null && value < target ? theme.ids.color.option.red['500'] : undefined)
      }}
    />
  );
}
