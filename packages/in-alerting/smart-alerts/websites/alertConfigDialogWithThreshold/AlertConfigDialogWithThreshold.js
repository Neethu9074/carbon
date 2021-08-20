/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeFooter';
import { stepConfigs, onStepChanged, stepRenderers } from 'in-alerting/smart-alerts/websites/simple/simpleModeSteps';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { SimpleDialogFooter } from 'in-alerting/smart-alerts/applications/components/SimpleDialogFooter';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import AdvancedModeContainer from 'in-alerting/smart-alerts/websites/advanced/AdvancedModeContainer';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1)
};

export default function AlertConfigDialogWithThreshold(props) {
  const { form } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const { enrichedTagFilterFormModel, numeratorFilter } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig
  );

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      numeratorFilter={numeratorFilter}
      enrichedTagFilterFormModel={enrichedTagFilterFormModel}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
    />
  );
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorFilter,
  ...props
}) {
  const { form, updateForm, startWithSimpleMode, editMode, withTrackCreate, withTrackClose, isSaving } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

  const websiteId = alertConfigWithFormModel.websiteId;
  const beaconType = blueprintConfig.getBeaconType(alertConfigWithFormModel.rule.metricName);
  const { QueryBuilder: AlertQueryBuilder, isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, tagSuggestionTimeConfig),
    [websiteId, beaconType]
  );
  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);
  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(
    alertConfigWithFormModel.tagFilterExpression,
    isAlertQueryValid
  );
  const isValid = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    numeratorFilter,
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
      QueryBuilderComponent={AlertQueryBuilder}
      isQueryValid={isQueryValid}
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
  numeratorFilter,
  fallbackOnError,
  isValid
) {
  const {
    rule: { metricName },
    rule,
    threshold: { operator, seasonality = null },
    granularity,
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
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      numeratorFilter,
      aggregation: blueprintConfig.getAggregation(rule)
    },
    operator,
    seasonality: getSeasonality(),
    fallbackOnError
  });
}

function useCalculateThresholdOnBackendSignalEmitter(form) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}

function useIsTagFilterFormModelValid(tagFilterFormModel, isAlertQueryValid) {
  const timeConfig = useTimeConfig();
  const result = useObservable(args => isAlertQueryValid(args), [tagFilterFormModel, timeConfig]) ?? pendingResult;
  return !!result?.data;
}

function useThresholdSuggestion(form, updateForm, setThresholdResult, config) {
  const {
    numeratorFilter,
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
        numeratorFilter,
        simpleMode,
        isValid
      ),
    [simpleMode, isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors, time } = thresholdResult;
    if (isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}
