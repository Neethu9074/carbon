/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useEffect, useState } from 'react';
import { empty } from '@instana/observables';

import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import { getEnhancedTagFilterFormModel } from 'in-new-components/Alerting/utils/tagfilterEnrichmentUtil';
import useIsTagFilterFormModelValid from 'in-applications/alerting/hooks/useIsTagFilterFormModelValid';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import useObservable from 'in-hooks/useObservable';

export function SmartAlertConfigDialog(props) {
  useCalculateThresholdOnBackendSignalEmitter(props.form);
  const alertConfigWithFormModel = props.form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  // for the threshold, we don't include the sub-entity filters, because we perform a grouping on the entire scope
  const { enrichedTagFilterFormModel } = getEnhancedTagFilterFormModel(alertConfigWithFormModel, blueprintConfig, null);

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
  const { form, updateForm, editMode } = props;
  const [simpleMode, setSimpleMode] = useState(!editMode);
  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(alertConfigWithFormModel.tagFilterExpression);

  const isValid = switchQB1orQB2Helper(
    () => blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule),
    () => isTagFilterFormModelValid
  );

  const thresholdResult = useObservable(
    ([form, simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
        simpleMode,
        isValid
      )
        .filter(resp => resp && !resp.progress.loading)
        .tap(
          ({ data, errors, time }) => isValid && updateThresholdInForm(form, updateForm, data, errors, time, simpleMode)
        ),
    [form, simpleMode, isValid]
  );

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
    threshold: { operator, seasonality = null },
    tagFilters,
    granularity
  } = alertConfigWithFormModel;

  if (!isValid) {
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
    ...switchQB1orQB2Helper(
      () => ({
        tagFilters: [
          ...blueprintConfig.getEntityTagFilters(alertConfigWithFormModel),
          ...tagFilters,
          ...blueprintConfig.getRuleTagFilters(alertConfigWithFormModel.rule)
        ]
      }),
      () => ({
        tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel)
      }),
      isQB2Config => isQB2Config(alertConfigWithFormModel.convertedTagFilterExpression)
    ),
    metric: {
      metric: blueprintConfig.getMetricName(alertConfigWithFormModel.rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(alertConfigWithFormModel.rule)
    },
    operator,
    seasonality: getSeasonality(),
    evaluationType: alertConfigWithFormModel.evaluationType,
    fallbackOnError
  });
}

function updateThresholdInForm(form, updateForm, data, errors, time, simpleMode) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  if (calculateThresholdOnBackend) {
    thresholdOrBaselineLoadingSignal$.emit(false);

    const alertType = form.get('rule').get('alertType').value;
    const currentThreshold = form.get('threshold').toJS();

    let thresholdData;
    if (errors.length === 0) {
      thresholdData = {
        ...currentThreshold,
        ...data
      };
    } else {
      // set empty baseline in case of error
      thresholdData = {
        ...currentThreshold,
        baseline: []
      };
    }

    const shouldAddNewThresholdData = simpleMode || currentThreshold.value == null || data.type === 'historicBaseline';

    const updatedThresholdForm = createThresholdForm(
      {
        lastUpdated: time,
        ...(shouldAddNewThresholdData ? thresholdData : currentThreshold)
      },
      alertType
    );

    let newForm = form
      .put('threshold', updatedThresholdForm)
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false));

    if (currentThreshold.value !== '') {
      newForm = newForm.updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(data?.value));
    }

    updateForm(newForm);
  }
}

function useCalculateThresholdOnBackendSignalEmitter(form) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}
