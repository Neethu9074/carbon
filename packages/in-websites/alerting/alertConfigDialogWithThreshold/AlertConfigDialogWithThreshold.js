/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps, withState } from 'recompose';
import { empty } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-websites/alerting/tracker';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-websites/alerting/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-websites/alerting/simple/SimpleModeContainer';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { modeAdvanced, modeSimple } from 'in-websites/alerting/constants';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import connectTo from 'in-hoc/connectTo';

export const AlertConfigDialogWithThreshold = compose(
  withState('simpleMode', 'setSimpleMode', props => !props.editMode),
  connectTo(({ form, updateForm, simpleMode }) => {
    const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);

    return {
      thresholdResult: resolveThresholdRequest(form, simpleMode)
        .filter(resp => resp && !resp.progress.loading)
        .tap(({ data, errors, time }) => {
          updateThresholdInForm(form, updateForm, data, errors, time);
        })
    };
  }),
  withProps(({ onClose, onCreate, form }) => ({
    withTrackClose: trackingConfig => {
      if (trackingConfig) {
        websitesAlertingCloseDialog(getTrackingObject(form, { step: trackingConfig }));
      } else {
        websitesAlertingCloseDialog(getTrackingObject(form, { mode: modeAdvanced }));
      }
      onClose();
    },
    trackModeSwitch: (simpleMode, step) => {
      if (simpleMode) {
        websitesAlertingSwitchMode(getTrackingObject(form, { destinationMode: modeAdvanced, step }));
      } else {
        websitesAlertingSwitchMode(getTrackingObject(form, { destinationMode: modeSimple }));
      }
    },
    withTrackCreate: simpleMode => {
      websitesAlertingAlertCreated(getTrackingObject(form, { mode: simpleMode ? modeSimple : modeAdvanced }));
      onCreate();
    }
  }))
)(function connectedAlertDialog(props) {
  return (
    <AlertConfigDialogPresenter
      {...props}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      featureFeedbackElement={
        <FeatureFeedback
          href={`https://docs.google.com/forms/d/e/1FAIpQLSdJfdTTcWhC_X2LaVK503OuyMuZe2ruSFmMEBqb5rjYuWd_VA/viewform`}
          text={t('in-websites:alerting.alertConfigDialogWithThreshold.alertText')}
          labelText={t('in-websites:alerting.alertConfigDialogWithThreshold.alertLabelText')}
          styles={{
            marginRight: '2rem'
          }}
        />
      }
    />
  );
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

  const ruleTagFilters = blueprintConfig.getRuleTagFilters(alertConfig.rule);
  let numeratorFilter;
  let enrichedTagFilters;
  if (blueprintConfig.isCustomRateMetric(metricName)) {
    // at the moment, we only support a single numerator filter. All such blueprints have
    // a single rule-specific tag-filter only
    numeratorFilter = ruleTagFilters[0];
    enrichedTagFilters = [...tagFilters, ...blueprintConfig.getEntityTagFilters(alertConfig)];
  } else {
    enrichedTagFilters = [
      ...alertConfig.tagFilters,
      ...blueprintConfig.getEntityTagFilters(alertConfig),
      ...ruleTagFilters
    ];
  }

  const thresholdSuggestionRequest = blueprintConfig.getThresholdSuggestionRequest(metricName);
  return thresholdSuggestionRequest({
    tagFilters: enrichedTagFilters,
    metric: {
      metric: blueprintConfig.getMetricName(alertConfig.rule),
      granularity,
      aggregation: blueprintConfig.getAggregation(alertConfig.rule),
      numeratorFilter
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
