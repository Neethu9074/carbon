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
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import AlertTypeSwitch from 'in-websites/alerting/components/AlertTypeSwitch';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';

import locals from './AlertConfiguration.mless';

const initialChartConfigIndex = 0;

export default function AlertConfiguration({ alertConfig, websiteLabel }) {
  const [indexSelectedChartConfig, setIndexSelectedChartConfig] = useState(initialChartConfigIndex);

  const {
    rule: { operator, value, metricName, alertType, aggregation },
    threshold: { deviationFactor },
    timeThreshold,
    alertChannelIds,
    tagFilters,
    websiteId
  } = alertConfig;

  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(websiteId), ...tagFilters];

  return (
    <>
      <ListTitle>Alert Configuration</ListTitle>

      <ChartViewConfigurator
        onChartConfigChange={({ index }) => setIndexSelectedChartConfig(index)}
        indexInitialSelectedTimeConfig={indexSelectedChartConfig}
        className={locals.chartContainer}
        title="Trigger"
        framed
      >
        {({ timeConfig, granularity }) => (
          <AlertTypeSwitch
            alertType={alertType}
            renderJsErrors={() => (
              <>
                <SelectedAlertTypeInfo
                  title="Error Message"
                  description={getDescription(operator, value)}
                  svgIconType="lib_help_error_warning"
                />

                <ChartContainer headline="Last 24 hours">
                  <JsErrorsAlertingBarChart
                    {...alertConfig}
                    timeConfig={timeConfig}
                    errorFilter={{
                      name: 'beacon.error.message',
                      operator: operator,
                      stringValue: value
                    }}
                    metricName={metricName}
                    granularity={granularity}
                  />
                </ChartContainer>
              </>
            )}
            renderStatusCode={() => (
              <>
                <SelectedAlertTypeInfo title="HTTP Status Code" description={getStatusCodeLabel(value)} />
                <ChartContainer headline="Last 24 hours">
                  <StatusCodeAlertingBarChart
                    {...alertConfig}
                    timeConfig={timeConfig}
                    numeratorFilter={{
                      name: 'beacon.http.status',
                      operator: operator,
                      stringValue: value
                    }}
                    metricName={metricName}
                    granularity={granularity}
                  />
                </ChartContainer>
              </>
            )}
            renderSlowness={() => (
              <ChartContainer headline="Last 24 hours">
                <SlownessAlertingBarChart
                  {...alertConfig}
                  sensitivity={deviationFactor}
                  timeConfig={timeConfig}
                  aggregation={aggregation}
                  granularity={granularity}
                />
              </ChartContainer>
            )}
          />
        )}
      </ChartViewConfigurator>

      <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame>
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

      <ExpandableCard title="Time Threshold" openByDefault bodyWithoutPadding darkFrame>
        <TimeThresholdDescription timeThreshold={timeThreshold} />
      </ExpandableCard>

      <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding>
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertChannelIds} />
        </div>
      </ExpandableCard>

      <ExpandableCard title="Alert Properties" openByDefault bodyWithoutPadding darkFrame>
        <AlertPropertyInfos alertConfig={alertConfig} />
      </ExpandableCard>
    </>
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
