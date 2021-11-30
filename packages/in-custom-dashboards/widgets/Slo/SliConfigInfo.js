/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { applicationType, websiteEventBased, availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { getMetricOptions, getDefaultMetricEntityType } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import { useApplicationQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-custom-dashboards/widgets/Slo/websiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/SliConfigInfo.mless';

export default function SliConfigInfo({ sliConfig, entityType }) {
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

SliConfigInfo.propTypes = {
  entityType: PropTypes.string.isRequired,
  sliConfig: PropTypes.shape({
    sliEntity: PropTypes.object.isRequired
  }).isRequired
};

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
    const metricEntityType = beaconType ?? getDefaultMetricEntityType(entityType);
    const { unitLabel } = getMetricOptions(entityType, metricEntityType)[metricName];
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

const WebsiteBadEventFilters = ({ sliConfig }) => {
  const { QueryBuilder } = useWebsiteQueryBuilder(sliConfig.sliEntity);
  return <BadEventFilters QueryBuilderComponent={QueryBuilder} sliConfig={sliConfig} />;
};

const ApplicationBadEventFilters = ({ sliConfig }) => {
  const { QueryBuilder } = useApplicationQueryBuilder({});
  return <BadEventFilters QueryBuilderComponent={QueryBuilder} sliConfig={sliConfig} />;
};

const BadEventFilters = ({ QueryBuilderComponent, sliConfig }) => {
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

const SliConfigTooltipContent = ({ sliConfig, entityType }) => {
  const sliNameLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`;
  const sliTypeLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`;
  const sliType = sliConfig.sliEntity.sliType;

  return (
    <div className={locals.sliConfigGridContainer}>
      <SliInfo label={sliNameLabel} value={sliConfig.sliName} />
      <SliInfo label={sliTypeLabel} value={getSliTypeToDisplay(sliConfig.sliEntity)} />
      <MetricConfig entityType={entityType} sliConfig={sliConfig} />
      {sliType === availabilityType && <ApplicationBadEventFilters sliConfig={sliConfig} />}
      {sliType === websiteEventBased && <WebsiteBadEventFilters sliConfig={sliConfig} />}
    </div>
  );
};
