import PropTypes from 'prop-types';
import React from 'react';

import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import { getStatusCodeLabel, getRuleOperatorLabel } from 'in-websites/eum-alerting/form/ruleFormData';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import AlertTypeSwitch from 'in-websites/eum-alerting/components/AlertTypeSwitch';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { alertingMetricsGranularity } from 'in-websites/eum-alerting/constants';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneDay = 24 * 60 * 60 * 1000;

export default function AlertConfiguration({ alertConfig, websiteLabel }) {
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithWebsiteId = [getWebsiteIdTagFilter(alertConfig.websiteId), ...tagFilters];

  const timeConfig = {
    windowSize: oneDay
  };

  return (
    <>
      <ListTitle>Alert configuration</ListTitle>

      <Card title="Trigger" withoutPadding darkFrame>
        <AlertTypeSwitch
          alertType={alertConfig.rule.alertType}
          JsErrorsComponent={() => (
            <>
              <SelectedAlertTypeInfo
                title="Error Message"
                description={getDescription(alertConfig.rule)}
                svgIconType="lib_help_error_warning"
              />

              <ChartContainer headline="Last 24 hours">
                <JsErrorsAlertingBarChart
                  websiteId={alertConfig.websiteId}
                  timeConfig={timeConfig}
                  tagFilters={alertConfig.tagFilters}
                  errorFilter={{
                    name: 'beacon.error.message',
                    operator: alertConfig.rule.operator,
                    stringValue: alertConfig.rule.value
                  }}
                  metricName={alertConfig.rule.metricName}
                  granularity={alertingMetricsGranularity}
                  threshold={alertConfig.threshold}
                  timeThreshold={alertConfig.timeThreshold}
                />
              </ChartContainer>
            </>
          )}
          StatusCodeComponent={() => (
            <>
              <SelectedAlertTypeInfo
                title="HTTP Status Code"
                description={getStatusCodeLabel(alertConfig.rule.value)}
              />
              <ChartContainer headline="Last 24 hours">
                <StatusCodeAlertingBarChart
                  websiteId={alertConfig.websiteId}
                  threshold={alertConfig.threshold}
                  timeThreshold={alertConfig.timeThreshold}
                  timeConfig={timeConfig}
                  tagFilters={alertConfig.tagFilters}
                  numeratorFilter={{
                    name: 'beacon.http.status',
                    operator: alertConfig.rule.operator,
                    stringValue: alertConfig.rule.value
                  }}
                  metricName={alertConfig.rule.metricName}
                  granularity={alertingMetricsGranularity}
                />
              </ChartContainer>
            </>
          )}
          SlownessComponent={() => (
            <ChartContainer headline="Last 24 hours">
              <SlownessAlertingBarChart
                websiteId={alertConfig.websiteId}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
                sensitivity={alertConfig.threshold.deviationFactor}
                timeConfig={timeConfig}
                tagFilters={alertConfig.tagFilters}
                aggregation={alertConfig.rule.aggregation}
                granularity={alertingMetricsGranularity}
              />
            </ChartContainer>
          )}
        />
      </Card>

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
        <TimeThresholdDescription timeThreshold={alertConfig.timeThreshold} />
      </ExpandableCard>

      <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding>
        <div className={locals.alertChannelsWrapper}>
          <AlertChannelsViewer alertChannelIds={alertConfig.alertChannelIds} />
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

function getDescription(alertConfigRule) {
  const operator = alertConfigRule.operator;
  let description = getRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${alertConfigRule.value}"`;
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
