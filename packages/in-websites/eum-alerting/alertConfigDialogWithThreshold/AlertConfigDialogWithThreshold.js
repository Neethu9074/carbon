import React from 'react';

import {
  getMetricConfigurationForErrors,
  getMetricConfiguration,
  getMetricsBaselineConfiguration
} from './MetricsConfigurationFactory';
import getWebsiteRateMetricHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetricHistoricThreshold';
import getWebsiteMetricsHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsHistoricThreshold';
import getWebsiteMetricsBaseline from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsBaseline';
import AlertConfigDialogPresenter from 'in-websites/eum-alerting/AlertConfigDialogPresenter';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import { errorCount, errorRate } from 'in-websites/eum-alerting/constants';
import connectTo from 'in-hoc/connectTo';

export const AlertConfigDialogWithThreshold = connectTo(
  props => {
    const { form, timeConfig, granularity, onChange } = props;
    const websiteId = form.get(fieldNames.websiteId).value;
    const stringValue = getFormValueOrDefault(form, fieldNames.ruleValue);
    const operator = getFormValueOrDefault(form, fieldNames.ruleOperator);
    const tagFilters = form.get(fieldNames.tagFilters).value;
    const metricName = form.get(fieldNames.ruleMetricName).value;
    const aggregation = getFormValueOrDefault(form, fieldNames.ruleAggregation);
    const seasonality = getFormValueOrDefault(form, fieldNames.thresholdSeasonality);
    return {
      errorCountThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfigurationForErrors(
          websiteId,
          'SUM',
          errorCount,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === errorCount) {
            addThresholdToForm(form, onChange, threshold);
          }
        }),
      errorRateThreshold: getWebsiteRateMetricHistoricThreshold(
        getMetricConfigurationForErrors(
          websiteId,
          'MEAN',
          errorRate,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => metricName === errorRate && addThresholdToForm(form, onChange, threshold)),
      slownessThreshold: getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration(websiteId, aggregation, 'onLoadTime', tagFilters, timeConfig, granularity)
      )
        .map(resp => resp && resp.data && resp.data.threshold)
        .tap(threshold => {
          if (metricName === 'onLoadTime' && form.get(fieldNames.thresholdType).value === 'staticThreshold') {
            addThresholdToForm(form, onChange, threshold);
          }
        }),
      baseline: getWebsiteMetricsBaseline(
        getMetricsBaselineConfiguration(websiteId, aggregation, tagFilters, granularity, seasonality)
      )
        .filter(resp => resp && !resp.progress.loading)
        .map(resp => (resp && resp.data && resp.data.baseline) || [])
        .tap(baseline => {
          if (metricName === 'onLoadTime' && form.get(fieldNames.thresholdType).value !== 'staticThreshold') {
            addBaselineToForm(form, onChange, baseline);
          }
        })
    };
  },
  function connectedAlertDialog({
    form,
    onChange,
    onClose,
    onCreate,
    timeConfig,
    websiteLabel,
    editMode,
    granularity
  }) {
    return (
      <AlertConfigDialogPresenter
        form={form}
        onChange={onChange}
        onClose={onClose}
        onCreate={onCreate}
        timeConfig={timeConfig}
        websiteLabel={websiteLabel}
        editMode={editMode}
        granularity={granularity}
      />
    );
  }
);

function addThresholdToForm(form, onChange, threshold) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdValue, threshold, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}

function addBaselineToForm(form, onChange, baseline) {
  if (form.get(fieldNames.calculateThresholdOnBackend).value) {
    onChange(form, fieldNames.thresholdBaseline, baseline, {
      name: fieldNames.calculateThresholdOnBackend,
      value: false
    });
  }
}
