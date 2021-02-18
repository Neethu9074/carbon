/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { empty } from '@instana/observables';
import React, { useState } from 'react';
import { t } from 'in-i18n';

import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-websites/alerting/tracker';
import { thresholdOrBaselineLoadingSignal$ } from 'in-new-components/Alerting/Chart/AlertingChartWrapper';
import AlertConfigDialogPresenter from 'in-new-components/Alerting/AlertConfigDialogPresenter';
import { updateThresholdInForm } from 'in-new-components/Alerting/dialog/sharedFunctions';
import AdvancedModeContainer from 'in-websites/alerting/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-websites/alerting/simple/SimpleModeContainer';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { modeAdvanced, modeSimple } from 'in-websites/alerting/constants';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import useObservable from 'in-hooks/useObservable';

export default function AlertConfigDialogWithThreshold(props) {
  const { form, updateForm, onClose, onCreate } = props;

  const [simpleMode, setSimpleMode] = useState(!props.editMode);

  const thresholdResult = useObservable(() => {
    thresholdOrBaselineLoadingSignal$.emit(form.get('hiddenFields').get('calculateThresholdOnBackend').value);
    return resolveThresholdRequest(form, simpleMode)
      .filter(resp => resp && !resp.progress.loading)
      .tap(({ data, errors, time }) => {
        updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
      });
  }, [form, simpleMode]);

  return (
    <AlertConfigDialogPresenter
      {...props}
      thresholdResult={thresholdResult}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
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
      withTrackClose={trackingConfig => {
        if (trackingConfig) {
          websitesAlertingCloseDialog(getTrackingObject(form, { step: trackingConfig }));
        } else {
          websitesAlertingCloseDialog(getTrackingObject(form, { mode: modeAdvanced }));
        }
        onClose();
      }}
      trackModeSwitch={(simpleMode, step) => {
        if (simpleMode) {
          websitesAlertingSwitchMode(getTrackingObject(form, { destinationMode: modeAdvanced, step }));
        } else {
          websitesAlertingSwitchMode(getTrackingObject(form, { destinationMode: modeSimple }));
        }
      }}
      withTrackCreate={simpleMode => {
        websitesAlertingAlertCreated(getTrackingObject(form, { mode: simpleMode ? modeSimple : modeAdvanced }));
        onCreate();
      }}
    />
  );
}

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
