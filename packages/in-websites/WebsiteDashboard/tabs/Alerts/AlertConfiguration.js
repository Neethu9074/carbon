import PropTypes from 'prop-types';
import React from 'react';

import alertFormDefinition, {
  getRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import SelectAlertChannelPresenter from 'in-new-components/Alerting/components/SelectAlertChannelPresenter';
import TimeThresholdDescription from 'in-websites/WebsiteDashboard/tabs/Alerts/TimeThresholdDescription';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import SelectedAlertTypeInfo from 'in-new-components/Alerting/components/SelectedAlertTypeInfo';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import AlertLocationFilters from 'in-new-components/Alerting/components/AlertLocationFilters';
import AlertPropertyInfos from 'in-new-components/Alerting/components/AlertPropertyInfos';
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
  const form = alertFormDefinition(alertConfig);

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
        <div className={locals.wrapper}>
          <AlertLocationFilters form={form} timeConfig={timeConfig} websiteLabel={websiteLabel} isReadOnly />
          <div className={locals.overlay} />
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
        <AlertPropertyInfos form={form} />
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
