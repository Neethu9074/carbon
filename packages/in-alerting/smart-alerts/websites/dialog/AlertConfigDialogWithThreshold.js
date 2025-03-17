/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import useVerifyCustomPayloadItemsWithTagCatalog from 'in-alerting/smart-alerts/websites/hooks/useVerifyCustomPayloadItemsWithTagCatalog';
import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/eum/hooks/useCalculateThresholdOnBackendSignalEmitter';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/websites/hooks/useTagBasedPayloadConfigurator';
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/websites/hooks/useIsTagFilterFormModelValid';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/websites/dialog/simple/simpleModeSteps';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import AdvancedModeContainer from 'in-alerting/smart-alerts/websites/dialog/advanced/AdvancedModeContainer';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import useThresholdSuggestion from 'in-alerting/smart-alerts/eum/hooks/useThresholdSuggestion';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
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

  return (
    <SmartAlertConfigDialogWithQueryValidation
      {...props}
      alertConfigWithFormModel={alertConfigWithFormModel}
      blueprintConfig={blueprintConfig}
    />
  );
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({ alertConfigWithFormModel, blueprintConfig, ...props }) {
  const {
    form,
    updateForm,
    startWithSimpleMode,
    editMode,
    withTrackCreate,
    withTrackClose,
    isSaving,
    setIsSimpleMode
  } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);
  useEffect(() => {
    setIsSimpleMode(simpleMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleMode]);

  // we are validating only the user-defined part, not the whole enriched form model here,
  // because only that part can ever be invalid
  const { rule, tagFilterExpression, websiteId, threshold } = alertConfigWithFormModel;
  const { metricName } = rule;
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const validThreshold = threshold?.warningThreshold?.type ? threshold.warningThreshold : threshold?.criticalThreshold;

  const {
    getTagCatalog,
    QueryBuilder: AlertQueryBuilder,
    isQueryValid
  } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, validThreshold?.type, tagSuggestionTimeConfig),
    [websiteId, beaconType, validThreshold?.type]
  );
  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isAlertQueryValid);

  const updateTagFilterExpression = filteredTagFilterExpression => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  useRemoveInvalidTagsFromFilterExpression(getTagCatalog, tagFilterExpression, updateTagFilterExpression);

  const isValid = blueprintConfig.isRuleComplete(rule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();
  useThresholdSuggestion(form, updateForm, setThresholdResult, createThresholdForm, {
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig
  });

  const hasCustomPayloadValidDynamicTags = useVerifyCustomPayloadItemsWithTagCatalog(
    beaconType,
    alertConfigWithFormModel.customPayloadFields
  );

  const { step, setStep, simpleModeStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose
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

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, websiteId);

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
