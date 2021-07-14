/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import TimeThresholdDescription from 'in-alerting/smart-alerts/components/smart-alert-dialog/TimeThresholdDescription';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import ExpandableLightCard from 'in-alerting/components/ExpandableLightCard/ExpandableLightCard';
import CustomPayloadCard from 'in-alerting/smart-alerts/applications/details/CustomPayloadCard';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import useWebsiteLabel from 'in-alerting/smart-alerts/websites/hooks/useWebsiteLabel';
import SelectedAlertTypeInfo from 'in-alerting/components/SelectedAlertTypeInfo';
import ScopeConfigPresenter from 'in-alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-alerting/components/AlertPropertyInfos';
import AlertDetailsCard from 'in-alerting/components/AlertDetailsCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig }) {
  const {
    rule: { operator, value, alertType, metricName },
    timeThreshold,
    alertChannelIds,
    tagFilterExpression,
    websiteId,
    customPayloadFields
  } = alertConfig;

  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const websiteLabel = useWebsiteLabel(websiteId);

  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const AlertQueryBuilder = getQueryBuilderForBeaconType(beaconType).QueryBuilder;

  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <ListTitle>
        {t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationListTitleAlertConfiguration')}
      </ListTitle>

      <ChartViewConfigurator
        alertConfigWithFormModel={{
          ...alertConfig,
          tagFilterExpression: tagFilterFormModel
        }}
        onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
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
            {alertType === 'specificStatusCode' && (
              <SelectedAlertTypeInfo
                title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleHTTPStatusCode')}
                description={getStatusCodeLabel(value)}
              />
            )}
            <WebsitesAlertingChartWithErrorMessage
              alertConfigWithFormModel={{
                ...alertConfig,
                tagFilterExpression: tagFilterFormModel
              }}
              viewConfig={chartViewConfig}
              blueprintConfig={blueprintConfig}
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
        openByDefault
        bodyWithoutPadding
        darkFrame
        useMaxAvailableHeight={false}
      >
        <TimeThresholdDescription timeThreshold={timeThreshold} />
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertChannels')}
        darkFrame
        openByDefault
        bodyWithoutPadding
        useMaxAvailableHeight={false}
      >
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
        </div>
      </ExpandableLightCard>

      <ExpandableLightCard
        title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertProperties')}
        useMaxAvailableHeight={false}
        openByDefault
        bodyWithoutPadding
        darkFrame
      >
        <AlertPropertyInfos alertConfig={alertConfig} />
      </ExpandableLightCard>

      <CustomPayloadCard customPayloadFields={customPayloadFields} />
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
