import { compose, withProps, withState } from 'recompose';
import { empty } from 'reactive-observables';
import React from 'react';

import {
  getMetricConfigurationForStatusCode,
  getMetricConfigurationForErrors,
  getMetricConfiguration
} from 'in-websites/alerting/alertConfigDialogWithThreshold/MetricsConfigurationFactory';
import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-websites/alerting/tracker';
import { errorCount, errorRate, statusCodeCount, statusCodeRate, onLoadTime } from 'in-websites/alerting/constants';
import getWebsiteRateMetricThreshold from 'in-websites/alerting/subscriptions/getWebsiteRateMetricThreshold';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingBarChartWrapper';
import getWebsiteMetricsThreshold from 'in-websites/alerting/subscriptions/getWebsiteMetricsThreshold';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-websites/alerting/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-websites/alerting/simple/SimpleModeContainer';
import { fieldNames } from 'in-websites/alerting/form/alertDialogFormDefinition';
import { getFormValueOrDefault } from 'in-websites/alerting/form/formUtils';
import { modeAdvanced, modeSimple } from 'in-websites/alerting/constants';
import { getBlueprintObject } from 'in-websites/alerting/trackingHelpers';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import { isBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

export const AlertConfigDialogWithThreshold = compose(
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
  connectTo(({ form, granularity, updateForm, simpleMode }) => {
    thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);

    return {
      result: resolveThresholdRequest(form, granularity, simpleMode)
        .filter(resp => resp && resp.data && !resp.progress.loading)
        .tap(({ data, time }) => updateThresholdInForm(form, updateForm, data.threshold, time))
    };
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
      advancedModeElement={AdvancedModeContainer}
    />
  );
});

function resolveThresholdRequest(form, granularity, fallbackOnError) {
  const websiteId = form.get(fieldNames.websiteId).value;
  const stringValue = getFormValueOrDefault(form.get('rule'), 'value');
  const operator = getFormValueOrDefault(form.get('rule'), 'operator');
  const tagFilters = form.get(fieldNames.tagFilters).value;
  const metricName = form.get('rule').get('metricName').value;

  switch (metricName) {
    case errorCount:
      if (isBlank(stringValue)) {
        return empty;
      }

      return getWebsiteMetricsThreshold(
        getMetricConfigurationForErrors(websiteId, 'SUM', errorCount, stringValue, operator, tagFilters, granularity)
      );
    case errorRate:
      if (isBlank(stringValue)) {
        return empty;
      }

      return getWebsiteRateMetricThreshold(
        getMetricConfigurationForErrors(websiteId, 'MEAN', errorRate, stringValue, operator, tagFilters, granularity)
      );
    case statusCodeCount:
      return getWebsiteMetricsThreshold(
        getMetricConfigurationForStatusCode(
          websiteId,
          'SUM',
          statusCodeCount,
          stringValue,
          operator,
          tagFilters,
          granularity
        )
      );
    case statusCodeRate:
      return getWebsiteRateMetricThreshold(
        getMetricConfigurationForStatusCode(
          websiteId,
          'MEAN',
          statusCodeRate,
          stringValue,
          operator,
          tagFilters,
          granularity
        )
      );
    case onLoadTime: {
      const aggregation = form.get('rule').get('aggregation').value;
      const seasonality = getFormValueOrDefault(form.get('threshold'), 'seasonality');

      return getWebsiteMetricsThreshold(
        getMetricConfiguration(
          websiteId,
          aggregation,
          onLoadTime,
          tagFilters,
          granularity,
          fallbackOnError ? 'DAILY' : seasonality,
          fallbackOnError
        )
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
