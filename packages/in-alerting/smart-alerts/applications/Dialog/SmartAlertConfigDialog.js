/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState, useMemo } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/applications/hooks/useRemoveInvalidTagsFromFilterExpression';
import useTagBasedApplicationPayloadConfigurator from 'in-alerting/smart-alerts/applications/hooks/useTagBasedApplicationPayloadConfigurator';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeFooter';
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/applications/simple/simpleModeSteps';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import AdvancedModeContainer from 'in-alerting/smart-alerts/applications/advanced/AdvancedModeContainer';
import { isValidChartViewEntitySelection } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { applicationsAlertingStepSwitch } from 'in-alerting/smart-alerts/applications/tracker';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export function SmartAlertConfigDialog(props) {
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
    form,
    updateForm,
    startWithSimpleMode,
    editMode,
    migrationMode,
    withTrackCreate,
    withTrackClose,
    isSaving
  } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression, threshold } = alertConfigWithFormModel;
  const { isQueryValid } = useMemo(() => {
    const thresholdType = threshold.type;
    return getQueryBuilderForAlertType(rule.alertType, thresholdType);
  }, [rule.alertType]);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isQueryValid);

  const updateTagFilterExpression = filteredTagFilterExpression => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };
  const thresholdType = alertConfigWithFormModel.threshold.type;

  useRemoveInvalidTagsFromFilterExpression(rule, thresholdType, tagFilterExpression, updateTagFilterExpression);

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
    onClose: withTrackClose,
    onStepChanged: (oldStep, nextStep) => applicationsAlertingStepSwitch({ oldStep, nextStep })
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

function isValidEntitySelection(alertConfigWithFormModel) {
  const {
    threshold: { type }
  } = alertConfigWithFormModel;

  if (type !== ADAPTIVE_BASELINE) {
    return true;
  }

  const {
    evaluationType,
    hiddenFields: { chartViewEntitySelection }
  } = alertConfigWithFormModel;

  return isValidChartViewEntitySelection(evaluationType, chartViewEntitySelection);
}

function shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel) {
  const {
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  return !isValid || !calculateThresholdOnBackend || !isValidEntitySelection(alertConfigWithFormModel);
}

function resolveThresholdRequest(
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorTagFilterFormModel,
  isSimpleMode,
  isValid
) {
  const {
    rule: { metricName },
    rule,
    threshold: { operator, seasonality = null, type },
    includeInternal,
    includeSynthetic,
    granularity,
    evaluationType
  } = alertConfigWithFormModel;

  if (shouldSkipFetchingThresholdSuggestion(isValid, alertConfigWithFormModel)) {
    return empty;
  }

  const getSeasonality = () => {
    if (!blueprintConfig.baselineEnabled) {
      // request static threshold
      return null;
    }
    // In simple mode, user does not have a choice to change threshold type, so we set it to HISTORIC_BASELINE for
    // blueprint where baseline is enabled and here we need to select DAILY seasonality as default!
    return isSimpleMode ? DAILY : seasonality;
  };

  const thresholdSuggestionRequest = blueprintConfig.getThresholdSuggestionRequest(metricName);

  return thresholdSuggestionRequest({
    tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel),
    includeInternal,
    includeSynthetic,
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(rule),
      numeratorTagFilterExpression: toBackendQueryModel(numeratorTagFilterFormModel)
    },
    operator,
    seasonality: getSeasonality(),
    evaluationType: type === ADAPTIVE_BASELINE ? null : evaluationType,
    fallbackOnError: isSimpleMode,
    type
  });
}

function useCalculateThresholdOnBackendSignalEmitter(form) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}

function useThresholdSuggestion(form, updateForm, setThresholdResult, config) {
  const {
    isGlobalSmartAlert,
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorTagFilterFormModel
  } = config;
  const thresholdResult = useObservable(
    ([simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
        numeratorTagFilterFormModel,
        simpleMode,
        isValid
      ),
    [simpleMode, isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors, time } = thresholdResult;

    const isAdaptiveBaseline = alertConfigWithFormModel.threshold.type === ADAPTIVE_BASELINE;

    if ((!isGlobalSmartAlert || isAdaptiveBaseline) && isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }

    if (isGlobalSmartAlert && !isAdaptiveBaseline) {
      updateForm(form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}
