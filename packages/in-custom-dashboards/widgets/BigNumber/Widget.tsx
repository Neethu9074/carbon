/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import {
  Config,
  ConfigWithCompanionMetric,
  ConfigWithStaticCompanion
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { getThreshold, ThresholdProps } from 'in-custom-dashboards/widgets/_shared/threshold';
import { thresholdCustomDashboardsEnabled } from 'in-services/featureFlags';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getFormatter } from 'in-stores/metric/formatters';
import { UnifiedMetricConfigurationUnion } from 'in-types';

type MetricProps = UnifiedMetricConfigurationUnion & {
  threshold?: ThresholdProps;
};

type ConfigProps =
  | Config<MetricProps>
  | ConfigWithCompanionMetric<MetricProps>
  | ConfigWithStaticCompanion<MetricProps>;

export interface BigNumberProps {
  title: string;
  useMaxAvailableHeight?: boolean;
  config: ConfigProps;
  actions?: ReactNode;
  dragHandle?: ReactNode;
  isPreview?: boolean;
  isInModal?: boolean;
}

export default function BigNumber({ config, title, actions, dragHandle, isInModal, isPreview }: BigNumberProps) {
  const thresholdProps = config?.metricConfiguration?.threshold;

  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      isInModal={isInModal}
      formatter={getFormatter(config.formatter)}
      thresholdFn={thresholdCustomDashboardsEnabled ? getThreshold(thresholdProps, config.formatter) : undefined}
    />
  );
}
