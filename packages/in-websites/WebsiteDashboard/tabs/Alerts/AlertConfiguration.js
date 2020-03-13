import React, { useState } from 'react';

import alertFormDefinition, {
  fieldNames,
  getRuleOperatorLabel,
  getStatusCodeLabel
} from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import SelectAlertChannelPresenter from 'in-new-components/Alerting/components/SelectAlertChannelPresenter';
import TimeThresholdDescription from 'in-websites/WebsiteDashboard/tabs/Alerts/TimeThresholdDescription';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import AlertLocationFilters from 'in-new-components/Alerting/components/AlertLocationFilters';
import SelectedAlertTypeInfo from 'in-websites/eum-alerting/components/SelectedAlertTypeInfo';
import { getThreshold, getTimeThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
import AlertTypeSwitch from 'in-websites/eum-alerting/components/AlertTypeSwitch';
import AlertProperties from 'in-websites/eum-alerting/advanced/AlertProperties';
import ChartContainer from 'in-websites/eum-alerting/advanced/ChartContainer';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import ExpandableCard from 'in-new-components/ExpandableCard';
import { operators } from 'in-analyze/applicationFilter';
import ListTitle from 'in-new-components/lists/Title';
import Card from 'in-new-components/Card';

import locals from './AlertConfiguration.mless';

const oneMinute = 60 * 1000;
const oneDay = 24 * 60 * oneMinute;

export default function AlertConfiguration({ alertConfig, websiteLabel }) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig));

  const onChange = createOnChange(setForm);
  const granularity = 10 * oneMinute;
  const timeConfig = {
    windowSize: oneDay
  };

  const props = {
    form,
    onChange,
    timeConfig
  };

  return (
    <>
      <ListTitle>Alert configuration</ListTitle>

      <Card title="Trigger" withoutPadding darkFrame>
        <AlertTypeSwitch
          alertType={form.get(fieldNames.ruleAlertType).value}
          JsErrorsComponent={() => (
            <>
              <SelectedAlertTypeInfo
                title="Error Message"
                description={getDescription(form)}
                svgIconType="lib_help_error_warning"
              />

              <ChartContainer headline="Last 24 hours">
                <JsErrorsAlertingBarChart
                  websiteId={form.get(fieldNames.websiteId).value}
                  timeConfig={timeConfig}
                  tagFilters={form.get(fieldNames.tagFilters).value}
                  errorFilter={{
                    name: 'beacon.error.message',
                    operator: form.get(fieldNames.ruleOperator).value,
                    stringValue: form.get(fieldNames.ruleValue).value
                  }}
                  metricName={form.get(fieldNames.ruleMetricName).value}
                  granularity={granularity}
                  threshold={getThreshold(form)}
                  timeThreshold={getTimeThreshold(form)}
                />
              </ChartContainer>
            </>
          )}
          StatusCodeComponent={() => (
            <>
              <SelectedAlertTypeInfo
                title="HTTP Status Code"
                description={getStatusCodeLabel(form.get(fieldNames.ruleValue).value)}
              />
              <ChartContainer headline="Last 24 hours">
                <StatusCodeAlertingBarChart
                  websiteId={form.get(fieldNames.websiteId).value}
                  threshold={getThreshold(form)}
                  timeThreshold={getTimeThreshold(form)}
                  timeConfig={timeConfig}
                  tagFilters={form.get(fieldNames.tagFilters).value}
                  numeratorFilter={{
                    name: 'beacon.http.status',
                    operator: form.get(fieldNames.ruleOperator).value,
                    stringValue: form.get(fieldNames.ruleValue).value
                  }}
                  metricName={form.get(fieldNames.ruleMetricName).value}
                  granularity={granularity}
                />
              </ChartContainer>
            </>
          )}
          SlownessComponent={() => (
            <ChartContainer headline="Last 24 hours">
              <SlownessAlertingBarChart
                websiteId={form.get(fieldNames.websiteId).value}
                threshold={{
                  ...getThreshold(form),
                  value: getFormValueOrDefault(form, fieldNames.thresholdValue, 0),
                  baseline: getFormValueOrDefault(form, fieldNames.thresholdBaseline, [])
                }}
                timeThreshold={getTimeThreshold(form)}
                sensitivity={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 0)}
                timeConfig={timeConfig}
                tagFilters={form.get(fieldNames.tagFilters).value}
                aggregation={form.get(fieldNames.ruleAggregation).value}
                granularity={granularity}
              />
            </ChartContainer>
          )}
        />
      </Card>

      <ExpandableCard title="Scope" openByDefault bodyWithoutPadding darkFrame>
        <div className={locals.wrapper}>
          <AlertLocationFilters {...props} isReadOnly granularity={granularity} websiteLabel={websiteLabel} />
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
            {...props}
          />
        </div>
      </ExpandableCard>

      <ExpandableCard title="Alert Properties" openByDefault bodyWithoutPadding darkFrame>
        <AlertProperties {...props} isReadOnly granularity={granularity} websiteLabel={websiteLabel} />
      </ExpandableCard>
    </>
  );
}

function createOnChange(setForm) {
  return (form, fieldName, fieldValue, ...atomicAddFields) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (atomicAddFields.length > 0) {
      atomicAddFields.forEach(
        ({ name, value }) => (updatedForm = updatedForm.updateIn([name], field => field.setValue(value)))
      );
    }

    setForm(updatedForm);
  };
}

function getDescription(form) {
  const operator = form.get(fieldNames.ruleOperator).value;
  let description = getRuleOperatorLabel(operator);
  if (operator !== operators.NOT_EMPTY) {
    description = `${description}: "${form.get(fieldNames.ruleValue).value}"`;
  }
  return description;
}
