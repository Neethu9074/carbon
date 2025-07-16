/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { useObservable } from '@instana/hooks';

import {
  enrichBySettingDataSource,
  isBusinessMetricsUnifiedMetricConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops/utils';
import {
  Result,
  SliConfigurationWithLastUpdated,
  Threshold,
  UnifiedMetricConfigurationUnion,
  isBizOpsUnifiedMetricConfiguration
} from 'in-types';
import {
  Config,
  ConfigWithCompanionMetric,
  ConfigWithStaticCompanion
} from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { customDashboardsFastQueryModeEnabled, thresholdCustomDashboardsEnabled } from 'in-services/featureFlags';
import hideSliSource from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/hideSliSource';
import hideSloSource from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/slo/hideSloSource';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import { getSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { createUnitFormatter, getFormatter } from 'in-stores/metric/formatters';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { getThreshold } from 'in-components/Threshold/threshold';
import { successObservable } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { getUnit } from 'in-stores/metric/units';
import { t } from 'in-i18n';

type MetricProps = UnifiedMetricConfigurationUnion & {
  threshold?: Threshold;
  unit?: string;
  // set to true if you want the form configured unit to be utilized in the chart formatter
  unitFormatterEnabled?: boolean;
};

export type ConfigProps =
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

export default function BigNumberWrapper({ config, title, actions, dragHandle, isInModal, isPreview }: BigNumberProps) {
  const sliConfig =
    useObservable<Result<SliConfigurationWithLastUpdated> | Result<null>, []>(
      () =>
        config.metricConfiguration.source === 'SLI'
          ? getSliConfiguration(config.metricConfiguration.sliConfigId)
          : successObservable(null),
      []
    ) ?? (pendingResult as Result<null>);

  return (
    <BigNumber
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      isInModal={isInModal}
      isPreview={isPreview}
      sliConfig={sliConfig}
    />
  );
}

function BigNumber({
  config,
  title,
  actions,
  dragHandle,
  isInModal,
  isPreview,
  sliConfig
}: BigNumberProps & { sliConfig: Result<SliConfigurationWithLastUpdated> | Result<null> }) {
  const thresholdProps = config?.metricConfiguration?.threshold;
  const approximateTooltipText =
    customDashboardsFastQueryModeEnabled && hasApplicationMetrics(config)
      ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
      : t('in-components:approximateDataIndicator.dataRetention');
  const unit = config?.metricConfiguration?.unit;

  // add bizops data source if necessary
  if (isBizOpsUnifiedMetricConfiguration(config?.metricConfiguration)) {
    config.metricConfiguration = enrichBySettingDataSource(config.metricConfiguration);
  } else if (isBusinessMetricsUnifiedMetricConfiguration(config?.metricConfiguration)) {
    config.metricConfiguration = enrichBySettingDataSource(config.metricConfiguration);
  }
  if (hideSloSource(config) || hideSliSource(config, sliConfig)) return null;

  // create the unit formatter for use if it is enabled via unitFormatterEnabled
  let chartFormatter = getFormatter(config.formatter);
  const unitFormatterEnabled = config?.metricConfiguration?.unitFormatterEnabled;
  if (unitFormatterEnabled) chartFormatter = createUnitFormatter(config.formatter, config?.metricConfiguration?.unit);

  return (
    <BigNumberKpiCard
      config={config}
      title={title}
      actions={actions}
      dragHandle={dragHandle}
      useMaxAvailableHeight={!isPreview}
      isInModal={isInModal}
      formatter={chartFormatter}
      thresholdFn={thresholdCustomDashboardsEnabled ? getThreshold(thresholdProps, config.formatter) : undefined}
      approximateTooltipText={approximateTooltipText}
      conversionFn={unit ? getUnit(unit)?.converter : undefined}
    />
  );
}
