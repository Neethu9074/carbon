/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { TimeConfig } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import AdvancedModeContainer from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AdvancedModeContainer';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
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
    setIsSimpleMode
  } = props;

  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);
  useEffect(() => {
    setIsSimpleMode(simpleMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleMode]);

  const footer = simpleMode ? (
    // Add simpleMode component
    <></>
  ) : (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={onClose}
      onCreate={() => onCreate(simpleMode)}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => false}
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
      //@ts-expect-error
      stepRenderers={{}}
      formId={FORM_ID}
      handleSubmit={() => {}}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      TagBasedPayloadConfigurator={() => <></>}
      isDynamicCustomPayloadValid={false}
      QueryBuilderComponent={() => <></>}
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={SimpleModeContainer}
      timeConfig={timeConfig}
      isTagFilterFormModelValid
    />
  );
}
