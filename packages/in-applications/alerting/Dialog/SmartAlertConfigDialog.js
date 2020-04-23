import { compose, withState } from 'recompose';
import { empty } from 'reactive-observables';
import React from 'react';

import getApplicationMetricsThreshold from 'in-applications/alerting/subscriptions/getApplicationMetricsThreshold';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { getMetricsConfiguration } from 'in-applications/alerting/Dialog/metricConfigurations';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { getLogLevelTagFilters } from 'in-applications/alerting/tagFilterUtils';
import { getFormValueOrDefault } from 'in-applications/alerting/form/formUtils';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

export const SmartAlertConfigDialog = compose(
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
  connectTo(({ form, updateForm, granularity, simpleMode }) => {
    thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);

    return {
      result: resolveThresholdRequest(form, granularity, simpleMode)
        .filter(resp => resp && resp.data && !resp.progress.loading)
        .tap(({ data, time }) => updateThresholdInForm(form, updateForm, data.threshold, time))
    };
  })
)(function AlertConfigDialogPresenterWrapper(props) {
  return <AlertConfigDialogPresenter {...props} />;
});

function resolveThresholdRequest(form, granularity, fallbackOnError) {
  const applicationId = form.get('applicationId').value;
  const boundaryScope = form.get('boundaryScope').value;
  const metricName = form.get('rule').get('metricName').value;
  const tagFilters = form.get('tagFilters').value;

  switch (metricName) {
    case 'errors':
      return getApplicationMetricsThreshold(
        getMetricsConfiguration({
          applicationId,
          boundaryScope,
          tagFilters,
          aggregation: 'MEAN',
          metric: 'errors',
          granularity
        })
      );
    case 'calls': {
      // logs count
      const rule = form.get('rule').toJS();

      if (isBlank(rule.message)) {
        return empty;
      }

      return getApplicationMetricsThreshold(
        getMetricsConfiguration({
          applicationId,
          boundaryScope,
          tagFilters: getLogTagFilters(form),
          aggregation: 'SUM',
          metric: 'calls',
          granularity
        })
      );
    }
    case 'latency': {
      const aggregation = form.get('rule').get('aggregation').value;
      const seasonality = getFormValueOrDefault(form.get('threshold'), 'seasonality');

      return getApplicationMetricsThreshold(
        getMetricsConfiguration({
          applicationId,
          boundaryScope,
          tagFilters,
          aggregation,
          metric: 'latency',
          granularity,
          seasonality: fallbackOnError ? 'DAILY' : seasonality,
          fallbackOnError
        })
      );
    }
    default:
      return empty;
  }
}

function updateThresholdInForm(form, updateForm, thresholdData, time) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
  const alertType = form.get('rule').get('alertType').value;
  if (calculateThresholdOnBackend) {
    thresholdOrBaselineLoadingSignal$.emit(false);

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

function getLogTagFilters(form) {
  const operator = form.get('rule').get('operator').value;
  const message = form.get('rule').get('message').value;
  const level = form.get('rule').get('level').value;

  return [...form.get('tagFilters').toJS(), ...getLogLevelTagFilters(message, operator, level)];
}
