/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { useApplicationQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getMetricOptions } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import { applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/SliConfigInfo.mless';

export default function SliConfigInfo({ sliConfig }) {
  return Boolean(sliConfig?.sliEntity) && <SliConfigTooltip sliConfig={sliConfig} />;
}

const getSliTypeToDisplay = sliEntity => {
  const sliTypeKey = sliEntity?.sliType === applicationType ? 'timeBased' : 'eventBased';

  return t(`in-custom-dashboards:widgets.slo.${sliTypeKey}`);
};

const getMetricToDisplay = metricConfiguration => {
  const { metricName, metricAggregation } = metricConfiguration;

  return metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
};

const getThresholdToDisplay = metricConfiguration => {
  const { metricName, threshold } = metricConfiguration;

  return metricName === 'errors' ? threshold * 100 : threshold;
};

const SliInfo = ({ label, value }) => {
  return (
    <>
      <div className={locals.sliConfigLabel}>{label}</div>
      <div className={locals.sliConfigValue}>{value}</div>
    </>
  );
};

const MetricConfig = ({ sliConfig, entityType }) => {
  if (sliConfig?.metricConfiguration) {
    const { metricConfiguration, sliEntity } = sliConfig;
    const { metricName } = metricConfiguration;
    const { beaconType } = sliEntity;
    const { unitLabel } = getMetricOptions(entityType, beaconType)[metricName];
    const metricLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.metric`)}:`;

    return (
      <>
        <SliInfo label={metricLabel} value={getMetricToDisplay(metricConfiguration)} />
        <SliInfo label={unitLabel} value={getThresholdToDisplay(metricConfiguration)} />
      </>
    );
  }

  return null;
};

const BadEventFilters = ({ sliConfig }) => {
  const { QueryBuilder: SliEventsQueryBuilder } = useApplicationQueryBuilder();

  if (sliConfig.sliEntity?.badEventFilterExpression) {
    const { badEventFilterExpression } = sliConfig.sliEntity;
    const badEventsFilterLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.badEventsFilter`)}:`;

    return (
      <>
        <div className={locals.sliConfigLabel}>{badEventsFilterLabel}</div>
        <div className={locals.sliConfigValue}>
          <SliEventsQueryBuilder value={fromBackendModel(badEventFilterExpression)} readOnly />
        </div>
      </>
    );
  }

  return null;
};

const SliConfigTooltipContent = ({ sliConfig, entityType }) => {
  const sliNameLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`;
  const sliTypeLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`;

  return (
    <div className={locals.sliConfigGridContainer}>
      <SliInfo label={sliNameLabel} value={sliConfig.sliName} />
      <SliInfo label={sliTypeLabel} value={getSliTypeToDisplay(sliConfig.sliEntity)} />
      <MetricConfig entityType={entityType} sliConfig={sliConfig} />
      <BadEventFilters sliConfig={sliConfig} />
    </div>
  );
};

const SliConfigTooltip = ({ sliConfig, entityType }) => {
  return (
    <Tooltip
      themeStyle="light"
      content={<SliConfigTooltipContent sliConfig={sliConfig} entityType={entityType} />}
      align="bottomMiddle"
      delay={250}
    >
      <SvgIcon className={locals.sliInfo} type={'lib_help_error_info_outline'} size="s" />
    </Tooltip>
  );
};
