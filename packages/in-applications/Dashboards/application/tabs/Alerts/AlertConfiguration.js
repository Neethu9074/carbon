import PropTypes from 'prop-types';
import React from 'react';

import SelectAlertChannelPresenter from 'in-new-components/Alerting/components/SelectAlertChannelPresenter';
import { createApplicationSmartAlertForm } from 'in-applications/alerting/form/applicationSmartAlertForm';
import ApplicationAlertTypeSwitch from 'in-applications/alerting/components/ApplicationAlertTypeSwitch';
import ErrorRateAlertingBarChart from 'in-applications/alerting/chart/ErrorRateAlertingBarChart';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { alertingMetricsGranularity } from 'in-applications/alerting/constants';
import ExpandableCard from 'in-new-components/ExpandableCard';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneDay = 24 * 60 * 60 * 1000;

export default function AlertConfiguration({ alertConfig }) {
  const form = createApplicationSmartAlertForm(alertConfig);

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
                tagFilters={alertConfig.tagFilters}
                metricName={alertConfig.rule.metricName}
                granularity={alertingMetricsGranularity}
                threshold={alertConfig.threshold}
                timeThreshold={alertConfig.timeThreshold}
              />
            </ChartContainer>
          )}
        />
      </Card>

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
        <AlertPropertyInfos form={form} />
      </ExpandableCard>
    </>
  );
}

AlertConfiguration.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
