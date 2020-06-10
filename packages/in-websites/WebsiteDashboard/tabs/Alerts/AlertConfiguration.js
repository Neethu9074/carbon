import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-websites/alerting/form/ruleFormData';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import StatusCodeAlertingBarChart from 'in-websites/alerting/chart/StatusCodeAlertingBarChart';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import JsErrorsAlertingBarChart from 'in-websites/alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/alerting/chart/SlownessAlertingBarChart';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
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
    rule: { operator, value, metricName, alertType, aggregation },
    threshold: { deviationFactor },
    timeThreshold,
    alertChannelIds,
    tagFilters,
    websiteId,
    granularity
  } = alertConfig;

  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(websiteId), ...tagFilters];

  return (
    <AlertDetailsCard>
      <LocallyChangedTheme theme={light}>
        <ListTitle>Alert Configuration</ListTitle>

        <ChartViewConfigurator
          onChartViewConfigChange={index => setSelectedChartViewConfigIndex(index)}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          className={locals.chartContainer}
          title="Trigger"
          framed
        >
          {chartViewConfig => (
            <AlertTypeSwitch
              alertType={alertType}
              renderJsErrors={() => (
                <>
                  <SelectedAlertTypeInfo
                    title="Error Message"
                    description={getDescription(operator, value)}
                    svgIconType="lib_help_error_warning"
                  />

                  <JsErrorsAlertingBarChart
                    {...alertConfig}
                    viewConfig={chartViewConfig}
                    errorFilter={{
                      name: 'beacon.error.message',
                      operator: operator,
                      stringValue: value
                    }}
                    metricName={metricName}
                    granularity={granularity}
                  />
                </>
              )}
              renderStatusCode={() => (
                <>
                  <SelectedAlertTypeInfo title="HTTP Status Code" description={getStatusCodeLabel(value)} />
                  <StatusCodeAlertingBarChart
                    {...alertConfig}
                    viewConfig={chartViewConfig}
                    numeratorFilter={{
                      name: 'beacon.http.status',
                      operator: operator,
                      stringValue: value
                    }}
                    metricName={metricName}
                    granularity={granularity}
                  />
                </>
              )}
              renderSlowness={() => (
                <SlownessAlertingBarChart
                  {...alertConfig}
                  sensitivity={deviationFactor}
                  viewConfig={chartViewConfig}
                  aggregation={aggregation}
                  granularity={granularity}
                />
              )}
            />
          )}
        </ChartViewConfigurator>

        <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame useMaxAvailableHeight={false}>
          <div className={locals.filterList}>
            <TagFilterListPresenter
              tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                tagFilters: tagFiltersWithWebsiteId,
                websiteLabel
              })}
              disabled
            />
          </div>
        </ExpandableCard>

        <ExpandableCard title="Time Threshold" openByDefault bodyWithoutPadding darkFrame useMaxAvailableHeight={false}>
          <TimeThresholdDescription timeThreshold={timeThreshold} />
        </ExpandableCard>

        <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding useMaxAvailableHeight={false}>
          <div className={locals.alertChannelsWrapper}>
            <AlertChannelsViewer alertChannelIds={alertChannelIds} />
          </div>
        </ExpandableCard>

        <ExpandableCard
          title="Alert Properties"
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

function getWebsiteIdTagFilter(websiteId) {
  return {
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  };
}
