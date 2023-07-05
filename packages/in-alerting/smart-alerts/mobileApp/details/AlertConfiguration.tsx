/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  CustomEventMobileAppAlertRule,
  HistoricBaselineConfig,
  MobileAppAlertConfigWithMetadata,
  StaticThresholdConfig,
  StatusCodeMobileAppAlertRule,
  ThresholdConfig,
  isAdaptiveBaselineConfig
} from '@instana/types';

//@ts-expect-error TS migration
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
//@ts-expect-error TS migration
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
//@ts-expect-error TS migration
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/mobileApp/details/AlertThresholdInfos';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import useMobileAppLabel from 'in-alerting/smart-alerts/mobileApp/hooks/useMobileAppLabel';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
//@ts-expect-error TS migration
import ListTitle from 'in-components/lists/Title';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig }: { alertConfig: MobileAppAlertConfigWithMetadata }) {
  const {
    rule: { alertType, metricName, aggregation },
    threshold,
    timeThreshold,
    granularity,
    alertChannelIds,
    tagFilterExpression,
    mobileAppId
  } = alertConfig;

  const value = (alertConfig.rule as StatusCodeMobileAppAlertRule).value;
  const customEventName = (alertConfig.rule as CustomEventMobileAppAlertRule).customEventName;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const mobileAppLabel = useMobileAppLabel(mobileAppId);

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const thresholdType = alertConfig.threshold;
  const chartViewConfigs = isAdaptiveBaselineConfig(thresholdType) ? [chartViewConfig24hours] : defaultChartViewConfigs;

  return (
    <AlertDetailsCard>
      <ListTitle>
        {t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationListTitleAlertConfiguration')}
      </ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos
          threshold={threshold as ThresholdConfig & StaticThresholdConfig & HistoricBaselineConfig}
          rule={{ alertType, aggregation, metricName }}
        />
      </ExpandableLightCard>

      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <>
            {alertType === 'statusCode' && (
              <SelectedAlertTypeInfo
                title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleHTTPStatusCode')}
                description={getStatusCodeLabel(value)}
              />
            )}
            {alertType === 'customEvent' && (
              <SelectedAlertTypeInfo
                title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleCustomEvent')}
                description={customEventName}
                svgIconType="lib_mobile_app_custom_event"
                darkSvgIcon
              />
            )}
            <MobileAppAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
              isAlertDetailView
            />
          </>
        )}
      </ChartViewConfigurator>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.paddingBodyWrapper}>
          <ScopeConfigPresenter
            tagFilterFormModel={tagFilterFormModel}
            queryBuilder={
              (<AlertQueryBuilder value={tagFilterFormModel} readOnly />) as unknown as QueryBuilderComponent
            }
            scopePath={<MobileAppScopePath mobileAppName={mobileAppLabel ?? undefined} />}
          />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleAlertChannels')}
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
        title={t('in-alerting:smartAlerts.mobileApp.alertDetails.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} disableTrigger={false} />
      </ExpandableLightCard>
    </AlertDetailsCard>
  );
}
