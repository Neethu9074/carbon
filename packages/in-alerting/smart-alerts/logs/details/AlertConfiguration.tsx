/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useMemo } from 'react';

import { Message, Stack } from '@instana/components';
import { create } from '@instana/observables';

import { getQueryBuilder, getGroupByQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/logs/hooks/useTagBasedPayoadConfigurator';
import { logsGroupbyTag, toUIGrouping } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import GracePeriodDescription from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { severityPlaceholderList } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/logs/details/AlertThresholdInfos';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { AlertGrouping } from 'in-alerting/smart-alerts/aggregated/components/AlertGrouping';
import { LogMetricChart } from 'in-alerting/smart-alerts/logs/components/LogMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import { TagCatalog, TagFilter, RuleWithThreshold, LogAlertRuleUnion } from 'in-types';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { alertChannelPerSeverityLogSaEnabled } from 'in-services/featureFlags';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;
export const selectedMetricGroup$ = create().emit(null);
export type Tags = { [index: string]: any };

export default function AlertConfiguration({ alertConfig }: { alertConfig: LogSmartAlertConfigWithMetadata }) {
  const {
    timeThreshold,
    granularity,
    gracePeriod,
    groupBy,
    customPayloadFields,
    tagFilterExpression,
    alertChannelIds,
    alertChannels,
    rules
  } = alertConfig;

  const firstRule: RuleWithThreshold<LogAlertRuleUnion> = rules[0];
  const { thresholdOperator, thresholds: thresholdsMap } = firstRule;
  const tagCatalog = useTagCatalog('SMART_ALERTS');
  //@ts-expect-error TODO : remove expect error once typedefinition updated with this usecase.
  const groupByTagCatalog = useTagCatalog('SMART_ALERTS_GROUPING');
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const AlertGroupByQueryBuilder = getGroupByQueryBuilder(groupByTagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator();
  const groupingFilter = groupBy && toUIGrouping(logsGroupbyTag(groupBy));

  return (
    <AlertDetailsCard>
      <ListTitle>{t('in-alerting:smartAlerts.logs.alertDetails.alertConfiguration')}</ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos
          thresholdOperator={thresholdOperator}
          thresholdsMap={thresholdsMap}
          metricLabel={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
        />
      </ExpandableLightCard>

      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <>
            <LogMetricChart
              alertConfig={alertConfig}
              timeConfig={{
                ...chartViewConfig.timeConfig,
                to: timeConfig.to,
                focusedMoment: timeConfig.focusedMoment
              }}
            />
            {groupBy && groupBy.length > 0 && (
              <LogMetricGroup
                backendQueryModel={tagFilterExpression}
                groupBy={logsGroupbyTag(groupBy)}
                timeConfig={{
                  ...chartViewConfig.timeConfig,
                  to: timeConfig.to,
                  focusedMoment: timeConfig.focusedMoment
                }}
                tagCatalog={groupByTagCatalog}
              />
            )}
          </>
        )}
      </ChartViewConfigurator>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.paddingBodyWrapper}>
          {!tagFilterFormModel?.length && !groupBy?.length ? (
            <Message small title={t('in-alerting:smartAlerts.logs.alertDetails.noScopeSelected')} />
          ) : (
            <Stack gap="xsmall">
              {tagFilterFormModel?.length > 0 && (
                <ScopeConfigPresenter
                  tagFilterFormModel={tagFilterFormModel}
                  queryBuilder={
                    (<AlertQueryBuilder value={tagFilterFormModel} readOnly />) as unknown as QueryBuilderComponent
                  }
                  scopePath={<></>}
                />
              )}
              {groupBy && groupBy?.length > 0 && (
                <AlertGrouping AlertQueryBuilder={AlertGroupByQueryBuilder} groupBy={groupingFilter as TagFilter[]} />
              )}
            </Stack>
          )}
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <Stack gap="large">
          <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
          <GracePeriodDescription gracePeriod={gracePeriod} />
        </Stack>
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer
            alertChannelIds={alertChannelIds}
            alertChannels={alertChannels}
            alertChannelPerSeverityEnabled={alertChannelPerSeverityLogSaEnabled}
          />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos
          alertConfig={alertConfig}
          disableTrigger
          shouldDisplayAlertLevelSection={false}
          renderCustomTitle={() => replacePlaceholdersWithMarkup(severityPlaceholderList, alertConfig.name)}
        />
      </ExpandableLightCard>

      <GlobalCustomPayloadCard context="LOG" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
