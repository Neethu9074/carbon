/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTriggerChanged,
  applicationsAlertingBlueprintChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import ApplicationAlertPropertiesTitleRow from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPropertiesTitleRow';
import GlobalAdvancedModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import ApplicationAlertPreviewHeadline from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPreviewHeadline';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl';
import { AlertPreview } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPreview';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import BlueprintSelection from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/BlueprintSelection';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ErrorRateInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ErrorRateInteractiveChart';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import BaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/BaselineErrorMessage';
import { validateCheckForCustomPayload } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import LogsInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/LogsInteractiveChart';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import ProvideLogMessage from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage';
import ProvideStatusCode from 'in-alerting/smart-alerts/applications/components/ProvideStatusCode';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { alertingDialogItemPickerTimeframe } from 'in-alerting/components/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    applicationLabel,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    editMode,
    isGlobalSmartAlert,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    initialConfiguredApplications = {}
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
              <AlertEvaluationControl form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert} />
              <InboundOutboundCallsSwitch form={form} updateForm={updateForm} />
              <IncludeInternalOrSyntheticCallsSwitch form={form} updateForm={updateForm} />
              <ScopeConfig
                form={form}
                updateForm={updateForm}
                QueryBuilderComponent={QueryBuilderComponent}
                isGlobalSmartAlert={isGlobalSmartAlert}
                editMode={editMode}
                initialConfiguredApplications={initialConfiguredApplications}
              />
            </>
          ),
          checked: formFieldsValid(form, ['applications']),
          valid: true
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.title'),
          checked:
            form.get('threshold').get('type').value === STATIC_THRESHOLD
              ? form.get('threshold').hierarchyTouched
              : true,
          valid: formFieldsValid(form, ['rule', 'threshold']),
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
                isGlobalSmartAlert={isGlobalSmartAlert}
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                form={form}
                onChange={onChange}
                updateForm={updateForm}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                renderErrorRate={props => <ErrorRateInteractiveChart {...props} timeConfig={timeConfig} />}
                renderSlowness={props => (
                  <>
                    <SlownessInteractiveChart {...props} editMode={editMode} timeConfig={timeConfig} />
                  </>
                )}
                renderLogs={props => (
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
                    <LogsInteractiveChart {...props} timeConfig={timeConfig} />
                  </>
                )}
                renderStatusCode={props => (
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
                    <StatusCodeInteractiveChart {...props} editMode={editMode} />
                  </>
                )}
                renderThroughput={props => (
                  <>
                    <ThroughputInteractiveChart {...props} editMode={editMode} timeConfig={timeConfig} />
                  </>
                )}
              />
              {blueprintConfig.baselineEnabled && <BaselineErrorMessage thresholdResult={thresholdResult} />}
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.title'),
          checked: true,
          valid: true,
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
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={7}
            />
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.propertiesOptional.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.propertiesOptional.title'),
          checked: Boolean(form.get('name').value || form.get('description').value),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  getPreviewTitlePlaceholder={getTitlePlaceholder}
                  trackAlertLevelChanged={applicationsAlertingAdditionalPropsAlertLevelChanged}
                  trackDescriptionChanged={applicationsAlertingAdditionalPropsDescriptionChanged}
                  trackTriggerChanged={applicationsAlertingAdditionalPropsTriggerChanged}
                  renderAlertPopertiesTitleRow={() => (
                    <ApplicationAlertPropertiesTitleRow form={form} onChange={onChange} />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <AlertPreview
                  form={form}
                  label={applicationLabel}
                  entityIconType="lib_application"
                  getTitlePlaceholder={noop}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  renderHeadline={() => <ApplicationAlertPreviewHeadline form={form} />}
                />
              )}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title'),
          checked: validateCheckForCustomPayload(form),
          valid: true,
          content: <AlertConfigCustomPayload form={form} setForm={updateForm} />
        }
      ]}
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );
}

function formFieldsValid(form, fieldsToCheck) {
  const fieldInvalid = Object.entries(form?.items ?? {})
    .filter(([field]) => fieldsToCheck?.includes(field))
    .some(([, { hierarchyValid }]) => !hierarchyValid);
  return !fieldInvalid;
}
