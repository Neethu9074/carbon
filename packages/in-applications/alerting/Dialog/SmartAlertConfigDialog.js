import React, { useEffect, useState } from 'react';
import { empty } from '@instana/observables';

import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { switchQB1orQB2Helper } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { isAlertQueryValid } from 'in-applications/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import { AND_CONJUNCTION } from 'in-new-components/Alerting/utils/queryUtils';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export function SmartAlertConfigDialog(props) {
  useCalculateThresholdOnBackendSignalEmitter(props.form);
  const alertConfig = props.form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfig.rule.alertType);
  const enrichedTagFilterExpression = getEnhancedTagFilterExpression(alertConfig, blueprintConfig);

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      enrichedTagFilterExpression={enrichedTagFilterExpression}
      alertConfig={alertConfig}
      blueprintConfig={blueprintConfig}
    />
  );
}

function SmartAlertConfigDialogWithQueryValidation({
  alertConfig,
  blueprintConfig,
  enrichedTagFilterExpression,
  ...props
}) {
  const { form, updateForm, editMode } = props;
  const [simpleMode, setSimpleMode] = useState(!editMode);
  const isTagfilterExpressionQueryValidResult = useIsTagfilterExpressionValid(alertConfig.tagFilterExpression);

  const isValid = switchQB1orQB2Helper(
    () => blueprintConfig.isRuleComplete(alertConfig.rule),
    () => !!isTagfilterExpressionQueryValidResult
  );

  const thresholdResult = useObservable(
    ([form, simpleMode, isValid]) =>
      resolveThresholdRequest(alertConfig, blueprintConfig, enrichedTagFilterExpression, simpleMode, isValid)
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

function resolveThresholdRequest(alertConfig, blueprintConfig, enrichedTagFilterExpression, fallbackOnError, isValid) {
  const {
    rule: { metricName },
    threshold: { operator, seasonality = null },
    tagFilters,
    granularity
  } = alertConfig;

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
          blueprintConfig.getEntityTagFilter(alertConfig),
          ...tagFilters,
          ...blueprintConfig.getRuleTagFilters(alertConfig.rule)
        ]
      }),
      () => ({
        tagFilterExpression: toBackendQueryModel(enrichedTagFilterExpression)
      }),
      isQB2Config => isQB2Config(alertConfig.convertedTagFilterExpression)
    ),
    metric: {
      metric: blueprintConfig.getMetricName(alertConfig.rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(alertConfig.rule)
    },
    operator,
    seasonality: getSeasonality(),
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

    const shouldAddNewThresholdData =
      simpleMode || currentThreshold.value == null || currentThreshold.value == '' || data.type === 'historicBaseline';

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
      newForm = newForm.updateIn(['hiddenFields', 'suggestedThresholdValue'], f => f.setValue(data.value));
    }

    updateForm(newForm);
  }
}

function getEnhancedTagFilterExpression(alertConfig, blueprintConfig) {
  const enrichedTagFilterExpression = [blueprintConfig.getEntityTagFilterExpression(alertConfig)];

  if (alertConfig.tagFilterExpression.length > 0) {
    enrichedTagFilterExpression.push(AND_CONJUNCTION, ...alertConfig.tagFilterExpression);
  }

  const ruleTagFilterExpression = blueprintConfig.getRuleTagFilterExpression(alertConfig.rule);
  if (ruleTagFilterExpression.length > 0) {
    enrichedTagFilterExpression.push(AND_CONJUNCTION, ...ruleTagFilterExpression);
  }

  return enrichedTagFilterExpression;
}

function useIsTagfilterExpressionValid(enrichedTagFilterExpression) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(args => isAlertQueryValid(args), [enrichedTagFilterExpression, timeConfig]) ?? pendingResult;
  return !!result?.data;
}

function useCalculateThresholdOnBackendSignalEmitter(form) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}
