import { empty } from 'reactive-observables';
import React from 'react';

import {
  getHistoricThresholdMetricsConfiguration,
  getBaselineMetricsConfiguration
} from 'in-applications/alerting/Dialog/metricConfigurations';
import getApplicationMetricsHistoricThreshold from 'in-applications/alerting/subscriptions/getApplicationMetricsHistoricThreshold';
import getApplicationMetricsBaseline from 'in-applications/alerting/subscriptions/getApplicationMetricsBaseline';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { getLogLevelTagFilters } from 'in-applications/alerting/tagFilterUtils';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ form, updateForm, timeConfig, granularity }) => {
  const thresholdType = form.get('threshold').get('type').value;
  const observable = {};

  thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);

  if (thresholdType === 'staticThreshold') {
    observable.threshold = resolveThresholdRequest({ form, timeConfig, granularity })
      .filter(resp => resp && resp.data && !resp.progress.loading)
      .map(resp => resp.data)
      .tap(({ threshold, time }) => addThresholdToForm({ form, updateForm, threshold, time }));
  } else {
    observable.baseline = resolveBaselineRequest({ form, granularity })
      .filter(resp => resp && resp.data && !resp.progress.loading)
      .map(resp => resp.data)
      .tap(({ baseline, time }) => addBaselineToForm({ form, updateForm, baseline, time }));
  }
  return observable;
})(function AlertConfigDialogPresenterWrapper(props) {
  return <AlertConfigDialogPresenter {...props} />;
});

function resolveThresholdRequest({ form, timeConfig, granularity }) {
  const metricName = form.get('rule').get('metricName').value;
  switch (metricName) {
    case 'errors':
      return getApplicationMetricsHistoricThreshold(
        getHistoricThresholdMetricsConfiguration({
          ...form.toJS(),
          aggregation: 'MEAN',
          metric: 'errors',
          timeConfig,
          granularity
        })
      );
    case 'latency':
      return getApplicationMetricsHistoricThreshold(
        getHistoricThresholdMetricsConfiguration({
          ...form.toJS(),
          ...form.get('rule').toJS(),
          ...form.get('threshold').toJS(),
          metric: 'latency',
          timeConfig,
          granularity
        })
      );
    case 'calls':
      return getApplicationMetricsHistoricThreshold(
        getHistoricThresholdMetricsConfiguration({
          ...form.toJS(),
          aggregation: 'SUM',
          metric: 'calls',
          timeConfig,
          granularity,
          tagFilters: getLogTagFilters(form)
        })
      );
    default:
      return empty;
  }
}

function resolveBaselineRequest({ form, granularity }) {
  const metricName = form.get('rule').get('metricName').value;
  if (metricName === 'latency') {
    return getApplicationMetricsBaseline(
      getBaselineMetricsConfiguration({
        ...form.toJS(),
        ...form.get('rule').toJS(),
        ...form.get('threshold').toJS(),
        granularity
      })
    );
  }
  return alwaysEmptyArray;
}

function addThresholdToForm({ form, updateForm, threshold, time }) {
  if (form.get('hiddenFields').get('calculateThresholdOnBackend').value) {
    thresholdOrBaselineLoadingSignal$.emit(false);
    updateForm(
      form
        .updateIn(['threshold', 'value'], f => f.setValue(threshold).setTouched(true))
        .updateIn(['threshold', 'lastUpdated'], f => f.setValue(time).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false))
    );
  }
}

function addBaselineToForm({ form, updateForm, baseline, time }) {
  if (form.get('hiddenFields').get('calculateThresholdOnBackend').value) {
    thresholdOrBaselineLoadingSignal$.emit(false);
    updateForm(
      form
        .updateIn(['threshold', 'baseline'], f => f.setValue(baseline).setTouched(true))
        .updateIn(['threshold', 'lastUpdated'], f => f.setValue(time).setTouched(true))
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
