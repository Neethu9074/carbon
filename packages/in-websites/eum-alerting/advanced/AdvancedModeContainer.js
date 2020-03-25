import React from 'react';

import {
  websitesAlertingAdditionalPropsAlertLevelChanged,
  websitesAlertingAdditionalPropsDescriptionChanged,
  websitesAlertingAdditionalPropsTitleChanged,
  websitesAlertingAdditionalPropsTriggerChanged
} from 'in-websites/eum-alerting/tracker';
import {
  getFormValueOrDefault,
  getDescriptionPlaceholder,
  getTitlePlaceholder
} from 'in-websites/eum-alerting/formHelpers';
import AlertPropertiesContainer from 'in-new-components/Alerting/advanced/AlertProperties/AlertPropertiesContainer';
import { default as GlobalAdvancedModeContainer } from 'in-new-components/Alerting/advanced/AdvancedModeContainer';
import StatusCodeInteractiveChart from 'in-websites/eum-alerting/advanced/StatusCodeInteractiveChart';
import SlownessInteractiveChart from 'in-websites/eum-alerting/advanced/SlownessInteractiveChart';
import JsErrorsInteractiveChart from 'in-websites/eum-alerting/advanced/JsErrorsInteractiveChart';
import ProvideManualPattern from 'in-websites/eum-alerting/components/ProvideManualPattern';
import AlertLocationFilters from 'in-websites/eum-alerting/components/AlertLocationFilters';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';
import TimeThresholdConfig from 'in-websites/eum-alerting/advanced/TimeThresholdConfig';
import BlueprintSelection from 'in-websites/eum-alerting/advanced/BlueprintSelection';
import ProvideStatusCode from 'in-websites/eum-alerting/components/ProvideStatusCode';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import AlertTypeSwitch from 'in-websites/eum-alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-websites/eum-alerting/data/blueprintConfig';
import { modeAdvanced } from 'in-websites/eum-alerting/constants';
import { warning } from 'in-new-components/Message/types';
import Message from 'in-new-components/Message';
import Card from 'in-new-components/Card';
import theme from 'in-themes';

export default function AdvancedModeContainer(props) {
  const { form, websiteLabel, timeConfig, onChange, setSliderState, granularity, updateForm } = props;
  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: 'Scope',
          title: 'Scope: Where is the condition happening?',
          content: (
            <AlertLocationFilters
              form={form}
              websiteLabel={websiteLabel}
              timeConfig={timeConfig}
              updateForm={updateForm}
            />
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
              <BlueprintSelection form={form} updateForm={updateForm} blueprintConfig={blueprintConfig} />
              <AlertTypeSwitch
                alertType={form.get('rule').get('alertType').value}
                JsErrorsComponent={() => (
                  <>
                    <Card title="JS Error Message" withoutPadding darkFrame>
                      <ProvideManualPattern
                        form={form}
                        timeConfig={timeConfig}
                        updateForm={updateForm}
                        onSelectJsError={setSliderState}
                        mode={modeAdvanced}
                      />
                    </Card>
                    <JsErrorsInteractiveChart
                      form={form}
                      onChange={onChange}
                      updateForm={updateForm}
                      timeConfig={timeConfig}
                      granularity={granularity}
                    />
                  </>
                )}
                StatusCodeComponent={() => (
                  <>
                    <Card title="HTTP Status Code" withoutPadding darkFrame>
                      <ProvideStatusCode form={form} updateForm={updateForm} mode={modeAdvanced} />
                    </Card>
                    <StatusCodeInteractiveChart
                      form={form}
                      onChange={onChange}
                      updateForm={updateForm}
                      timeConfig={timeConfig}
                      granularity={granularity}
                    />
                    {showInsufficientBaselineDataMessage(form) && (
                      <Message type={warning} withIcon>
                        Insufficient data to compute the selected baseline. Please select <i>Static Threshold</i>{' '}
                        instead.
                      </Message>
                    )}
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
                        updateForm={updateForm}
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
          content: <TimeThresholdConfig form={form} onChange={onChange} updateForm={updateForm} hasUserImpactOption />
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
          content: (
            <AlertPropertiesContainer
              form={form}
              onChange={onChange}
              label={websiteLabel}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              getTitlePlaceholder={getTitlePlaceholder}
              trackAlertLevelChanged={websitesAlertingAdditionalPropsAlertLevelChanged}
              trackDescriptionChanged={websitesAlertingAdditionalPropsDescriptionChanged}
              trackTitleChanged={websitesAlertingAdditionalPropsTitleChanged}
              trackTriggerChanged={websitesAlertingAdditionalPropsTriggerChanged}
            />
          )
        }
      ]}
    />
  );
}

function validateTrigger(form) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;

  if (alertType === 'specificJsError') {
    return Boolean(ruleForm.get('alertType').value && getFormValueOrDefault(ruleForm, 'value'));
  } else {
    return true;
  }
}

function showInsufficientBaselineDataMessage(form) {
  const thresholdForm = form.get('threshold');

  if (thresholdForm.get('type').value === 'staticThreshold') {
    return false;
  }

  const baseline = thresholdForm.containsKey('baseline') && thresholdForm.get('baseline').value;
  return baseline && baseline.length === 0;
}
