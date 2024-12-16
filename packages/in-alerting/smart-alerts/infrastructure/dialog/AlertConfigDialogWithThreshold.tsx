/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { InfraAlertRuleUnion, TagCatalog, TimeConfig } from '@instana/types';

import {
  StepConfig,
  useSimpleModePageNavigation
} from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/infrastructure/hooks/useTagBasedPayloadConfigurator';
import { CreateBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import AdvancedModeContainer from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AdvancedModeContainer';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import useThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/hooks/useThresholdSuggestion';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
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
  timeConfig: TimeConfig;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  setIsSimpleMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FORM_ID = 'smart-alert-editor';
const stepConfigs: StepConfig[] = [];
const stepRenderers = [
  () => {
    return <></>;
  }
];

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
    timeConfig,
    setIsSimpleMode,
    onChartViewConfigChange,
    selectedChartViewConfigIndex
  } = props;

  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);
  const [tagFilterValid, setTagFilterValid] = useState(true);
  useEffect(() => {
    setIsSimpleMode(simpleMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleMode]);

  const alertConfigWithFormModel = form.toJS();
  const { rule, tagFilterExpression } = alertConfigWithFormModel;
  const { metricName, entityType, regex } = rule as InfraAlertRuleUnion;

  const tagCatalog = useTagCatalog({
    ownerType: entityType,
    metric: metricName,
    regex: regex
  });

  const { getTagCatalog } = useMemo(() => CreateBoundedAlertQueryBuilder(tagCatalog as TagCatalog), [tagCatalog]);

  const updateTagFilterExpression = (filteredTagFilterExpression: any) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  const isMetricAndEntityValid = metricName != '' || entityType != '';

  const { step, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate,
    onClose,
    onStepChanged: () => {}
  });

  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as FormModelElement[],
    updateTagFilterExpression
  );

  const isValid = isMetricAndEntityValid && tagFilterValid;

  const [thresholdResult, setThresholdResult] = useState();

  useThresholdSuggestion(form, updateForm, setThresholdResult, editMode, {
    isValid,
    alertConfigWithFormModel
  });

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator({ metricName, entityType, regex });

  const footer = (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={onClose}
      onCreate={() => onCreate(simpleMode)}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => isMetricAndEntityValid && tagFilterValid}
      scrollToFirstFormError={() => triggerScrollToInvalidItem()}
    />
  );
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
      stepRenderers={stepRenderers}
      step={step}
      formId={FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
      isDynamicCustomPayloadValid
      QueryBuilderComponent={() => <></>}
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={SimpleModeContainer}
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      thresholdResult={thresholdResult}
      timeConfig={timeConfig}
      isTagFilterFormModelValid
      setTagFilterValid={setTagFilterValid}
      tagFilterValid={tagFilterValid}
    />
  );
}
