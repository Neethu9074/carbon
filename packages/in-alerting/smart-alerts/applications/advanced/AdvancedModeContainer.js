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
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ThroughputInteractiveChart';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ErrorRateInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/ErrorRateInteractiveChart';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/applications/advanced/BluePrintSelectionSection';
import { ApplicationAlertPreview } from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPreview';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/SlownessInteractiveChart';
import LogsInteractiveChart from 'in-alerting/smart-alerts/applications/advanced/LogsInteractiveChart';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import { smartAlertsLogsBlueprintEnabled } from 'in-services/featureFlags';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    messages,
    editMode,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    applicationLabel,
    isGlobalSmartAlert,
    initialConfiguredApplications = {}
  } = props;
  const description = form.get('description').value;
  const severity = Number(form.get('severity').value);
  const triggering = form.get('triggering').value;
  const evaluationType = form.get('evaluationType').value;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
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
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.trigger.title'),
          valid:
            (!isLogsBlueprint || !fieldTouchedAndInvalid(ruleForm?.get('message'))) &&
            // for custom ranges only: we do have direct invalidation feedback on the fields,
            // so only can get invalid after the user has changed it
            (!isStatusCodeBluePrint || !ruleForm?.get('statusCode')?.hierarchyValid === false),
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
          valid: formFieldsValid(form, ['applications']) && isTagFilterFormModelValid,
          content: (
            <>
              <AlertEvaluationControl form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert} />
              <InboundOutboundCallsSwitch form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert} />
              <IncludeInternalOrSyntheticCallsSwitch
                form={form}
                updateForm={updateForm}
                isGlobalSmartAlert={isGlobalSmartAlert}
              />
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
          valid:
            !fieldTouchedAndInvalid(form.get('threshold')?.get('value')) ||
            // when filter is invalid, baseline depends on it, avoid redundant invalidation indicator
            (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) ||
            // when the rule definition is incomplete, we do not show a preview chart and
            // the threshold is _per se invalid_ , so
            // we ignore this fact to avoid an invalid step to be clearer to the user
            !blueprintConfig.isRuleComplete(form.get('rule').toJS()) ||
            // when incomplete baseline data exist, we ignore this, because the user can save it anyway
            (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0) ||
            (thresholdType === ADAPTIVE_BASELINE && thresholdResult?.data?.message),
          content: (
            <>
              <AlertTypeSwitch
                isGlobalSmartAlert={isGlobalSmartAlert}
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                editMode={editMode}
                form={form}
                onChange={onChange}
                updateForm={updateForm}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
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
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.timeThreshold.title'),
          valid: !fieldTouchedAndInvalid(form.get('timeThreshold').get('requests')),
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
                <ApplicationAlertPreview
                  form={form}
                  description={description}
                  applicationLabel={applicationLabel}
                  evaluationType={evaluationType}
                  severity={severity}
                  triggering={triggering}
                />
              )}
            />
          )
        },
        {
          scrollId: '7',
          label: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.label'),
          title: t('in-alerting:smartAlerts.applications.advanced.advancedModeContainer.payloadsOptional.title'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: <AlertConfigCustomPayload form={form} setForm={updateForm} />
        }
      ]}
    />
  );
}

// TODO extract this into own module as part of story https://instana.kanbanize.com/ctrl_board/37/cards/91077
function formFieldsValid(form, fieldsToCheck) {
  const invalid = Object.entries(form?.items ?? {})
    .filter(([fieldName]) => fieldsToCheck?.includes(fieldName))
    .some(([, { hierarchyValid }]) => !hierarchyValid);
  return !invalid;
}

function fieldTouchedAndInvalid(field) {
  return field && field.touched && !field.valid;
}

function payloadItemInvalid(item) {
  const key = item.get('key');
  const val = item.get('value');
  return fieldTouchedAndInvalid(key) || fieldTouchedAndInvalid(val);
}

// TODO extract this into own module as part of story https://instana.kanbanize.com/ctrl_board/37/cards/91077
function isCustomPayloadValidOrUntouched(form) {
  const customPayloadForm = form.get('customPayloadFields');
  const { touched, valid, items } = customPayloadForm;
  if (!touched) return true;
  if (!valid) return false; // valid as long as all keys are unique

  return !items.find(item => payloadItemInvalid(item));
}
