/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-websites/alerting/form/ruleFormData';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
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
    tagFilters
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>
          {t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationListTitleAlertConfiguration')}
        </ListTitle>

        <ChartViewConfigurator
          onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          className={locals.chartContainer}
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleTrigger')}
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

              <AlertingChartWithErrorMessage
                alertConfigWithFormModel={alertConfig}
                viewConfig={chartViewConfig}
                blueprintConfig={blueprintConfig}
              />
            </>
          )}
        </ChartViewConfigurator>

        <ExpandableCard
          title={t('in-websites:websiteDashboard.tabs.alerts.alertConfigurationTitleScope')}
          openByDefault
          bodyWithoutPadding
          darkFrame
          useMaxAvailableHeight={false}
        >
          <div className={locals.filterList}>
            <TagFilterListPresenter
              tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                tagFilters: [...blueprintConfig.getEntityTagFilters(alertConfig), ...tagFilters],
                websiteLabel
              })}
              disabled
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
          openByDefault
          bodyWithoutPadding
          darkFrame
          useMaxAvailableHeight={false}
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
