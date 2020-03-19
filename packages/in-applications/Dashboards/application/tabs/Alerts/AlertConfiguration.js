import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertChannelPresenter from 'in-new-components/Alerting/components/SelectAlertChannelPresenter';
import { createApplicationSmartAlertForm } from 'in-applications/alerting/form/applicationSmartAlertForm';
import ApplicationAlertTypeSwitch from 'in-applications/alerting/components/ApplicationAlertTypeSwitch';
import TimeThresholdDescription from 'in-new-components/Alerting/components/TimeThresholdDescription';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-applications/tags';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { alertingMetricsGranularity } from 'in-applications/alerting/constants';
import ExpandableCard from 'in-new-components/ExpandableCard';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneDay = 24 * 60 * 60 * 1000;

export default function AlertConfiguration({ alertConfig, applicationName }) {
  const form = createApplicationSmartAlertForm(alertConfig);
  const tagFilters = alertConfig.tagFilters;
  const tagFiltersWithApplicationId = [getApplicationIdTagFilter(alertConfig.applicationId), ...tagFilters];

  const timeConfig = {
    windowSize: oneDay
  };

  return (
    <>
      <ListTitle>Alert configuration</ListTitle>

      <Card title="Trigger" withoutPadding darkFrame>
        <ApplicationAlertTypeSwitch
          alertType={alertConfig.rule.alertType}
          ErrorRateComponent={() => (
            <ChartContainer headline="Last 24 hours">
              <ErrorRateAlertingBarChart
                applicationId={alertConfig.applicationId}
                timeConfig={timeConfig}
                tagFilters={tagFilters}
                metricName={alertConfig.rule.metricName}
                granularity={alertingMetricsGranularity}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
              />
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
        <TimeThresholdDescription config={alertConfig} />
      </ExpandableCard>

      <ExpandableCard title="Alert Channels" darkFrame openByDefault bodyWithoutPadding>
        <div className={locals.alertChannelsWrapper}>
          <SelectAlertChannelPresenter
            isSearchable={false}
            getHeader={() => null}
            rightHeader={null}
            tableActions={[]}
            form={form}
          />
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
