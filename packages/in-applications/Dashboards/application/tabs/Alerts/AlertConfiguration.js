import PropTypes from 'prop-types';
import React from 'react';

import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertChannelsViewer from 'in-new-components/Alerting/components/AlertChannelsViewer';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { alertingMetricsGranularity } from 'in-applications/alerting/constants';
import ExpandableCard from 'in-new-components/ExpandableCard';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneDay = 24 * 60 * 60 * 1000;

export default function AlertConfiguration({ alertConfig, applicationName }) {
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithApplicationId = [getApplicationIdTagFilter(alertConfig.applicationId), ...tagFilters];

  const timeConfig = {
    windowSize: oneDay
  };

  return (
    <>
      <ListTitle>Alert configuration</ListTitle>

      <Card title="Trigger" withoutPadding darkFrame>
        <AlertTypeSwitch
          alertType={alertConfig.rule.alertType}
          renderErrorRate={() => (
            <ChartContainer headline="Last 24 hours">
              <ErrorRateAlertingBarChart
                applicationId={alertConfig.applicationId}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                granularity={alertingMetricsGranularity}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
              />
            </ChartContainer>
          )}
          renderSlowness={() => (
            <ChartContainer headline="Last 24 hours">
              <SlownessAlertingBarChart
                applicationId={alertConfig.applicationId}
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
          renderLogs={() => (
            <ChartContainer headline="Last 24 hours">
              <h1>TODO</h1>
            </ChartContainer>
          )}
        />
      </Card>

      <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame>
        <div className={locals.filterList}>
          <TagFilterListPresenter
            tagFilters={translateDemocratisationTagFiltersToAnalyzeTagFilters({
              tagFilters: tagFiltersWithApplicationId,
              applicationName
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
  applicationName: PropTypes.string.isRequired
};

function getApplicationIdTagFilter(applicationId) {
  return {
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  };
}
