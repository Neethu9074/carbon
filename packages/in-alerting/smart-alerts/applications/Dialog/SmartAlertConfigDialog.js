/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import useIsTagFilterFormModelValid from 'in-alerting/smart-alerts/applications/hooks/useIsTagFilterFormModelValid';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import FeatureFeedback from 'in-components/FeatureFeedback/FeatureFeedback';

export function SmartAlertConfigDialog(props) {
  useCalculateThresholdOnBackendSignalEmitter(props.form);
  const alertConfigWithFormModel = props.form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  // for the threshold, we don't include the sub-entity filters, because we perform a grouping on the entire scope
  const { enrichedTagFilterFormModel } = props.isGlobalSmartAlert
    ? {}
    : getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig, null);
  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      enrichedTagFilterFormModel={enrichedTagFilterFormModel}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
    />
  );
}

function SmartAlertConfigDialogWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  ...props
}) {
  const { form, updateForm, editMode, isGlobalSmartAlert } = props;
  const [simpleMode, setSimpleMode] = useState(!editMode && !props.isGlobalSmartAlert);

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

  return (
    <AlertConfigDialogPresenter
      {...props}
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
    threshold: { operator, seasonality = null },
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
    return fallbackOnError ? 'DAILY' : seasonality;
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
    evaluationType,
    fallbackOnError
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

    if (!isGlobalSmartAlert && isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }
    if (isGlobalSmartAlert) {
      thresholdOrBaselineLoadingSignal$.emit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}
