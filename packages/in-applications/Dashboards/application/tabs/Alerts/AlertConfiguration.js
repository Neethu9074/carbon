import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReadOnlyInboundOrAllCalls from 'in-applications/alerting/advanced/InboundOutboundCallsSwitch/ReadOnlyInboundOrAllCalls';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import StatusCodeAlertingBarChart from 'in-applications/alerting/chart/StatusCodeAlertingBarChart';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import { getLogMessageRuleOperatorLabel } from 'in-applications/alerting/form/ruleFormData';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import LogsAlertingBarChart from 'in-applications/alerting/chart/LogsAlertingBarChart';
import AlertDetailsCard from 'in-new-components/Alerting/components/AlertDetailsCard';
import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import { light } from 'in-themes/themes';

import locals from 'in-new-components/Alerting/shared-styles/AlertConfiguration.mless';

const logLevelList = ['ERROR', 'WARN'];
const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, applicationName }) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);

  const {
    rule: { operator, alertType, aggregation, message, level },
    threshold: { deviationFactor },
    timeThreshold,
    alertChannelIds,
    tagFilters,
    applicationId,
    granularity
  } = alertConfig;

  const tagFiltersWithApplicationId = [getApplicationIdTagFilter(applicationId), ...tagFilters];

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
          {({ timeConfig, minChartMetricGranularity }) => (
            <AlertTypeSwitch
              alertType={alertType}
              renderErrorRate={() => (
                <ErrorRateAlertingBarChart
                  {...alertConfig}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={granularity}
                  minChartMetricGranularity={minChartMetricGranularity}
                />
              )}
              renderSlowness={() => (
                <SlownessAlertingBarChart
                  {...alertConfig}
                  sensitivity={deviationFactor}
                  timeConfig={timeConfig}
                  aggregation={aggregation}
                  granularity={granularity}
                  minChartMetricGranularity={minChartMetricGranularity}
                />
              )}
              renderLogs={() => (
                <>
                  <SelectedAlertTypeInfo
                    title="Log Message"
                    description={getDescription(operator, message)}
                    badges={getLogLevelAsList(level)}
                  />

                  <LogsAlertingBarChart
                    {...alertConfig}
                    logMessage={message}
                    logMessageOperator={operator}
                    logLevel={level}
                    timeConfig={timeConfig}
                    tagFilters={tagFilters}
                    granularity={granularity}
                    minChartMetricGranularity={minChartMetricGranularity}
                  />
                </>
              )}
              renderStatusCode={() => (
                <StatusCodeAlertingBarChart
                  applicationId={alertConfig.applicationId}
                  statusCodeStart={alertConfig.rule.statusCodeStart}
                  statusCodeEnd={alertConfig.rule.statusCodeEnd}
                  logLevel={alertConfig.rule.level}
                  timeConfig={timeConfig}
                  tagFilters={tagFilters}
                  granularity={granularity}
                  minChartMetricGranularity={minChartMetricGranularity}
                  threshold={alertConfig.threshold}
                  timeThreshold={alertConfig.timeThreshold}
                  boundaryScope={alertConfig.boundaryScope}
                />
              )}
            />
          )}
        </ChartViewConfigurator>

        <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame useMaxAvailableHeight={false}>
          <div className={locals.filterList}>
            <TagFilterListPresenter
              tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
                tagFilters: tagFiltersWithApplicationId,
                applicationName
              })}
              disabled
            />
            <ReadOnlyInboundOrAllCalls alertConfig={alertConfig} />
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
  applicationName: PropTypes.string.isRequired
};

function getDescription(operator, message) {
  let description = getLogMessageRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${message}"`;
  }
  return description;
}

function getLogLevelAsList(level) {
  if (level === 'ANY') {
    return logLevelList;
  }
  return [level];
}
