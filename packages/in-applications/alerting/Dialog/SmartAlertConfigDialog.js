import { compose, withState } from 'recompose';
import { empty } from 'reactive-observables';
import React from 'react';

import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import connectTo from 'in-hoc/connectTo';

export const SmartAlertConfigDialog = compose(
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
  connectTo(({ form, updateForm, simpleMode }) => {
    const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);

    return {
      thresholdResult: resolveThresholdRequest(form, simpleMode)
        .filter(resp => resp && !resp.progress.loading)
        .tap(({ data, errors, time }) => updateThresholdInForm(form, updateForm, data, errors, time))
    };
  })
)(function AlertConfigDialogPresenterWrapper(props) {
  return <AlertConfigDialogPresenter {...props} />;
});

function resolveThresholdRequest(form, fallbackOnError) {
  const alertConfig = form.toJS();
  const {
    rule: { alertType, metricName },
    threshold: { operator, seasonality = null },
    tagFilters,
    granularity
  } = alertConfig;

  const blueprintConfig = getBlueprintConfig(alertType);

  if (!blueprintConfig.isRuleComplete(alertConfig.rule)) {
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
    tagFilters: [
      blueprintConfig.getEntityTagFilter(alertConfig),
      ...tagFilters,
      ...blueprintConfig.getRuleTagFilters(alertConfig.rule)
    ],
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

function updateThresholdInForm(form, updateForm, data, errors, time) {
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

    const updatedThresholdForm = createThresholdForm(
      {
        lastUpdated: time,
        ...thresholdData
      },
      alertType
    );

    updateForm(
      form
        .put('threshold', updatedThresholdForm)
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false))
    );
  }
}
