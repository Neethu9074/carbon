/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { isAdaptiveBaselineConfig } from '@instana/types';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/websites/hooks/useTagBasedPayloadConfigurator';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/dialog/TimeThresholdDescription';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import GracePeriodDescription from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/websites/details/AlertThresholdInfos';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/components/details/CustomPayloadCard';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import { alertChannelPerSeverityWebsiteSaEnabled } from 'in-services/featureFlags';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig }) {
  const {
    rules,
    timeThreshold,
    granularity,
    gracePeriod,
    alertChannelIds,
    alertChannels,
    tagFilterExpression,
    websiteId,
    customPayloadFields
  } = alertConfig;

  const { rule, thresholds, thresholdOperator } = rules[0];
  const { value, alertType, metricName, customEventName, operator } = rule;
  const threshold = thresholds?.WARNING ?? thresholds.CRITICAL;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const websiteLabel = useWebsiteLabel(websiteId);

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, websiteId);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType, threshold?.type).QueryBuilder;

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  const chartViewConfigs = isAdaptiveBaselineConfig(threshold) ? [chartViewConfig24hours] : defaultChartViewConfigs;

  return (
    <AlertDetailsCard>
      <ListTitle>
        {t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationListTitleAlertConfiguration')}
      </ListTitle>
      <ExpandableLightCard
        title={t('in-alerting:smartAlerts.details.header')}
        useMaxAvailableHeight={false}
        openByDefault
        darkFrame
      >
        <AlertThresholdInfos thresholdOperator={thresholdOperator} thresholdsMap={thresholds} rule={rule} />
      </ExpandableLightCard>

      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <>
            {alertType === 'specificJsError' && (
              <SelectedAlertTypeInfo
                title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleErrorMessage')}
                description={getDescription(operator, value)}
                svgIconType="lib_help_error_warning"
              />
            )}
            {alertType === 'statusCode' && (
              <SelectedAlertTypeInfo
                title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleHTTPStatusCode')}
                description={getStatusCodeLabel(value)}
              />
            )}
            {alertType === 'customEvent' && (
              <SelectedAlertTypeInfo
                title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleCustomEvent')}
                description={customEventName}
                svgIconType="lib_website_custom"
                darkSvgIcon
              />
            )}
            <WebsitesAlertingChartWithErrorMessage
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
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleScope')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <div className={locals.paddingBodyWrapper}>
          <ScopeConfigPresenter
            tagFilterFormModel={tagFilterFormModel}
            queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
            scopePath={<WebsiteScopePath websiteName={websiteLabel} />}
          />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleTimeThreshold')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} granularity={granularity} />
        <GracePeriodDescription gracePeriod={gracePeriod} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertChannels')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer
            alertChannelIds={alertChannelIds}
            alertChannels={alertChannels}
            alertChannelPerSeverityEnabled={alertChannelPerSeverityWebsiteSaEnabled}
          />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        bodyWithoutPadding
        openByDefault
        darkFrame
      >
        <AlertPropertyInfos shouldDisplayAlertLevelSection={false} alertConfig={alertConfig} />
      </ExpandableLightCard>
      <GlobalCustomPayloadCard context="WEBSITE" />
      <CustomPayloadCard
        customPayloadFields={customPayloadFields}
        TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
        openByDefault
      />
    </AlertDetailsCard>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired
};

function getDescription(operator, value) {
  let description = getRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${value}"`;
  }
  return description;
}
