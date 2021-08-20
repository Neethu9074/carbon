/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import {
  onStepChanged,
  stepConfigs,
  stepRenderers
} from 'in-alerting/smart-alerts/applications/simple/simpleModeSteps';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeFooter';
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { SimpleDialogFooter } from 'in-alerting/smart-alerts/applications/components/SimpleDialogFooter';
import AdvancedModeContainer from 'in-alerting/smart-alerts/applications/advanced/AdvancedModeContainer';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import FeatureFeedback from 'in-components/FeatureFeedback/FeatureFeedback';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';

export function SmartAlertConfigDialog(props) {
  const { form, isGlobalSmartAlert } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);
  const enrichedTagFilterFormModel = getEnrichedTagFilterFormModel(
    isGlobalSmartAlert,
    alertConfigWithFormModel,
    blueprintConfig
  );

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      enrichedTagFilterFormModel={enrichedTagFilterFormModel}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
    />
  );
}

function getEnrichedTagFilterFormModel(isGlobalSmartAlert, alertConfigWithFormModel, blueprintConfig) {
  let enrichedTagFilterFormModel = [];
  const isAdaptiveBaseline = alertConfigWithFormModel.threshold.type === ADAPTIVE_BASELINE;

  if (adaptiveBaselineEnabled && isAdaptiveBaseline) {
    const { applicationId, serviceId, endpointId } = alertConfigWithFormModel.hiddenFields.chartViewEntitySelection;

    enrichedTagFilterFormModel = getEnhancedTagFilterFormModel(
      alertConfigWithFormModel,
      blueprintConfig,
      applicationId,
      serviceId,
      endpointId
    ).enrichedTagFilterFormModel;
  } else if (!isGlobalSmartAlert) {
    // for the threshold (except adaptive baseline), we don't include the sub-entity filters,
    // because we perform a grouping on the entire scope
    enrichedTagFilterFormModel = getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig)
      .enrichedTagFilterFormModel;
  }

  return enrichedTagFilterFormModel;
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  ...props
}) {
  const {
    isGlobalSmartAlert,
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
  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(alertConfigWithFormModel.tagFilterExpression);
  const isValid = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    isGlobalSmartAlert,
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel
  });

  const { step, setStep, simpleModeStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose,
    onStepChanged
  });

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
      additionalStepCheck={step => (step === 1 ? true : isTagFilterFormModelValid)}
    />
  ) : (
    <AdvancedModeFooter
      form={form}
      onClose={withTrackClose}
      onCreate={withTrackCreate}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => isTagFilterFormModelValid}
    />
  );

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
      featureFeedbackElement={
        <FeatureFeedback
          href={`https://docs.google.com/forms/d/e/1FAIpQLSdJfdTTcWhC_X2LaVK503OuyMuZe2ruSFmMEBqb5rjYuWd_VA/viewform`}
          styles={{
            marginRight: '2rem'
          }}
        />
      }
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
    />
  );
}

function resolveThresholdRequest(
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  fallbackOnError,
  isValid
) {
  const {
    rule: { metricName },
    rule,
    threshold: { operator, seasonality = null, type },
    includeInternal,
    includeSynthetic,
    granularity,
    evaluationType,
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  if (!isValid || !calculateThresholdOnBackend) {
    return empty;
  }

  const getSeasonality = () => {
    if (!blueprintConfig.baselineEnabled) {
      // request static threshold
      return null;
    }
    return fallbackOnError ? DAILY : seasonality;
  };

  const thresholdSuggestionRequest = blueprintConfig.getThresholdSuggestionRequest(metricName);
  return thresholdSuggestionRequest({
    tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel),
    includeInternal,
    includeSynthetic,
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(rule)
    },
    operator,
    seasonality: getSeasonality(),
    evaluationType: type === ADAPTIVE_BASELINE ? null : evaluationType,
    fallbackOnError,
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
    enrichedTagFilterFormModel
  } = config;
  const thresholdResult = useObservable(
    ([simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
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
