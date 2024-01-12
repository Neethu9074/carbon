/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import { createSloPercentageFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { sloMetrics } from 'in-service-levels/metrics';

interface SloStatusKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function SloStatusKpiCard({ configuration, timeConfig }: SloStatusKpiCardProps) {
  const { id, target } = configuration;
  const formatter = useMemo(() => createSloPercentageFormatter(target), [target]);

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
