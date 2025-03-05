/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  CustomEventMobileAppAlertRule,
  StatusCodeMobileAppAlertRule,
  ThresholdConfig,
  isAdaptiveBaselineConfig
} from '@instana/types';
import { Stack } from '@instana/components';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/mobileApp/hooks/useTagBasedPayloadConfigurator';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import GracePeriodDescription from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/mobileApp/details/AlertThresholdInfos';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import useMobileAppLabel from 'in-alerting/smart-alerts/mobileApp/hooks/useMobileAppLabel';
import { getStatusCodeLabel } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig }: { alertConfig: MobileAppSmartAlertConfigWithMetadata }) {
  const {
    rule: { alertType, metricName },
    threshold,
    timeThreshold,
    granularity,
    gracePeriod,
    alertChannelIds,
    tagFilterExpression,
    mobileAppId,
    customPayloadFields
  } = alertConfig;

  const value = (alertConfig.rule as StatusCodeMobileAppAlertRule).value;
  const customEventName = (alertConfig.rule as CustomEventMobileAppAlertRule).customEventName;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const mobileAppLabel = useMobileAppLabel(mobileAppId);

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, mobileAppId);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType, threshold.type).QueryBuilder;

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const ruleWithThreshold = alertConfig.rules[0];
  const thresholdType = ruleWithThreshold?.thresholds?.WARNING
    ? ruleWithThreshold.thresholds.WARNING.type
    : ruleWithThreshold.thresholds.CRITICAL?.type;

  const thresholdConfig = { operator: ruleWithThreshold.thresholdOperator, type: thresholdType } as ThresholdConfig;

  const chartViewConfigs = isAdaptiveBaselineConfig(thresholdConfig)
    ? [chartViewConfig24hours]
    : defaultChartViewConfigs;

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
          thresholdOperator={ruleWithThreshold.thresholdOperator}
          thresholdsMap={ruleWithThreshold?.thresholds}
          rule={ruleWithThreshold.rule}
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
              eventBasedAdaptiveBaseline={[]}
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
        openByDefault
        darkFrame
      >
        <Stack gap="large">
          <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
          <GracePeriodDescription gracePeriod={gracePeriod} />
        </Stack>
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
        <AlertPropertyInfos shouldDisplayAlertLevelSection={false} alertConfig={alertConfig} disableTrigger={false} />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="MOBILE_APP" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}
