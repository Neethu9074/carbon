/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { Stack } from '@instana/components';
import { Card } from '@instana/components';

import {
  InfraAlertConfigWithMetadata,
  InfraAlertRuleUnion,
  Order,
  StaticThresholdConfig,
  TagCatalog,
  ThresholdConfigUnion
} from 'in-types';
// eslint-disable-next-line no-restricted-imports
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import {
  getQueryBuilder,
  getGroupByQueryBuilder
} from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import { getMetrics } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import PredictiveTriggerDescription from 'in-alerting/smart-alerts/infrastructure/details/PredictiveTriggerDescription';
// eslint-disable-next-line no-restricted-imports
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { InfraMetricChart } from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricChart';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { chartTimeConfig } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import InfraMetricGroup from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroup';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { AlertGrouping } from 'in-alerting/smart-alerts/infrastructure/details/AlertGrouping';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import ListTitle from 'in-components/lists/Title';
import { getPluginName } from 'in-sdk/pluginName';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig }: { alertConfig: InfraAlertConfigWithMetadata }) {
  const {
    timeThreshold,
    granularity,
    rule: { metricName, entityType, aggregation, crossSeriesAggregation, regex },
    threshold,
    alertChannelIds,
    tagFilterExpression,
    customPayloadFields,
    groupBy,
    predictiveTrigger
  } = alertConfig;

  const order = { by: groupBy[0], direction: 'DESC' };

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const tagCatalog = useTagCatalog({ ownerType: entityType });
  const entityLabel = getPluginName(entityType, 1);
  // TODO : below logic can be removed once the dynamic payload support is enabled for infa SA
  const customPayloadFieldsAllStatic = customPayloadFields.map(customPayload => {
    const newCustomPayload = { ...customPayload };
    if (typeof customPayload.value != 'string') {
      newCustomPayload.value = customPayload.value.tagName;
    }
    return newCustomPayload;
  });

  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const AlertGroupByQueryBuilder = getGroupByQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);
  const metrics = getMetrics(metricName, aggregation, crossSeriesAggregation, regex, metricLabel);

  const kpiDefinitions = getKpiDefinitions(entityType);
  const metricMetadatas = useMetricMetadatas({ type: entityType, queries: [metrics[0].metric], kpiDefinitions });

  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfiguration')}</ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos
          threshold={threshold as ThresholdConfigUnion & StaticThresholdConfig}
          rule={{ metricName, entityType } as InfraAlertRuleUnion}
          metricLabel={metricLabel}
        />
      </ExpandableLightCard>

      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <Card title={t('in-events:titleMetrics')}>
            <InfraMetricChart
              alertConfig={alertConfig}
              timeConfig={chartViewConfig.timeConfig}
              groupBy={groupBy}
              entityType={entityType}
              metricName={metricName}
              metricLabel={metricLabel}
            />
            {groupBy.length > 0 && (
              <InfraMetricGroup
                backendQueryModel={tagFilterExpression}
                backendGroupBy={groupBy}
                order={order as Order}
                type={entityType}
                metrics={metrics}
                groupBy={groupBy}
                timeConfig={{
                  ...chartViewConfig.timeConfig,
                  to: timeConfig.to,
                  focusedMoment: timeConfig.focusedMoment
                }}
                metricMetadatas={metricMetadatas}
                tagCatalog={tagCatalog}
              />
            )}
          </Card>
        )}
      </ChartViewConfigurator>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.paddingBodyWrapper}>
          <Stack gap="xsmall">
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={
                (<AlertQueryBuilder value={tagFilterFormModel} readOnly />) as unknown as QueryBuilderComponent
              }
              scopePath={<InfraScopePath infraName={entityLabel} iconName={getInfraIconType(entityType as string)} />}
            />

            <AlertGrouping AlertQueryBuilder={AlertGroupByQueryBuilder} groupBy={groupBy} />
          </Stack>
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
        <PredictiveTriggerDescription predictiveTrigger={predictiveTrigger} />
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="INFRA" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFieldsAllStatic} //this can be replaced with - customPayloadFields - once the dynamic payload support is enabled for infa SA
        TagBasedPayloadConfigurator={() => <></>}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
