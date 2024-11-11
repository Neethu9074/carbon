/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import IncludeInternalOrSyntheticCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/IncludeInternalOrSyntheticCallsSwitch';
import InboundOutboundCallsSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOutboundCallsSwitch';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfigPresenter';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import AlertEvaluationControl from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl';
import {
  fieldTouchedAndInvalid,
  isCustomPayloadValidOrUntouched
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import {
  smartAlertsLogsBlueprintEnabled,
  oneMinuteGranularityForStaticThresholdEnabled
} from 'in-services/featureFlags';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/applications/dialog/advanced/BluePrintSelectionSection';
import { ApplicationAlertPreview } from 'in-alerting/smart-alerts/applications/dialog/advanced/ApplicationAlertPreview';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { blueprintConfigs, getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import { placeholdersByEvaluationType } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import { ThresholdSection } from 'in-alerting/smart-alerts/applications/dialog/advanced/ThresholdSection';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/applications/form/thresholdTypeForm';
import ScopeConfig from 'in-alerting/smart-alerts/applications/scopeConfig/ScopeConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import StepsContainer from 'in-components/StepsContainer';
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
  const triggering = form.get('triggering').value;
  const evaluationType = form.get('evaluationType').value;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const blueprintConfigList =
    smartAlertsLogsBlueprintEnabled || blueprintConfig?.type === 'logs'
      ? blueprintConfigs
      : blueprintConfigs.filter(config => config?.type !== 'logs');

  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const isLogsBlueprint = blueprintConfig.type === 'logs';
  const isStatusCodeBluePrint = blueprintConfig.type === 'statusCode';
  const navItems = [
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
          {blueprintConfig?.baselineEnabled && (
            <LightCard
              title={t(
                'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.staticOrAdaptiveTitle'
              )}
              withoutPadding
              darkFrame
            >
              <StaticOrAdaptiveSwitch
                form={form}
                setForm={updateForm}
                onThresholdTypeChange={onThresholdTypeChange}
                isMultiThreshold
              />
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
      valid: isThresholdSectionValid(),
      content: (
        <>
          <ThresholdSection
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
          {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
          {thresholdType === ADAPTIVE_BASELINE && <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />}
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
          hasTraceImpactOption
          oneMinuteGranularityAllowed={
            thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
          }
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
          numberOfAlertChannelListRows={5}
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
              renderAlertPropertiesTitleRow={() => (
                <AlertPropertiesTitleRow
                  form={form}
                  onChange={onChange}
                  placeholders={placeholdersByEvaluationType[evaluationType]}
                  getTitlePlaceholder={getTitlePlaceholder}
                />
              )}
              shouldDisplayAlertLevelSelection={false}
            />
          )}
          renderAlertPreview={() => (
            <ApplicationAlertPreview
              form={form}
              description={description}
              applicationLabel={applicationLabel}
              evaluationType={evaluationType}
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
        <>
          <GlobalCustomPayloadCard context="APPLICATION" />

          <AlertConfigCustomPayload
            form={form}
            setForm={updateForm}
            TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
            supportDynamicTypes
          />
        </>
      )
    }
  ];

  return <StepsContainer messages={messages} navItems={navItems} />;

  function isThresholdSectionValid() {
    if (fieldTouchedAndInvalid(form.get('threshold'))) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) {
      return false;
    }
    if (!ruleComplete) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0) {
      return false;
    }

    return true;
  }
}
