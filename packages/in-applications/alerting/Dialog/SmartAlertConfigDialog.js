import { compose, withState } from 'recompose';
import { empty } from 'reactive-observables';
import React from 'react';

import getApplicationMetricsThreshold from 'in-applications/alerting/subscriptions/getApplicationMetricsThreshold';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import { getLogLevelTagFilters, getStatusCodeTagFilter } from 'in-applications/alerting/tagFilterUtils';
import { getMetricsConfiguration } from 'in-applications/alerting/Dialog/metricConfigurations';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { getFormValueOrDefault } from 'in-applications/alerting/form/formUtils';
import createThresholdForm from 'in-applications/alerting/form/thresholdForm';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

export const SmartAlertConfigDialog = compose(
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
  connectTo(({ form, updateForm, simpleMode }) => {
    thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);

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
  const applicationId = form.get('applicationId').value;
  const boundaryScope = form.get('boundaryScope').value;
  const tagFilters = form.get('tagFilters').value;
  const alertType = form.get('rule').get('alertType').value;
  const granularity = form.get('granularity').value;

  switch (alertType) {
    case 'errorRate':
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
    case 'logs': {
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
    case 'slowness': {
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
    case 'statusCode':
      return getApplicationMetricsThreshold(
        getMetricsConfiguration({
          applicationId,
          boundaryScope,
          aggregation: 'SUM',
          metric: 'calls',
          granularity,
          tagFilters: getStatusTagFilter(form)
        })
      );
    default:
      return empty;
  }
}

function updateThresholdInForm(form, updateForm, data, errors, time) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
  const alertType = form.get('rule').get('alertType').value;
  if (calculateThresholdOnBackend) {
    thresholdOrBaselineLoadingSignal$.emit(false);

    let thresholdData;
    if (errors.length === 0) {
      thresholdData = data.threshold;
    } else {
      const currentThreshold = form.get('threshold').toJS();
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

function getLogTagFilters(form) {
  const operator = form.get('rule').get('operator').value;
  const message = form.get('rule').get('message').value;
  const level = form.get('rule').get('level').value;

  return [...form.get('tagFilters').toJS(), ...getLogLevelTagFilters(message, operator, level)];
}

function getStatusTagFilter(form) {
  const statusCodeStart = form.get('rule').get('statusCodeStart').value;
  const statusCodeEnd = form.get('rule').get('statusCodeEnd').value;

  return [...form.get('tagFilters').toJS(), ...getStatusCodeTagFilter(statusCodeStart, statusCodeEnd)];
}
