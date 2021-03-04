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
} from 'in-applications/alerting/tracker';
import IncludeInternalOrSyntheticCallsSwitch from 'in-applications/alerting/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
import AlertTagFilterExpressionConfig, {
  inPackages
} from 'in-new-components/Alerting/components/AlertTagFilterExpressionConfig';
import TimeThresholdConfigPresenter from 'in-new-components/Alerting/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-new-components/Alerting/advanced/AlertProperties/AlertPropertiesContainer';
import AlertEvaluationControl from 'in-applications/alerting/advanced/EvaluationSwitch/AlertEvaluationControl';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-applications/alerting/form/formUtils';
import StatusCodeInteractiveChart from 'in-applications/alerting/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-applications/alerting/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import GlobalAdvancedModeContainer from 'in-new-components/Alerting/advanced/AdvancedModeContainer';
import ErrorRateInteractiveChart from 'in-applications/alerting/advanced/ErrorRateInteractiveChart';
import SlownessInteractiveChart from 'in-applications/alerting/advanced/SlownessInteractiveChart';
import InboundOutboundCallsSwitch from './InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import BaselineErrorMessage from 'in-new-components/Alerting/components/BaselineErrorMessage';
import AlertLocationFilters from 'in-applications/alerting/components/AlertLocationFilters';
import LogsInteractiveChart from 'in-applications/alerting/advanced/LogsInteractiveChart';
import SelectAlertChannel from 'in-new-components/Alerting/components/SelectAlertChannel';
import { alertingDialogItemPickerTimeframe } from 'in-new-components/Alerting/constants';
import BlueprintSelection from 'in-new-components/Alerting/advanced/BlueprintSelection';
import ProvideLogMessage from 'in-applications/alerting/components/ProvideLogMessage';
import ProvideStatusCode from 'in-applications/alerting/components/ProvideStatusCode';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-applications/alerting/components/AlertTypeSwitch';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
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
          label: t('in-applications:alert.advancedModeContainer.scope.label'),
          title: t('in-applications:alert.advancedModeContainer.scope.title'),
          content: (
            <>
              <AlertEvaluationControl form={form} updateForm={updateForm} />
              <InboundOutboundCallsSwitch form={form} updateForm={updateForm} />
              <IncludeInternalOrSyntheticCallsSwitch form={form} updateForm={updateForm} />
              <WithQB1orQB2
                onUsesQB1={() => (
                  <AlertLocationFilters
                    form={form}
                    applicationLabel={applicationLabel}
                    timeConfig={timeConfig}
                    updateForm={updateForm}
                  />
                )}
                onUsesQB2={() => (
                  <AlertTagFilterExpressionConfig
                    form={form}
                    updateForm={updateForm}
                    label={applicationLabel}
                    inPackage={inPackages.IN_APPLICATIONS}
                    QueryBuilderComponent={QueryBuilderComponent}
                    editMode={editMode}
                  />
                )}
                shouldFallbackToQB2={isQB2Config => isQB2Config(form.get('convertedTagFilterExpression').value)}
              />
            </>
          ),
          checked: true
        },
        {
          scrollId: '2',
          label: t('in-applications:alert.advancedModeContainer.trigger.label'),
          title: t('in-applications:alert.advancedModeContainer.trigger.title'),
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
                      title={t('in-applications:alert.advancedModeContainer.trigger.logMessageCardTitle')}
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
                      title={t('in-applications:alert.advancedModeContainer.trigger.httpStatusCodesCardTitle')}
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
          label: t('in-applications:alert.advancedModeContainer.timeThreshold.label'),
          title: t('in-applications:alert.advancedModeContainer.timeThreshold.title'),
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
          label: t('in-applications:alert.advancedModeContainer.alertChannel.label'),
          title: t('in-applications:alert.advancedModeContainer.alertChannel.title'),
          checked: form.get('alertChannelIds').value.length > 0,
          content: <SelectAlertChannel form={form} onChange={onChange} setAlertChannelsVisible={setSliderState} />
        },
        {
          scrollId: '5',
          label: t('in-applications:alert.advancedModeContainer.propertiesOptional.label'),
          title: t('in-applications:alert.advancedModeContainer.propertiesOptional.title'),
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
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );
}
