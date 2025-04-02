/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { themes } from '@instana/design-tokens';

import NoValueKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/NoValueKpiCard';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { IconAction } from 'in-components/KpiCard/KpiCard';
import { number } from 'in-services/formatters/number';
import { sloMetrics } from 'in-service-levels/metrics';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface BurnRateKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function BurnRateKpiCard({ configuration }: BurnRateKpiCardProps) {
  const { id } = configuration;
  const formatter = number.detailed;
  const timeConfig = useTimeConfig();
  const { timeWindows } = useSloTimeWindowContext();
  const hasMatchingTimeWindows = timeWindows.length > 0;

  const burnRateInfo: IconAction = {
    text: t('in-service-levels:sloDashboard.components.burnRateKpiCard.burnRateInfo'),
    kind: 'subtle',
    icon: 'lib_help_error_info_outline'
  };

  if (!hasMatchingTimeWindows) return <NoValueKpiCard title={sloMetrics.burnRate.label} />;

  return (
    <BigNumberKpiCard
      title={sloMetrics.burnRate.label}
      iconAction={burnRateInfo}
      formatter={formatter}
      config={{
        metricConfiguration: sloMetrics.burnRate.singleNumber({ timeConfig, configId: id! }),
        getColor: value => (value != null && value > 1 ? themes.default.ids.color.option.red['500'] : undefined)
      }}
    />
  );
}
