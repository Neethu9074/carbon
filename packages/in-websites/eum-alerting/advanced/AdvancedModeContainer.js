import { compose, withProps } from 'recompose';
import theme from 'in-themes';
import React from 'react';

import TimeThresholdConfig from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/TimeThresholdConfig';
import StatusCodeInteractiveChart from 'in-websites/eum-alerting/advanced/StatusCodeInteractiveChart';
import SlownessInteractiveChart from 'in-websites/eum-alerting/advanced/SlownessInteractiveChart';
import JsErrorsInteractiveChart from 'in-websites/eum-alerting/advanced/JsErrorsInteractiveChart';
import AlertPropertiesContainer from 'in-websites/eum-alerting/advanced/AlertPropertiesContainer';
import AlertLocationFilters from 'in-new-components/Alerting/components/AlertLocationFilters';
import AlertSelection from 'in-websites/eum-alerting/advanced/AlertSelection/AlertSelection';
import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';
import ProvideStatusCode from 'in-websites/eum-alerting/components/ProvideStatusCode';
import AdvancedModeContainer from 'in-new-components/Alerting/AdvancedModeContainer';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import AlertTypeSwitch from 'in-websites/eum-alerting/components/AlertTypeSwitch';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import { modeAdvanced } from 'in-websites/eum-alerting/constants';
import Message from 'in-new-components/Message';
import Card from 'in-new-components/Card';

export default compose(
  withProps(({ form, websiteLabel, timeConfig, onChange, setSliderState, granularity }) => ({
    navItems: [
      {
        scrollId: '1',
        label: 'Scope',
        title: 'Scope: Where is the condition happening?',
        content: (
          <AlertLocationFilters form={form} websiteLabel={websiteLabel} timeConfig={timeConfig} onChange={onChange} />
        ),
        checked: true
      },
      {
        scrollId: '2',
        label: 'Trigger',
        title: 'Trigger: What do you want to be alerted on?',
        checked: validateTrigger(form),
        content: (
          <>
            <AlertSelection form={form} onChange={onChange} />
            <AlertTypeSwitch
              alertType={form.get(fieldNames.ruleAlertType).value}
              JsErrorsComponent={() => (
                <>
                  <Card title="JS Error Message" withoutPadding darkFrame>
                    <ProvideManualPattern
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      onSelectJsError={setSliderState}
                      mode={modeAdvanced}
                    />
                  </Card>
                  <JsErrorsInteractiveChart
                    form={form}
                    onChange={onChange}
                    timeConfig={timeConfig}
                    granularity={granularity}
                  />
                </>
              )}
              StatusCodeComponent={() => (
                <>
                  <Card title="HTTP Status Code" withoutPadding darkFrame>
                    <ProvideStatusCode form={form} onChange={onChange} mode={modeAdvanced} />
                  </Card>
                  <StatusCodeInteractiveChart
                    form={form}
                    onChange={onChange}
                    timeConfig={timeConfig}
                    granularity={granularity}
                  />
                </>
              )}
              SlownessComponent={() => {
                return (
                  <>
                    <SlownessInteractiveChart
                      form={form}
                      timeConfig={timeConfig}
                      granularity={granularity}
                      onChange={onChange}
                    />
                    {showInsufficientBaselineDataMessage(form) && (
                      <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
                        Insufficient data to compute the selected baseline. Please select <i>Static Threshold</i>{' '}
                        instead.
                      </Message>
                    )}
                  </>
                );
              }}
            />
          </>
        )
      },
      {
        scrollId: '3',
        label: 'Time Threshold',
        title: 'Time Threshold: When do you want to be alerted?',
        checked: true,
        content: <TimeThresholdConfig form={form} onChange={onChange} />
      },
      {
        scrollId: '4',
        label: 'Alert Channels',
        title: 'Alert Channels: Who needs to be alerted?',
        checked: form.get(fieldNames.alertChannelIds).value.length > 0,
        content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
      },
      {
        scrollId: '5',
        label: 'Properties (optional)',
        title: 'Additional Alert Properties (optional)',
        checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value),
        content: <AlertPropertiesContainer form={form} onChange={onChange} websiteLabel={websiteLabel} />
      }
    ]
  }))
)(AdvancedModeContainer);

function validateTrigger(form) {
  const alertType = form.get(fieldNames.ruleAlertType).value;

  if (alertType === 'specificJsError') {
    return Boolean(form.get(fieldNames.ruleAlertType).value && getFormValueOrDefault(form, fieldNames.ruleValue));
  } else {
    return true;
  }
}

function showInsufficientBaselineDataMessage(form) {
  if (form.get(fieldNames.thresholdType).value === 'staticThreshold') {
    return false;
  }

  const baseline = form.get(fieldNames.thresholdBaseline).value;
  return baseline && baseline.length === 0;
}
