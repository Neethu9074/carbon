/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { TagCatalog, TimeConfig } from '@instana/types';

import {
  StepConfig,
  useSimpleModePageNavigation
} from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/logs/hooks/useTagBasedPayoadConfigurator';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import AdvancedModeContainer from 'in-alerting/smart-alerts/logs/dialog/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { getQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
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
  const { tagFilterExpression } = alertConfigWithFormModel;

  const tagCatalog = useTagCatalog('SMART_ALERTS');
  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator();

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  const { getTagCatalog } = useMemo(() => getQueryBuilder(tagCatalog as TagCatalog), [tagCatalog]);

  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as FormModelElement[],
    updateTagFilterExpression
  );

  const { step, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate,
    onClose,
    onStepChanged: () => {}
  });

  const footer = (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={onClose}
      onCreate={() => onCreate(simpleMode)}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => tagFilterValid}
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
      thresholdResult={null}
      timeConfig={timeConfig}
      isTagFilterFormModelValid={tagFilterValid}
      setTagFilterValid={setTagFilterValid}
      tagFilterValid={tagFilterValid}
    />
  );
}
