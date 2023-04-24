/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/applications/hooks/useCalculateThresholdOnBackendSignalEmitter';
import useTagBasedApplicationPayloadConfigurator from 'in-alerting/smart-alerts/applications/hooks/useTagBasedApplicationPayloadConfigurator';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/applications/dialog/simple/simpleModeSteps';
import AdvancedModeContainer from 'in-alerting/smart-alerts/applications/dialog/advanced/AdvancedModeContainer';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { useThresholdSuggestion } from 'in-alerting/smart-alerts/applications/hooks/useThresholdSuggestion';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function AlertConfigDialogWithThreshold(props) {
  const { form, isGlobalSmartAlert } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const { enrichedTagFilterFormModel, numeratorTagFilterFormModel } = getEnrichedTagFilterFormModel(
    isGlobalSmartAlert,
    alertConfigWithFormModel,
    blueprintConfig
  );

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      enrichedTagFilterFormModel={enrichedTagFilterFormModel}
      numeratorTagFilterFormModel={numeratorTagFilterFormModel}
    />
  );
}

function getEnrichedTagFilterFormModel(isGlobalSmartAlert, alertConfigWithFormModel, blueprintConfig) {
  const isAdaptiveBaseline = alertConfigWithFormModel.threshold.type === ADAPTIVE_BASELINE;

  if (isAdaptiveBaseline) {
    const { applicationId, serviceId, endpointId } = alertConfigWithFormModel.hiddenFields.chartViewEntitySelection;

    return getEnhancedTagFilterFormModel(
      alertConfigWithFormModel,
      blueprintConfig,
      applicationId,
      serviceId,
      endpointId
    );
  } else if (!isGlobalSmartAlert) {
    // for the threshold (except adaptive baseline), we don't include the sub-entity filters,
    // because we perform a grouping on the entire scope
    return getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig);
  }

  return [];
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorTagFilterFormModel,
  ...props
}) {
  const {
    isGlobalSmartAlert,
    migrationMode,
    form,
    updateForm,
    startWithSimpleMode,
    editMode,
    withTrackCreate,
    withTrackClose,
    isSaving
  } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression, threshold } = alertConfigWithFormModel;
  const { isQueryValid, getTagCatalog } = useMemo(() => {
    const thresholdType = threshold.type;
    return getQueryBuilderForAlertType(rule.alertType, thresholdType);
  }, [rule.alertType, threshold.type]);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid);

  const updateTagFilterExpression = filteredTagFilterExpression => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  useRemoveInvalidTagsFromFilterExpression(getTagCatalog, tagFilterExpression, updateTagFilterExpression);

  const isValid = blueprintConfig.isRuleComplete(rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    isGlobalSmartAlert,
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorTagFilterFormModel
  });

  const { step, setStep, simpleModeStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose
  });

  const isCalculatingThreshold = useObservable(thresholdOrBaselineLoadingSignal$, []);

  const footer = simpleMode ? (
    <SimpleDialogFooter
      step={step}
      setStep={setStep}
      backOrCancel={backOrCancel}
      simpleModeStep={simpleModeStep}
      stepConfigs={stepConfigs}
      form={form}
      isSaving={isSaving}
      formId={FORM_ID}
      additionalStepCheck={step => (step === 1 ? true : isTagFilterFormModelValid) && !isCalculatingThreshold}
    />
  ) : (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={withTrackClose}
      onCreate={withTrackCreate}
      isSaving={isSaving}
      editMode={editMode}
      migrationMode={migrationMode}
      additionalValidationCheck={() => isTagFilterFormModelValid}
      scrollToFirstFormError={() => triggerScrollToInvalidItem()}
    />
  );

  const boundaryScope = form.get('boundaryScope')?.value || 'ALL';
  const applications = form.get('applications')?.value || {};
  const TagBasedPayloadConfigurator = useTagBasedApplicationPayloadConfigurator(applications, boundaryScope);

  return (
    <AlertConfigDialogPresenter
      {...props}
      stepConfigs={stepConfigs}
      stepRenderers={stepRenderers}
      step={step}
      formId={FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      thresholdResult={thresholdResult}
      TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
    />
  );
}
