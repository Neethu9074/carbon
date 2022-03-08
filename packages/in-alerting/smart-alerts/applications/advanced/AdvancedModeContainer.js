/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  applicationsAlertingAdditionalPropsAlertLevelChanged,
  applicationsAlertingAdditionalPropsDescriptionChanged,
  applicationsAlertingAdditionalPropsTriggerChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import ApplicationAlertPropertiesTitleRow from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPropertiesTitleRow';
import GlobalAdvancedModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/AdaptiveBaselineErrorMessage';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import ApplicationAlertPreviewHeadline from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPreviewHeadline';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl';
import { AlertPreview } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPreview';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ErrorRateInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ErrorRateInteractiveChart';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/applications/advanced/BluePrintSelectionSection';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import { validateCheckForCustomPayload } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import LogsInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/LogsInteractiveChart';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';
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
  const thresholdType = form.get('threshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || blueprintConfig?.type === 'logs'
      ? blueprintConfigs
      : blueprintConfigs.filter(config => config?.type !== 'logs');

  const isLogsBlueprint = blueprintConfig.type === 'logs';
  const isStatusCodeBluePrint = blueprintConfig.type === 'statusCode';

  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
          valid:
            (!isLogsBlueprint || !(form.get('rule')?.get('message')?.valid === false)) &&
            (!isStatusCodeBluePrint || !(form.get('rule')?.get('statusCode')?.hierarchyValid === false)),
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.title'),
          content: (
            <>
              <BluePrintSelectionSection
                alertType={alertType}
                blueprintConfigList={blueprintConfigList}
                form={form}
                updateForm={updateForm}
                setSliderState={setSliderState}
              />
              {adaptiveBaselineEnabled && blueprintConfig?.baselineEnabled && (
                <LightCard
                  title={t(
                    'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.staticOrAdaptiveTitle'
                  )}
                  withoutPadding
                  darkFrame
                >
                  <StaticOrAdaptiveSwitch form={form} setForm={updateForm} />
                </LightCard>
              )}
            </>
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.scope.title'),
          checked: formFieldsValid(form, ['applications']),
          valid: formFieldsValid(form, ['applications']) && isTagFilterFormModelValid,
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
                thresholdType={thresholdType}
              />
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.title'),
          content: (
            <>
              <AlertTypeSwitch
                isGlobalSmartAlert={isGlobalSmartAlert}
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                form={form}
                onChange={onChange}
                updateForm={updateForm}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                editMode={editMode}
                renderErrorRate={props => <ErrorRateInteractiveChart {...props} timeConfig={timeConfig} />}
                renderSlowness={props => <SlownessInteractiveChart {...props} timeConfig={timeConfig} />}
                renderLogs={props => <LogsInteractiveChart {...props} timeConfig={timeConfig} />}
                renderStatusCode={props => <StatusCodeInteractiveChart {...props} />}
                renderThroughput={props => <ThroughputInteractiveChart {...props} timeConfig={timeConfig} />}
              />
              {thresholdType === HISTORIC_BASELINE && (
                <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />
              )}
              {thresholdType === ADAPTIVE_BASELINE && (
                <AdaptiveBaselineErrorMessage adaptiveBaselineSuggestionResponse={thresholdResult?.data} />
              )}
            </>
          ),
          checked: thresholdType === STATIC_THRESHOLD ? form.get('threshold').hierarchyTouched : true,
          valid:
            formFieldsValid(form, ['rule', 'threshold']) ||
            // when the rule definition is incomplete, we do not show a preview chart and
            // the threshold is _per se invalid_ , so
            // we ignore this fact, to avoid an invalid step,
            // to be more clear to the user
            !blueprintConfig.isRuleComplete(form.get('rule').toJS()) ||
            // when incomplete baseline data exist, we ignore this, because the user can save it anyway
            (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0) ||
            (thresholdType === ADAPTIVE_BASELINE && thresholdResult?.data?.message)
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.title'),
          checked: true,
          valid: !(form.get('timeThreshold')?.get('requests')?.valid === false),
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
          scrollId: '5',
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
          scrollId: '6',
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
          scrollId: '7',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title'),
          checked: validateCheckForCustomPayload(form),
          valid: isCustomPayloadValidOrUntouched(form),
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

function fieldTouchedAndInvalid(field) {
  return field && field.touched && !field.valid;
}

function payloadItemInvalid(item) {
  const key = item.get('key');
  const val = item.get('value');
  return fieldTouchedAndInvalid(key) || fieldTouchedAndInvalid(val);
}

function isCustomPayloadValidOrUntouched(form) {
  const customPayloadForm = form.get('customPayloadFields');
  const { touched, valid, items } = customPayloadForm;
  if (!touched) return true;
  if (!valid) return false; // valid as long as all keys are unique

  return !items.find(item => payloadItemInvalid(item));
}
