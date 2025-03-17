/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { getIntlNumberFormatter } from '@instana/format-numbers';
import { SliConfigMetricConfiguration } from '@instana/types';
import { StackItem } from '@instana/components';

import {
  getMetricOptions,
  getDefaultMetricEntityType,
  MetricEntityType,
  MetricType,
  MetricOptions
} from 'in-custom-dashboards/widgets/SloLegacy/sli/metricFormData';
import WidgetConfigInfoItem from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/WidgetConfigInfoItem';
import { SliConfig, CombinedSliEntity } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

const thresholdFormatter = getIntlNumberFormatter();

const getMetricToDisplay = (metricConfiguration: SliConfigMetricConfiguration): string => {
  const { metricName, metricAggregation } = metricConfiguration;

  return metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
};

const getThresholdToDisplay = <S extends MonitoringSource, E extends MetricEntityType<S>>(
  metricConfiguration: SliConfigMetricConfiguration,
  metricOptions: MetricOptions<S, E>
): string | Nullish => {
  const { metricName, threshold } = metricConfiguration;
  const { type } = metricOptions[metricName as MetricType<S, E>];
  const thresholdToDisplay = type === 'rate' ? threshold * 100 : threshold;
  return thresholdFormatter(thresholdToDisplay);
};

interface SliMetricWidgetConfigInfoItemProps<S extends MonitoringSource = MonitoringSource> {
  sliConfig?: SliConfig<CombinedSliEntity>;
  entityType: S;
}

export default function SliMetricWidgetConfigInfoItem<S extends MonitoringSource>({
  sliConfig,
  entityType
}: SliMetricWidgetConfigInfoItemProps<S>) {
  if (sliConfig?.metricConfiguration) {
    const { metricConfiguration, sliEntity } = sliConfig;
    const { metricName } = metricConfiguration;
    const { beaconType } = sliEntity;
    const metricEntityType = beaconType ?? getDefaultMetricEntityType(entityType);
    const metricOptions = getMetricOptions(entityType, metricEntityType as MetricEntityType<S>);
    const { unitLabel } = metricOptions[metricName as MetricType<S, MetricEntityType<S>>];
    const metricLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.metric`)}:`;

    return (
      <StackItem>
        <WidgetConfigInfoItem label={metricLabel} value={getMetricToDisplay(metricConfiguration)} />
        <WidgetConfigInfoItem label={unitLabel} value={getThresholdToDisplay(metricConfiguration, metricOptions)} />
      </StackItem>
    );
  }

  return null;
}
