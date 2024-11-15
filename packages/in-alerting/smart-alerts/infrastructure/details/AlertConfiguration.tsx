/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';

import { Stack } from '@instana/components';

// eslint-disable-next-line no-restricted-imports
import { getIconType as getInfraIconType } from 'in-infrastructure/infrastructureIconType';
import {
  getQueryBuilder,
  getGroupByQueryBuilder
} from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/infrastructure/hooks/useTagBasedPayloadConfigurator';
import { getMetrics } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import PredictiveTriggerDescription from 'in-alerting/smart-alerts/infrastructure/details/PredictiveTriggerDescription';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/infrastructure/data/titlePlaceholders';
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
import { InfraAlertRuleUnion, Order, TagCatalog, TagFilter, RuleWithThreshold } from 'in-types';
import InfraScopePath from 'in-alerting/smart-alerts/infrastructure/components/InfraScopePath';
import { toUIGrouping } from 'in-alerting/smart-alerts/aggregated/utils/groupfilterExpression';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { AlertGrouping } from 'in-alerting/smart-alerts/aggregated/components/AlertGrouping';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { alertChannelPerSeverityInfraSaEnabled } from 'in-services/featureFlags';
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

export default function AlertConfiguration({ alertConfig }: { alertConfig: InfraSmartAlertConfigWithMetadata }) {
  const {
    timeThreshold,
    granularity,
    alertChannelIds,
    alertChannels,
    tagFilterExpression,
    customPayloadFields,
    groupBy,
    predictiveTrigger,
    rules
  } = alertConfig;

  const firstRule: RuleWithThreshold<InfraAlertRuleUnion> = rules[0];
  const {
    rule: { metricName, entityType, aggregation, crossSeriesAggregation, regex },
    thresholdOperator,
    thresholds: thresholdsMap
  } = firstRule;
  const order = { by: groupBy[0], direction: 'DESC' };

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const tagCatalog = useTagCatalog({ ownerType: entityType });
  const entityLabel = getPluginName(entityType, 1);

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

  const groupingFilter = groupBy && toUIGrouping(groupBy);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator({ metricName, regex, entityType });

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
          thresholdOperator={thresholdOperator}
          thresholdsMap={thresholdsMap}
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
          <>
            <h1 className={locals.title}>{t('in-events:titleMetrics')}</h1>
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
          </>
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

            <AlertGrouping AlertQueryBuilder={AlertGroupByQueryBuilder} groupBy={groupingFilter as TagFilter[]} />
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
          <AlertChannelsViewer
            alertChannelIds={alertChannelIds}
            alertChannels={alertChannels}
            alertChannelPerSeverityEnabled={alertChannelPerSeverityInfraSaEnabled}
          />
        </div>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos
          alertConfig={alertConfig}
          renderCustomTitle={() => replaceTitlePlaceholdersWithMarkup(alertConfig)}
          disableTrigger
          shouldDisplayAlertLevelSection={false}
        />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="INFRA" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
