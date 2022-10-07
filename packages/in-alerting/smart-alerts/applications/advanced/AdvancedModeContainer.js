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
import AdvancedModeStepsContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeStepsContainer';
import ApplicationAlertPropertiesTitleRow from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPropertiesTitleRow';
import {
  fieldTouchedAndInvalid,
  isCustomPayloadValidOrUntouched
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/AdaptiveBaselineErrorMessage';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/applications/advanced/BluePrintSelectionSection';
import { ApplicationAlertPreview } from 'in-alerting/smart-alerts/applications/advanced/ApplicationAlertPreview';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { smartAlertsLogsBlueprintEnabled, adaptiveBaselineEnabled } from 'in-services/featureFlags';
import { ThresholdSection } from 'in-alerting/smart-alerts/applications/advanced/ThresholdSection';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    form,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    thresholdResult,
    messages,
    editMode,
    migrationMode,
    scopeMigrationDetails,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    applicationLabel,
    isGlobalSmartAlert,
    TagBasedPayloadConfigurator,
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

  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(form.toJS());

  const isLogsBlueprint = blueprintConfig.type === 'logs';
  const isStatusCodeBluePrint = blueprintConfig.type === 'statusCode';

  return (
    <AdvancedModeStepsContainer
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
          valid: form.get('applications')?.valid && isTagFilterFormModelValid,
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
                migrationMode={migrationMode}
                scopeMigrationDetails={scopeMigrationDetails}
                initialConfiguredApplications={initialConfiguredApplications}
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
            !ruleComplete ||
            // when incomplete baseline data exist, we ignore this, because the user can save it anyway
            (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0) ||
            (thresholdType === ADAPTIVE_BASELINE && thresholdResult?.data?.message),
          content: (
            <>
              <ThresholdSection
                alertConfigWithFormModel={alertConfigWithFormModel}
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                editMode={editMode}
                form={form}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                updateForm={updateForm}
                ruleComplete={ruleComplete}
                isGlobalSmartAlert={isGlobalSmartAlert}
              />
              {thresholdType === HISTORIC_BASELINE && (
                <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />
              )}
              {thresholdType === ADAPTIVE_BASELINE && (
                <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />
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
          content: (
            <AlertConfigCustomPayload
              form={form}
              setForm={updateForm}
              TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
              supportDynamicTypes
            />
          )
        }
      ]}
    />
  );
}
