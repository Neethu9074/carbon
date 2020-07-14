import theme from 'in-themes';
import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTitleChanged,
  applicationsAlertingAdditionalPropsTriggerChanged
} from 'in-applications/alerting/tracker';
import TimeThresholdConfigPresenter from 'in-new-components/Alerting/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-new-components/Alerting/advanced/AlertProperties/AlertPropertiesContainer';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-applications/alerting/form/formUtils';
import StatusCodeInteractiveChart from 'in-applications/alerting/advanced/StatusCodeInteractiveChart';
import GlobalAdvancedModeContainer from 'in-new-components/Alerting/advanced/AdvancedModeContainer';
import ErrorRateInteractiveChart from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import SlownessInteractiveChart from 'in-applications/alerting/advanced/SlownessInteractiveChart';
import InboundOutboundCallsSwitch from './InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import AlertLocationFilters from 'in-applications/alerting/components/AlertLocationFilters';
import LogsInteractiveChart from 'in-applications/alerting/advanced/LogsInteractiveChart';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';
import { alertingDialogItemPickerTimeframe } from 'in-new-components/Alerting/constants';
import BlueprintSelection from 'in-applications/alerting/advanced/BlueprintSelection';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import ProvideStatusCode from 'in-applications/alerting/components/ProvideStatusCode';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import { blueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import LightCard from 'in-new-components/Card/LightCard';
import Message from 'in-new-components/Message';

export default function AdvancedModeContainer(props) {
  const {
    form,
    timeConfig,
    granularity,
    onChange,
    setSliderState,
    updateForm,
    applicationLabel,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult
  } = props;

  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: 'Scope',
          title: 'Scope: Where is the condition happening?',
          content: (
            <>
              <AlertLocationFilters
                form={form}
                applicationLabel={applicationLabel}
                timeConfig={timeConfig}
                updateForm={updateForm}
              />
              <InboundOutboundCallsSwitch form={form} updateForm={updateForm} />
            </>
          ),
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
                renderErrorRate={() => (
                  <ErrorRateInteractiveChart
                    form={form}
                    timeConfig={timeConfig}
                    granularity={granularity}
                    onChange={onChange}
                    onChartViewConfigChange={onChartViewConfigChange}
                    selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                  />
                )}
                renderSlowness={() => (
                  <>
                    <SlownessInteractiveChart
                      form={form}
                      timeConfig={timeConfig}
                      granularity={granularity}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                    {hasBaselineError(thresholdResult) && (
                      <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
                        Insufficient data to compute the selected baseline. Please select <i>Static Threshold</i>{' '}
                        instead.
                        <br />
                        <b>Reason:</b> {getErrorReason(thresholdResult)}
                      </Message>
                    )}
                  </>
                )}
                renderLogs={() => (
                  <>
                    <LightCard title="Log Message" withoutPadding darkFrame>
                      {
                        <ProvideLogMessage
                          form={form}
                          timeConfig={{
                            windowSize: alertingDialogItemPickerTimeframe
                          }}
                          updateForm={updateForm}
                          onSelectLogMessage={setSliderState}
                          mode="Advanced"
                        />
                      }
                    </LightCard>
                    <LogsInteractiveChart
                      form={form}
                      timeConfig={timeConfig}
                      granularity={granularity}
                      onChange={onChange}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
                renderStatusCode={() => (
                  <>
                    <LightCard title="HTTP Status Codes" withoutPadding darkFrame>
                      <ProvideStatusCode form={form} updateForm={updateForm} mode="Advanced" />
                    </LightCard>
                    <StatusCodeInteractiveChart
                      form={form}
                      granularity={granularity}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
              />
            </>
          )
        },
        {
          scrollId: '3',
          label: 'Time Threshold',
          title: 'Time Threshold: When do you want to be alerted?',
          checked: true,
          content: (
            <TimeThresholdConfigPresenter
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              hasRequestImpactOption
            />
          )
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
              label={applicationLabel}
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

function hasBaselineError(thresholdResult) {
  return thresholdResult && thresholdResult.errors.length > 0;
}

function getErrorReason(thresholdResult) {
  return thresholdResult.errors[0].message;
}
