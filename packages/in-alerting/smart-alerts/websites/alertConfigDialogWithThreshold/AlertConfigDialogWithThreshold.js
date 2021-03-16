/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { empty } from '@instana/observables';

import {
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode,
  websitesAlertingAlertCreated
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import AdvancedModeContainer from 'in-alerting/smart-alerts/websites/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-alerting/smart-alerts/websites/simple/SimpleModeContainer';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { modeAdvanced, modeSimple } from 'in-alerting/smart-alerts/websites/constants';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function AlertConfigDialogWithThreshold(props) {
  const { form, updateForm, onClose, onCreate } = props;

  const [simpleMode, setSimpleMode] = useState(!props.editMode);

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = props.form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const { enrichedTagFilterFormModel, numeratorFilter } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig,
    null
  );

  const websiteId = alertConfigWithFormModel.websiteId;
  const beaconType = blueprintConfig.getBeaconType(alertConfigWithFormModel.rule.metricName);
  const { QueryBuilder: AlertQueryBuilder, isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType),
    [websiteId, beaconType]
  );
  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);
  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(
    alertConfigWithFormModel.tagFilterExpression,
    isAlertQueryValid
  );

  const isValid = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule) && isTagFilterFormModelValid;

  const thresholdResult = useObservable(
    ([form, simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
        numeratorFilter,
        simpleMode,
        isValid
      )
        .filter(resp => resp && !resp.progress.loading)
        .tap(
          ({ data, errors, time }) =>
            isValid && updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode)
        ),
    [form, simpleMode, isValid]
  );

  return (
    <AlertConfigDialogPresenter
      {...props}
      QueryBuilderComponent={AlertQueryBuilder}
      isQueryValid={isQueryValid}
      thresholdResult={thresholdResult}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      featureFeedbackElement={
        <FeatureFeedback
          href={`https://docs.google.com/forms/d/e/1FAIpQLSdJfdTTcWhC_X2LaVK503OuyMuZe2ruSFmMEBqb5rjYuWd_VA/viewform`}
          text={t('in-alerting:smartAlerts.websites.alertConfigDialogWithThreshold.alertText')}
          labelText={t('in-alerting:smartAlerts.websites.alertConfigDialogWithThreshold.alertLabelText')}
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
      isTagFilterFormModelValid={isTagFilterFormModelValid}
    />
  );
}

function resolveThresholdRequest(
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorFilter,
  fallbackOnError,
  isValid
) {
  const {
    rule: { metricName },
    threshold: { operator, seasonality = null },
    granularity
  } = alertConfigWithFormModel;

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
    tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel),
    metric: {
      metric: blueprintConfig.getMetricName(alertConfigWithFormModel.rule),
      granularity,
      numeratorFilter,
      aggregation: blueprintConfig.getAggregation(alertConfigWithFormModel.rule)
    },
    operator,
    seasonality: getSeasonality(),
    fallbackOnError
  });
}

function useCalculateThresholdOnBackendSignalEmitter(form) {
  const calculateThresholdOnBackend = form.get('hiddenFields').get('calculateThresholdOnBackend').value;

  useEffect(() => {
    thresholdOrBaselineLoadingSignal$.emit(calculateThresholdOnBackend);
  }, [calculateThresholdOnBackend]);
}

function useIsTagFilterFormModelValid(tagFilterFormModel, isAlertQueryValid) {
  const timeConfig = useTimeConfig();
  const result = useObservable(args => isAlertQueryValid(args), [tagFilterFormModel, timeConfig]) ?? pendingResult;
  return !!result?.data;
}
