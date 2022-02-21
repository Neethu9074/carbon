/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { getIntlNumberFormatter } from '@instana/format-numbers';
import { SvgIcon } from '@instana/components';

import {
  applicationType,
  websiteEventBased,
  availabilityType,
  SliConfig,
  CombinedSliEntity,
  CombinedWebsiteSliEntity,
  CombinedApplicationSliEntity
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import {
  getMetricOptions,
  getDefaultMetricEntityType,
  MetricEntityType,
  MetricType,
  MetricOptions
} from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import { useApplicationQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-custom-dashboards/widgets/Slo/websiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { Nullish, SliConfigMetricConfiguration, SliEntity } from 'in-types';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/SliConfigInfo.mless';

const thresholdFormatter = getIntlNumberFormatter();

interface SliConfigInfoProps<S extends MonitoringSource = MonitoringSource> {
  sliConfig?: SliConfig<CombinedSliEntity>;
  entityType: S;
}

export default function SliConfigInfo({ sliConfig, entityType }: SliConfigInfoProps) {
  if (!sliConfig?.sliEntity) {
    return null;
  }

  return (
    <Tooltip
      themeStyle="light"
      content={<SliConfigTooltipContent sliConfig={sliConfig} entityType={entityType} />}
      align="bottomMiddle"
      delay={250}
    >
      <SvgIcon className={locals.sliInfo} type="lib_help_error_info_outline" size="s" />
    </Tooltip>
  );
}

const getSliTypeToDisplay = (sliEntity: SliEntity): string => {
  const sliTypeKey = sliEntity?.sliType === applicationType ? 'timeBased' : 'eventBased';

  return t(`in-custom-dashboards:widgets.slo.${sliTypeKey}`);
};

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

interface SliInfoProps {
  label: string;
  value: string | Nullish;
}

const SliInfo = ({ label, value }: SliInfoProps) => {
  return (
    <>
      <div className={locals.sliConfigLabel}>{label}</div>
      <div className={locals.sliConfigValue}>{value}</div>
    </>
  );
};

const MetricConfig = <S extends MonitoringSource>({ sliConfig, entityType }: SliConfigInfoProps<S>) => {
  if (sliConfig?.metricConfiguration) {
    const { metricConfiguration, sliEntity } = sliConfig;
    const { metricName } = metricConfiguration;
    const { beaconType } = sliEntity;
    const metricEntityType = beaconType ?? getDefaultMetricEntityType(entityType);
    const metricOptions = getMetricOptions(entityType, metricEntityType as MetricEntityType<S>);
    const { unitLabel } = metricOptions[metricName as MetricType<S, MetricEntityType<S>>];
    const metricLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.metric`)}:`;

    return (
      <>
        <SliInfo label={metricLabel} value={getMetricToDisplay(metricConfiguration)} />
        <SliInfo label={unitLabel} value={getThresholdToDisplay(metricConfiguration, metricOptions)} />
      </>
    );
  }

  return null;
};

interface EventFilterProps<E extends SliEntity> {
  sliConfig: SliConfig<E>;
}

const WebsiteBadEventFilters = ({ sliConfig }: EventFilterProps<CombinedWebsiteSliEntity>) => {
  const { QueryBuilder } = useWebsiteQueryBuilder(sliConfig.sliEntity);
  return <BadEventFilters QueryBuilderComponent={QueryBuilder} sliConfig={sliConfig} />;
};

const ApplicationBadEventFilters = ({ sliConfig }: EventFilterProps<CombinedApplicationSliEntity>) => {
  const { QueryBuilder } = useApplicationQueryBuilder({});
  return <BadEventFilters QueryBuilderComponent={QueryBuilder} sliConfig={sliConfig} />;
};

interface BadEventFilterProps {
  QueryBuilderComponent: QueryBuilderComponent;
  sliConfig: SliConfig<CombinedSliEntity>;
}

const BadEventFilters = ({ QueryBuilderComponent, sliConfig }: BadEventFilterProps) => {
  if (sliConfig.sliEntity?.badEventFilterExpression) {
    const { badEventFilterExpression } = sliConfig.sliEntity;
    const badEventsFilterLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.badEventsFilter`)}:`;

    return (
      <>
        <div className={locals.sliConfigLabel}>{badEventsFilterLabel}</div>
        <div className={locals.sliConfigValue}>
          <QueryBuilderComponent value={fromBackendModel(badEventFilterExpression)} readOnly />
        </div>
      </>
    );
  }

  return null;
};

const SliConfigTooltipContent = ({ sliConfig, entityType }: Required<SliConfigInfoProps>) => {
  const sliNameLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`;
  const sliTypeLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`;
  const sliType = sliConfig.sliEntity.sliType;

  return (
    <div className={locals.sliConfigGridContainer}>
      <SliInfo label={sliNameLabel} value={sliConfig.sliName} />
      <SliInfo label={sliTypeLabel} value={getSliTypeToDisplay(sliConfig.sliEntity)} />
      <MetricConfig entityType={entityType} sliConfig={sliConfig} />
      {sliType === availabilityType && (
        <ApplicationBadEventFilters sliConfig={sliConfig as SliConfig<CombinedApplicationSliEntity>} />
      )}
      {sliType === websiteEventBased && (
        <WebsiteBadEventFilters sliConfig={sliConfig as SliConfig<CombinedWebsiteSliEntity>} />
      )}
    </div>
  );
};
