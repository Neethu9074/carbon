/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useMemo } from 'react';

import { create } from '@instana/observables';
import { Stack } from '@instana/components';
import { Card } from '@instana/components';

import { getQueryBuilder, getGroupByQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/logs/details/AlertThresholdInfos';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import { LogMetricChart } from 'in-alerting/smart-alerts/logs/components/LogMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import { AlertGrouping } from 'in-alerting/smart-alerts/logs/details/AlertGrouping';
import { StaticThresholdConfig, TagCatalog, ThresholdConfigUnion } from 'in-types';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { LogAlertConfigWithMetadata } from 'in-types';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;
export const selectedMetricGroup$ = create().emit(null);
export type Tags = { [index: string]: any };

export default function AlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  const { timeThreshold, threshold, granularity, groupBy, customPayloadFields, tagFilterExpression, alertChannelIds } =
    alertConfig;
  const tagCatalog = useTagCatalog();
  const AlertQueryBuilder = getQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;

  const AlertGroupByQueryBuilder = getGroupByQueryBuilder(tagCatalog as TagCatalog).QueryBuilder;
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

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
          threshold={threshold as ThresholdConfigUnion & StaticThresholdConfig}
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
          <Card title={t('in-events:titleMetrics')}>
            <LogMetricChart alertConfig={alertConfig} timeConfig={chartViewConfig.timeConfig} />
            {groupBy && groupBy.length > 0 && (
              <LogMetricGroup
                backendQueryModel={tagFilterExpression}
                groupBy={groupBy}
                timeConfig={{
                  ...chartViewConfig.timeConfig,
                  to: timeConfig.to,
                  focusedMoment: timeConfig.focusedMoment
                }}
                tagCatalog={tagCatalog}
              />
            )}
          </Card>
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
          <Stack gap="xsmall">
            <ScopeConfigPresenter
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={
                (<AlertQueryBuilder value={tagFilterFormModel} readOnly />) as unknown as QueryBuilderComponent
              }
              scopePath={<></>}
            />

            <AlertGrouping AlertQueryBuilder={AlertGroupByQueryBuilder} groupBy={groupBy ?? []} />
          </Stack>
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
      </ExpandableLightCard>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds ?? []} />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger />
      </ExpandableLightCard>

      <GlobalCustomPayloadCard context="LOG" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={() => <></>}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
