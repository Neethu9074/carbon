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
import { customDashboardsFastQueryModeEnabled, thresholdCustomDashboardsEnabled } from 'in-services/featureFlags';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { Threshold, UnifiedMetricConfigurationUnion } from 'in-types';
import { getThreshold } from 'in-components/Threshold/threshold';
import { getFormatter } from 'in-stores/metric/formatters';
import { getUnit } from 'in-stores/metric/units';
import { t } from 'in-i18n';

type MetricProps = UnifiedMetricConfigurationUnion & {
  threshold?: Threshold;
  unit?: string;
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
  const approximateTooltipText =
    customDashboardsFastQueryModeEnabled && hasApplicationMetrics(config)
      ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
      : t('in-components:approximateDataIndicator.dataRetention');
  const unit = config?.metricConfiguration?.unit;

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
      approximateTooltipText={approximateTooltipText}
      conversionFn={unit ? getUnit(unit)?.converter : undefined}
    />
  );
}
