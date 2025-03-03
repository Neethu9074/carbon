/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import {
  CustomPayloadFieldUnion,
  MobileAppAlertRule,
  MobileAppAlertRuleUnion,
  ThresholdType,
  TimeConfig
} from '@instana/types';

//@ts-expect-error ts migartion
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/synthetics/hooks/useIsTagFilterFormModelValid';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import useVerifyCustomPayloadItemsWithTagCatalog from 'in-alerting/smart-alerts/mobileApp/hooks/useVerifyCustomPayloadItemsWithTagCatalog';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import useCalculateThresholdOnBackendSignalEmitter from 'in-alerting/smart-alerts/eum/hooks/useCalculateThresholdOnBackendSignalEmitter';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/mobileApp/hooks/useTagBasedPayloadConfigurator';
//@ts-expect-error
import useThresholdSuggestion from 'in-alerting/smart-alerts/eum/hooks/useThresholdSuggestion';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/mobileApp/dialog/simple/simpleModeSteps';
import AdvancedModeContainer from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/AdvancedModeContainer';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import { MetricName, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { days } from 'in-services/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

interface AlertConfigDialogWithThresholdProps {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  onClose: () => void;
  editMode: boolean;
  startWithSimpleMode: boolean;
  granularity: number;
  timeConfig: TimeConfig;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  setIsSimpleMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FORM_ID = 'smart-alert-editor';
export default function AlertConfigDialogWithThreshold(props: AlertConfigDialogWithThresholdProps) {
  const {
    form,
    updateForm,
    startWithSimpleMode,
    editMode,
    isSaving,
    onCreate,
    onClose,
    messages,
    onChange,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    granularity,
    timeConfig,
    setIsSimpleMode
  } = props;

  useCalculateThresholdOnBackendSignalEmitter(form);

  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);
  useEffect(() => {
    setIsSimpleMode(simpleMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleMode]);
  const alertConfigWithFormModel = form.toJS();
  const { rule, tagFilterExpression, mobileAppId, customPayloadFields, threshold } = alertConfigWithFormModel;

  const validThreshold = (threshold as any)?.warningThreshold ?? (threshold as any)?.criticalThreshold;

  const { metricName, alertType } = rule as MobileAppAlertRuleUnion;
  const thresholdType = validThreshold?.type as ThresholdType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const {
    getTagCatalog,
    QueryBuilder: AlertQueryBuilder,
    isQueryValid
  } = useMemo(
    () =>
      createBoundedAlertQueryBuilder(
        mobileAppId as string | undefined,
        beaconType,
        thresholdType,
        tagSuggestionTimeConfig
      ),
    [mobileAppId, beaconType, thresholdType]
  );

  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isAlertQueryValid);

  const { step, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate,
    onClose,
    onStepChanged: () => {}
  });

  const updateTagFilterExpression = (filteredTagFilterExpression: any) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };
  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as FormModelElement[],
    updateTagFilterExpression
  );

  const isValid = blueprintConfig.isRuleComplete(rule as MobileAppAlertRule) && isTagFilterFormModelValid;

  const [thresholdResult, setThresholdResult] = useState();

  useThresholdSuggestion(form, updateForm, setThresholdResult, createThresholdForm, {
    isValid,
    simpleMode,
    alertConfigWithFormModel,
    blueprintConfig
  });

  const hasCustomPayloadValidDynamicTags = useVerifyCustomPayloadItemsWithTagCatalog(
    beaconType,
    customPayloadFields as CustomPayloadFieldUnion[]
  );

  const footer = simpleMode ? (
    <SimpleDialogFooter
      step={step}
      backOrCancel={backOrCancel}
      stepConfigs={stepConfigs}
      form={form}
      isSaving={isSaving}
      formId={FORM_ID}
      additionalStepCheck={step => {
        return step === 0 ? true : isTagFilterFormModelValid;
      }}
    />
  ) : (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={onClose}
      onCreate={() => onCreate(simpleMode)}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => isTagFilterFormModelValid}
      scrollToFirstFormError={() => triggerScrollToInvalidItem()}
    />
  );

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(beaconType, mobileAppId as string);
  return (
    <AlertConfigDialogPresenter
      editMode={editMode}
      form={form}
      withTrackClose={onClose}
      withTrackCreate={() => onCreate(simpleMode)}
      updateForm={updateForm}
      messages={messages}
      onChange={onChange}
      stepConfigs={stepConfigs}
      //@ts-expect-error
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
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={SimpleModeContainer}
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      granularity={granularity}
      timeConfig={timeConfig}
      isTagFilterFormModelValid={isTagFilterFormModelValid}
    />
  );
}
