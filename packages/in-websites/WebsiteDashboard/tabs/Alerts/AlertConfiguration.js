/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import WebsitesAlertingChartWithErrorMessage from 'in-websites/alerting/chart/WebsitesAlertingChartWithErrorMessage';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-websites/alerting/form/ruleFormData';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import ScopeConfigPresenter from 'in-new-components/Alerting/components/ScopeConfigPresenter';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import AlertQueryBuilder from 'in-websites/alerting/components/AlertQueryBuilder';
import WebsiteScopePath from 'in-websites/alerting/components/WebsiteScopePath';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import { light } from 'in-themes/themes';

import locals from 'in-new-components/Alerting/shared-styles/AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, websiteLabel }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const {
    rule: { operator, value, alertType },
    timeThreshold,
    alertChannelIds,
    tagFilters, // QB1
    tagFilterExpression, // QB2
    convertedTagFilterExpression // QB2
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);
  const tagFilterFormModel = fromBackendModel(tagFilterExpression);

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
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

        <ExpandableCard
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleScope')}
          useMaxAvailableHeight={false}
          openByDefault
          bodyWithoutPadding
          darkFrame
        >
          <div className={locals.paddingBodyWrapper}>
            <ScopeConfigPresenter
              tagFilterList={
                <TagFilterListPresenter
                  tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                    tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters],
                    websiteLabel
                  })}
                  disabled
                />
              }
              tagFilterFormModel={tagFilterFormModel}
              queryBuilder={<AlertQueryBuilder value={tagFilterFormModel} readOnly />}
              convertedTagFilterExpression={convertedTagFilterExpression}
              scopePath={<WebsiteScopePath websiteName={websiteLabel} />}
            />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleTimeThreshold')}
          openByDefault
          bodyWithoutPadding
          darkFrame
          useMaxAvailableHeight={false}
        >
          <TimeThresholdDescription timeThreshold={timeThreshold} />
        </ExpandableCard>

        <ExpandableCard
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertChannels')}
          darkFrame
          openByDefault
          bodyWithoutPadding
          useMaxAvailableHeight={false}
        >
          <div className={locals.alertChannelsWrapper}>
            <AlertChannelsViewer alertChannelIds={alertChannelIds} />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleAlertProperties')}
          useMaxAvailableHeight={false}
          openByDefault
          bodyWithoutPadding
          darkFrame
        >
          <AlertPropertyInfos alertConfig={alertConfig} />
        </ExpandableCard>
      </LocallyChangedTheme>
    </AlertDetailsCard>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  websiteLabel: PropTypes.string.isRequired
};

function getDescription(operator, value) {
  let description = getRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${value}"`;
  }
  return description;
}
