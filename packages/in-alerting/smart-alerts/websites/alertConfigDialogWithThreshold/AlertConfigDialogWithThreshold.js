/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import {
  websitesAlertingAlertCreated,
  websitesAlertingCloseDialog,
  websitesAlertingSwitchMode
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { updateThresholdInForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import WebsitesSimpleModeContainer from 'in-alerting/smart-alerts/websites/simple/WebsitesSimpleModeContainer';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import AdvancedModeContainer from 'in-alerting/smart-alerts/websites/advanced/AdvancedModeContainer';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { modeAdvanced, modeSimple } from 'in-alerting/smart-alerts/websites/constants';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { days } from 'in-services/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1)
};

export default function AlertConfigDialogWithThreshold(props) {
  const { form, updateForm, onClose, onCreate, startWithSimpleMode } = props;

  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const { enrichedTagFilterFormModel, numeratorFilter } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig,
    null
  );

  const websiteId = alertConfigWithFormModel.websiteId;
  const beaconType = blueprintConfig.getBeaconType(alertConfigWithFormModel.rule.metricName);
  const { QueryBuilder: AlertQueryBuilder, isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, tagSuggestionTimeConfig),
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

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, {
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorFilter,
    simpleMode,
    isValid
  });

  return (
    <AlertConfigDialogPresenter
      {...props}
      QueryBuilderComponent={AlertQueryBuilder}
      isQueryValid={isQueryValid}
      thresholdResult={thresholdResult}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      SimpleModeElement={WebsitesSimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      withTrackClose={trackingConfig => {
        if (trackingConfig) {
          websitesAlertingCloseDialog(getTrackingObject(form, { step: trackingConfig }));
        } else {
          websitesAlertingCloseDialog(getTrackingObject(form, { mode: modeAdvanced }));
        }
        onClose({});
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
    rule,
    threshold: { operator, seasonality = null },
    granularity,
    hiddenFields: { calculateThresholdOnBackend }
  } = alertConfigWithFormModel;

  if (!isValid || !calculateThresholdOnBackend) {
    return empty;
  }

  const getSeasonality = () => {
    if (!blueprintConfig.baselineEnabled) {
      // request static threshold
      return null;
    }
    return fallbackOnError ? DAILY : seasonality;
  };

  const thresholdSuggestionRequest = blueprintConfig.getThresholdSuggestionRequest(metricName);
  return thresholdSuggestionRequest({
    tagFilterExpression: toBackendQueryModel(enrichedTagFilterFormModel),
    metric: {
      metric: blueprintConfig.getMetricName(rule),
      granularity,
      numeratorFilter,
      aggregation: blueprintConfig.getAggregation(rule)
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

function useThresholdSuggestion(form, updateForm, setThresholdResult, config) {
  const {
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorFilter,
    simpleMode,
    isValid
  } = config;

  const thresholdResult = useObservable(
    ([simpleMode, isValid]) =>
      resolveThresholdRequest(
        alertConfigWithFormModel,
        blueprintConfig,
        enrichedTagFilterFormModel,
        numeratorFilter,
        simpleMode,
        isValid
      ),
    [simpleMode, isValid, form]
  );

  useEffect(() => {
    if (!thresholdResult || thresholdResult.progress?.loading) return;

    setThresholdResult(thresholdResult);
    const { data, errors, time } = thresholdResult;
    if (isValid) {
      updateThresholdInForm(createThresholdForm, form, updateForm, data, errors, time, simpleMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholdResult, form.get('hiddenFields').get('calculateThresholdOnBackend').value]);
}
