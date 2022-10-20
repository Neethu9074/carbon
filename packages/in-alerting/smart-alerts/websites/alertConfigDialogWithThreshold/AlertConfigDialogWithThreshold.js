/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/useCalculateThresholdOnBackendSignalEmitter';
import useVerifyCustomPayloadItemsWithTagCatalog from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/useVerifyCustomPayloadItemsWithTagCatalog';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import useThresholdSuggestion from 'in-alerting/smart-alerts/websites/alertConfigDialogWithThreshold/useThresholdSuggestion';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigDialogPresenter';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-alerting/smart-alerts/applications/hooks/useScrollToFirstInvalidNavItem';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/websites/hooks/useTagBasedPayloadConfigurator';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { getEnhancedTagFilterFormModel } from 'in-alerting/smart-alerts/components/utils/tagfilterEnrichmentUtil';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/websites/simple/simpleModeSteps';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import AdvancedModeContainer from 'in-alerting/smart-alerts/websites/advanced/AdvancedModeContainer';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { websitesAlertingStepSwitch } from 'in-alerting/smart-alerts/websites/tracker';
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
  const { form } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const alertConfigWithFormModel = form.toJS();
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const { enrichedTagFilterFormModel, numeratorTagFilterFormModel } = getEnhancedTagFilterFormModel(
    alertConfigWithFormModel,
    blueprintConfig
  );

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
      enrichedTagFilterFormModel={enrichedTagFilterFormModel}
      numeratorTagFilterFormModel={numeratorTagFilterFormModel}
    />
  );
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({
  alertConfigWithFormModel,
  blueprintConfig,
  enrichedTagFilterFormModel,
  numeratorTagFilterFormModel,
  ...props
}) {
  const { form, updateForm, startWithSimpleMode, editMode, withTrackCreate, withTrackClose, isSaving } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

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
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig,
    enrichedTagFilterFormModel,
    numeratorTagFilterFormModel
  });

  const hasCustomPayloadValidDynamicTags = useVerifyCustomPayloadItemsWithTagCatalog(
    beaconType,
    alertConfigWithFormModel.customPayloadFields
  );

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, websiteId);

  const { step, setStep, simpleModeStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose,
    onStepChanged: (oldStep, nextStep) => websitesAlertingStepSwitch({ oldStep, nextStep })
  });

  const isCalculatingThreshold = useObservable(thresholdOrBaselineLoadingSignal$, []);

  const footer = simpleMode ? (
    <SimpleDialogFooter
      step={step}
      setStep={setStep}
      backOrCancel={backOrCancel}
      simpleModeStep={simpleModeStep}
      stepConfigs={stepConfigs}
      form={form}
      isSaving={isSaving}
      formId={FORM_ID}
      additionalStepCheck={step => (step === 1 ? true : isTagFilterFormModelValid) && !isCalculatingThreshold}
    />
  ) : (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={withTrackClose}
      onCreate={withTrackCreate}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => isTagFilterFormModelValid}
      scrollToFirstFormError={() => triggerScrollToInvalidItem()}
    />
  );

  return (
    <AlertConfigDialogPresenter
      {...props}
      stepConfigs={stepConfigs}
      stepRenderers={stepRenderers}
      step={step}
      formId={FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      thresholdResult={thresholdResult}
      TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
      isDynamicCustomPayloadValid={hasCustomPayloadValidDynamicTags}
      QueryBuilderComponent={AlertQueryBuilder}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
    />
  );
}

function useIsTagFilterFormModelValid(tagFilterFormModel, isAlertQueryValid) {
  const timeConfig = useTimeConfig();
  const result = useObservable(args => isAlertQueryValid(args), [tagFilterFormModel, timeConfig]) ?? pendingResult;
  return !!result?.data;
}
