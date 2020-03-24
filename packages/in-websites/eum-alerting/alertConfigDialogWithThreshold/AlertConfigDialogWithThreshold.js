import { compose, withProps } from 'recompose';
import { empty } from 'reactive-observables';
import React from 'react';

import {
  getMetricConfigurationForStatusCode,
  getMetricConfigurationForErrors,
  getMetricsBaselineConfiguration,
  getMetricConfiguration
} from 'in-websites/eum-alerting/alertConfigDialogWithThreshold/MetricsConfigurationFactory';
import {
  errorCount,
  errorRate,
  statusCodeCount,
  statusCodeRate,
  onLoadTime,
  thresholdOrBaselineLoadingSignal$
} from 'in-websites/eum-alerting/constants';
import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-websites/eum-alerting/tracker';
import getWebsiteRateMetricHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteRateMetricHistoricThreshold';
import WebsitesAlertingAdvancedModeContainer from 'in-websites/eum-alerting/advanced/WebsitesAlertingAdvancedModeContainer';
import getWebsiteMetricsHistoricThreshold from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsHistoricThreshold';
import getWebsiteMetricsBaseline from 'in-websites/eum-alerting/subscriptions/getWebsiteMetricsBaseline';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { modeAdvanced, modeSimple } from 'in-websites/eum-alerting/constants';
import { getBlueprintObject } from 'in-websites/eum-alerting/trackingHelpers';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/formHelpers';
import SimpleModeContainer from '../simple/SimpleModeContainer';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export const AlertConfigDialogWithThreshold = compose(
  connectTo(props => {
    const { form, timeConfig, granularity, updateForm } = props;

    const thresholdType = form.get(fieldNames.thresholdType).value;

    thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);

    const observable = {};

    if (thresholdType === 'staticThreshold') {
      observable.result = resolveThresholdRequest(form, timeConfig, granularity)
        .filter(resp => resp && resp.data && !resp.progress.loading)
        .map(resp => resp.data)
        .tap(({ threshold, time }) => addThresholdToForm(form, updateForm, threshold, time));
    } else {
      observable.result = resolveBaselineRequest(form, granularity)
        .filter(resp => resp && resp.data && !resp.progress.loading)
        .map(resp => resp.data)
        .tap(({ baseline, time }) => addBaselineToForm(form, updateForm, baseline || [], time));
    }

    return observable;
  }),
  withProps(({ onClose, onCreate, form }) => ({
    withTrackClose: trackingConfig => {
      if (trackingConfig) {
        websitesAlertingCloseDialog({ step: trackingConfig, ...getBlueprintObject(form) });
      } else {
        websitesAlertingCloseDialog({ mode: modeAdvanced, ...getBlueprintObject(form) });
      }
      onClose();
    },
    trackModeSwitch: (simpleMode, step) => {
      if (simpleMode) {
        websitesAlertingSwitchMode({
          destinationMode: modeAdvanced,
          step,
          ...getBlueprintObject(form)
        });
      } else {
        websitesAlertingSwitchMode({
          destinationMode: modeSimple,
          ...getBlueprintObject(form)
        });
      }
    },
    withTrackCreate: simpleMode => {
      websitesAlertingAlertCreated({ mode: simpleMode ? modeSimple : modeAdvanced });
      onCreate();
    }
  }))
)(function connectedAlertDialog(props) {
  return (
    <AlertConfigDialogPresenter
      {...props}
      simpleModeElement={SimpleModeContainer}
      advancedModeElement={WebsitesAlertingAdvancedModeContainer}
    />
  );
});

function resolveThresholdRequest(form, timeConfig, granularity) {
  const websiteId = form.get(fieldNames.websiteId).value;
  const stringValue = getFormValueOrDefault(form.get('rule'), 'value');
  const operator = getFormValueOrDefault(form.get('rule'), 'operator');
  const tagFilters = form.get(fieldNames.tagFilters).value;
  const metricName = form.get('rule').get('metricName').value;
  const aggregation = getFormValueOrDefault(form.get('rule'), 'aggregation');

  switch (metricName) {
    case errorCount:
      return getWebsiteMetricsHistoricThreshold(
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
      );
    case errorRate:
      return getWebsiteRateMetricHistoricThreshold(
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
      );
    case statusCodeCount:
      return getWebsiteMetricsHistoricThreshold(
        getMetricConfigurationForStatusCode(
          websiteId,
          'SUM',
          statusCodeCount,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      );
    case statusCodeRate:
      return getWebsiteRateMetricHistoricThreshold(
        getMetricConfigurationForStatusCode(
          websiteId,
          'MEAN',
          statusCodeRate,
          stringValue,
          operator,
          tagFilters,
          timeConfig,
          granularity
        )
      );
    case onLoadTime:
      return getWebsiteMetricsHistoricThreshold(
        getMetricConfiguration(websiteId, aggregation, 'onLoadTime', tagFilters, timeConfig, granularity)
      );
    default:
      return empty();
  }
}

function resolveBaselineRequest(form, granularity) {
  const websiteId = form.get(fieldNames.websiteId).value;
  const tagFilters = form.get(fieldNames.tagFilters).value;
  const metricName = form.get('rule').get('metricName').value;
  const aggregation = getFormValueOrDefault(form.get('rule'), 'aggregation');
  const seasonality = getFormValueOrDefault(form, fieldNames.thresholdSeasonality);

  if (metricName === onLoadTime) {
    return getWebsiteMetricsBaseline(
      getMetricsBaselineConfiguration(websiteId, aggregation, tagFilters, granularity, seasonality)
    );
  }
  return alwaysEmptyArray;
}

function addThresholdToForm(form, updateForm, threshold, time) {
  if (form.get('hiddenFields').get('calculateThresholdOnBackend').value) {
    thresholdOrBaselineLoadingSignal$.emit(false);
    updateForm(
      form
        .updateIn([fieldNames.thresholdValue], f => f.setValue(threshold).setTouched(true))
        .updateIn([fieldNames.thresholdLastUpdated], f => f.setValue(time))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false))
    );
  }
}

function addBaselineToForm(form, updateForm, baseline, time) {
  if (form.get('hiddenFields').get('calculateThresholdOnBackend').value) {
    thresholdOrBaselineLoadingSignal$.emit(false);
    updateForm(
      form
        .updateIn([fieldNames.thresholdBaseline], f => f.setValue(baseline).setTouched(true))
        .updateIn([fieldNames.thresholdLastUpdated], f => f.setValue(time))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(false))
    );
  }
}
