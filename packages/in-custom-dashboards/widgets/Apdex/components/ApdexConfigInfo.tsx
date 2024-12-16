/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { ApdexConfiguration } from '@instana/types';

import {
  ApplicationFilterWidgetConfigInfoItem,
  WebsiteFilterWidgetConfigInfoItem
} from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/FilterWidgetConfigInfoItem';
import WidgetConfigInfoItem from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo/WidgetConfigInfoItem';
import WidgetConfigInfo from 'in-custom-dashboards/widgets/SloLegacy/components/WidgetConfigInfo';
import { latencyDetailed } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

interface ApdexConfigInfoProps<APDEX_ENTITY_TYPE> {
  apdexConfig?: APDEX_ENTITY_TYPE;
}

export default function ApdexConfigInfo<APDEX_ENTITY_TYPE extends ApdexConfiguration>({
  apdexConfig
}: ApdexConfigInfoProps<APDEX_ENTITY_TYPE>) {
  if (!apdexConfig?.apdexEntity) {
    return null;
  }
  const apdexType = apdexConfig.apdexEntity.apdexType;
  const filterLabel = `${t(`in-custom-dashboards:widgets.apdex.apdexConfigInfo.tagFilterLabel`)}:`;

  return (
    <WidgetConfigInfo>
      <WidgetConfigInfoItem
        label={`${t(`in-custom-dashboards:widgets.apdex.apdexConfigInfo.apdexNameLabel`)}:`}
        value={apdexConfig.apdexName}
      />
      <WidgetConfigInfoItem
        label={`${t(`in-custom-dashboards:widgets.apdex.apdexConfigInfo.apdexTypeLabel`)}:`}
        value={t('in-custom-dashboards:widgets.apdex.entityTypeSelector.type', { context: apdexType })}
      />
      <WidgetConfigInfoItem
        label={`${t(`in-custom-dashboards:widgets.apdex.apdexConfigInfo.thresholdLabel`)}:`}
        value={latencyDetailed.formatter(apdexConfig.apdexEntity.threshold)}
      />
      {apdexType === 'application' && (
        <ApplicationFilterWidgetConfigInfoItem
          label={filterLabel}
          tagFilterExpression={apdexConfig.apdexEntity.tagFilterExpression}
        />
      )}
      {apdexType === 'website' && (
        <WebsiteFilterWidgetConfigInfoItem
          label={filterLabel}
          beaconType={apdexConfig.apdexEntity.beaconType}
          websiteId={apdexConfig.apdexEntity.entityId}
          tagFilterExpression={apdexConfig.apdexEntity.tagFilterExpression}
        />
      )}
    </WidgetConfigInfo>
  );
}
