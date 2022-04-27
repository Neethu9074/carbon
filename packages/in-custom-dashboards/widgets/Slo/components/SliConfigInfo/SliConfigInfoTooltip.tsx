/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import {
  applicationType,
  availabilityType,
  CombinedApplicationSliEntity,
  CombinedSliEntity,
  CombinedWebsiteSliEntity,
  SliConfig,
  websiteEventBased,
  websiteTimeBased
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import SliConfigInfoMetricItem from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoMetricItem';
import { useApplicationQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useApplicationQueryBuilder';
import SliConfigInfoItem from 'in-custom-dashboards/widgets/Slo/components/SliConfigInfo/SliConfigInfoItem';
import { useWebsiteQueryBuilder } from 'in-custom-dashboards/widgets/Slo/sli/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { SliEntity } from 'in-types';
import { t } from 'in-i18n';

import locals from './SliConfigInfo.mless';

const getSliTypeToDisplay = (sliType: SliEntity['sliType']): string => {
  const sliTypeKey = sliType === applicationType || sliType === websiteTimeBased ? 'timeBased' : 'eventBased';

  return t(`in-custom-dashboards:widgets.slo.${sliTypeKey}`);
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

interface SliConfigInfoTooltipProps<S extends MonitoringSource = MonitoringSource> {
  sliConfig?: SliConfig<CombinedSliEntity>;
  entityType: S;
}

export default function SliConfigInfoTooltip({ sliConfig, entityType }: Required<SliConfigInfoTooltipProps>) {
  const sliNameLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`;
  const sliTypeLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`;
  const sliType = sliConfig.sliEntity.sliType;

  return (
    <div className={locals.sliConfigGridContainer}>
      <SliConfigInfoItem label={sliNameLabel} value={sliConfig.sliName} />
      <SliConfigInfoItem label={sliTypeLabel} value={getSliTypeToDisplay(sliType)} />
      <SliConfigInfoMetricItem entityType={entityType} sliConfig={sliConfig} />
      {sliType === availabilityType && (
        <ApplicationBadEventFilters sliConfig={sliConfig as SliConfig<CombinedApplicationSliEntity>} />
      )}
      {sliType === websiteEventBased && (
        <WebsiteBadEventFilters sliConfig={sliConfig as SliConfig<CombinedWebsiteSliEntity>} />
      )}
    </div>
  );
}
