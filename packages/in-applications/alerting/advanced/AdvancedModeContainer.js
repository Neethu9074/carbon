import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTitleChanged,
  applicationsAlertingAdditionalPropsTriggerChanged
} from 'in-applications/alerting/tracker';
import TimeThresholdConfigPresenter from 'in-new-components/Alerting/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-new-components/Alerting/advanced/AlertProperties/AlertPropertiesContainer';
import { default as GlobalAdvancedModeContainer } from 'in-new-components/Alerting/advanced/AdvancedModeContainer';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-applications/alerting/form/formUtils';
import ErrorRateInteractiveChart from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import SlownessInteractiveChart from 'in-applications/alerting/advanced/SlownessInteractiveChart';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';
import BlueprintSelection from 'in-applications/alerting/advanced/BlueprintSelection';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import Message from 'in-new-components/Message';
import theme from 'in-themes';

export default function AdvancedModeContainer(props) {
  const { form, timeConfig, granularity, onChange, setSliderState, updateForm } = props;
  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: 'Scope',
          title: 'Scope: Where is the condition happening?',
          content: <h1>TODO: Add filters here</h1>,
          checked: true
        },
        {
          scrollId: '2',
          label: 'Trigger',
          title: 'Trigger: What do you want to be alerted on?',
          checked: true,
          content: (
            <>
              <BlueprintSelection form={form} updateForm={updateForm} blueprintConfig={blueprintConfig} />
              <AlertTypeSwitch
                alertType={form.get('rule').get('alertType').value}
                renderErrorRate={() => {
                  return (
                    <ErrorRateInteractiveChart
                      form={form}
                      timeConfig={timeConfig}
                      granularity={granularity}
                      onChange={onChange}
                    />
                  );
                }}
                renderSlowness={() => {
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
          content: <TimeThresholdConfigPresenter form={form} onChange={onChange} updateForm={updateForm} />
        },
        {
          scrollId: '4',
          label: 'Alert Channels',
          title: 'Alert Channels: Who needs to be alerted?',
          checked: form.get('alertChannelIds').value.length > 0,
          content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
        },
        {
          scrollId: '5',
          label: 'Properties (optional)',
          title: 'Additional Alert Properties (optional)',
          checked: Boolean(form.get('name').value || form.get('description').value),
          content: (
            <AlertPropertiesContainer
              form={form}
              onChange={onChange}
              label={form.get('name').value}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              getTitlePlaceholder={getTitlePlaceholder}
              trackAlertLevelChanged={applicationsAlertingAdditionalPropsAlertLevelChanged}
              trackDescriptionChanged={applicationsAlertingAdditionalPropsDescriptionChanged}
              trackTitleChanged={applicationsAlertingAdditionalPropsTitleChanged}
              trackTriggerChanged={applicationsAlertingAdditionalPropsTriggerChanged}
            />
          )
        }
      ]}
    />
  );
}

function showInsufficientBaselineDataMessage(form) {
  const thresholdForm = form.get('threshold');

  if (thresholdForm.get('type').value === 'staticThreshold') {
    return false;
  }

  const baseline = thresholdForm.containsKey('baseline') && thresholdForm.get('baseline').value;
  return baseline && baseline.length === 0;
}
