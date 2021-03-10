/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTitleChanged,
  applicationsAlertingAdditionalPropsTriggerChanged,
  applicationsAlertingBlueprintChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import GlobalAdvancedModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import BlueprintSelection from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/BlueprintSelection';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ErrorRateInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ErrorRateInteractiveChart';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import BaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/BaselineErrorMessage';
import SelectAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/SelectAlertChannel';
import ScopeConfig from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ScopeConfig';
import LogsInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/LogsInteractiveChart';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import LightCard from 'in-new-components/Card/LightCard';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    timeConfig,
    onChange,
    setSliderState,
    updateForm,
    applicationLabel,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    editMode,
    QueryBuilderComponent,
    isTagFilterFormModelValid
  } = props;
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.title'),
          content: (
            <>
              <AlertEvaluationControl form={form} updateForm={updateForm} />
              <InboundOutboundCallsSwitch form={form} updateForm={updateForm} />
              <IncludeInternalOrSyntheticCallsSwitch form={form} updateForm={updateForm} />
              <ScopeConfig
                form={form}
                updateForm={updateForm}
                QueryBuilderComponent={QueryBuilderComponent}
                editMode={editMode}
                timeConfig={timeConfig}
              />
            </>
          ),
          checked: true
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.title'),
          checked: true,
          content: (
            <>
              <BlueprintSelection
                form={form}
                updateForm={updateForm}
                blueprintConfigs={blueprintConfigs}
                createBlueprintForm={createBlueprintForm}
                trackBlueprintChange={newBlueprint =>
                  applicationsAlertingBlueprintChanged({ newBlueprint, mode: 'advanced' })
                }
              />
              <AlertTypeSwitch
                alertType={alertType}
                renderErrorRate={() => (
                  <ErrorRateInteractiveChart
                    blueprintConfig={blueprintConfig}
                    form={form}
                    timeConfig={timeConfig}
                    onChange={onChange}
                    updateForm={updateForm}
                    onChartViewConfigChange={onChartViewConfigChange}
                    selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                  />
                )}
                renderSlowness={() => (
                  <>
                    <SlownessInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                    <BaselineErrorMessage thresholdResult={thresholdResult} />
                  </>
                )}
                renderLogs={() => (
                  <>
                    <LightCard
                      title={t(
                        'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.logMessageCardTitle'
                      )}
                      withoutPadding
                      darkFrame
                    >
                      <ProvideLogMessage
                        form={form}
                        timeConfig={{
                          windowSize: alertingDialogItemPickerTimeframe
                        }}
                        updateForm={updateForm}
                        onSelectLogMessage={setSliderState}
                        mode="Advanced"
                      />
                    </LightCard>
                    <LogsInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
                renderStatusCode={() => (
                  <>
                    <LightCard
                      title={t(
                        'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.httpStatusCodesCardTitle'
                      )}
                      withoutPadding
                      darkFrame
                    >
                      <ProvideStatusCode form={form} updateForm={updateForm} mode="Advanced" />
                    </LightCard>
                    <StatusCodeInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                    />
                  </>
                )}
                renderThroughput={() => (
                  <>
                    <ThroughputInteractiveChart
                      blueprintConfig={blueprintConfig}
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      updateForm={updateForm}
                      onChartViewConfigChange={onChartViewConfigChange}
                      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                      editMode={editMode}
                    />
                    <BaselineErrorMessage thresholdResult={thresholdResult} />
                  </>
                )}
              />
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.title'),
          checked: true,
          content: (
            <TimeThresholdConfigPresenter
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
              hasRequestImpactOption
            />
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.alertChannel.title'),
          checked: form.get('alertChannelIds').value.length > 0,
          content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.propertiesOptional.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.propertiesOptional.title'),
          checked: Boolean(form.get('name').value || form.get('description').value),
          content: (
            <AlertPropertiesContainer
              form={form}
              onChange={onChange}
              label={applicationLabel}
              entityIconType="lib_application"
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
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );
}
