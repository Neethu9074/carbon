/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SliEntity } from '@instana/types';

import {
  ApplicationFilterWidgetConfigInfoItem,
  WebsiteFilterWidgetConfigInfoItem
} from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/FilterWidgetConfigInfoItem';
import {
  applicationType,
  availabilityType,
  CombinedSliEntity,
  SliConfig,
  websiteEventBased,
  websiteTimeBased
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import SliMetricWidgetConfigInfoItem from 'in-custom-dashboards/widgets/SloLegacy/components/SliConfigInfo/SliMetricWidgetConfigInfoItem';
import WidgetConfigInfoItem from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/WidgetConfigInfoItem';
import WidgetConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { t } from 'in-i18n';

interface SliConfigInfoProps<S extends MonitoringSource = MonitoringSource> {
  sliConfig?: SliConfig<CombinedSliEntity>;
  entityType: S;
}

export default function SliConfigInfo({ sliConfig, entityType }: SliConfigInfoProps) {
  if (!sliConfig?.sliEntity) {
    return null;
  }

  const sliType = sliConfig.sliEntity.sliType;
  const filterLabel = `${t(`in-custom-dashboards:widgets.slo.sliConfig.badEventsFilter`)}:`;

  return (
    <WidgetConfigInfo>
      <WidgetConfigInfoItem
        label={`${t(`in-custom-dashboards:widgets.slo.sliConfig.sliName`)}:`}
        value={sliConfig.sliName}
      />
      <WidgetConfigInfoItem
        label={`${t(`in-custom-dashboards:widgets.slo.sliConfig.sliType`)}:`}
        value={getSliTypeToDisplay(sliType)}
      />
      <SliMetricWidgetConfigInfoItem entityType={entityType} sliConfig={sliConfig} />
      {sliType === availabilityType && (
        <ApplicationFilterWidgetConfigInfoItem
          label={filterLabel}
          tagFilterExpression={sliConfig.sliEntity.badEventFilterExpression}
        />
      )}
      {sliType === websiteEventBased && (
        <WebsiteFilterWidgetConfigInfoItem
          label={filterLabel}
          beaconType={sliConfig.sliEntity.beaconType}
          websiteId={sliConfig.sliEntity.websiteId}
          tagFilterExpression={sliConfig.sliEntity.badEventFilterExpression}
        />
      )}
    </WidgetConfigInfo>
  );
}

const getSliTypeToDisplay = (sliType: SliEntity['sliType']): string => {
  const sliTypeKey = sliType === applicationType || sliType === websiteTimeBased ? 'timeBased' : 'eventBased';

  return t(`in-custom-dashboards:widgets.slo.${sliTypeKey}`);
};
