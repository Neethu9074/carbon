/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/AdvancedModeContainer';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { stepConfigs } from 'in-alerting/smart-alerts/mobileApp/dialog/simple/simpleModeSteps';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
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
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
}

const FORM_ID = 'smart-alert-editor';
export default function AlertConfigDialogWithThreshold(props: AlertConfigDialogWithThresholdProps) {
  const { form, updateForm, startWithSimpleMode, editMode, isSaving, onCreate, onClose, messages, onChange } = props;

  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);

  const { step, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate,
    onClose,
    onStepChanged: () => {}
  });

  const footer = simpleMode ? (
    <SimpleDialogFooter
      step={step}
      backOrCancel={backOrCancel}
      stepConfigs={stepConfigs}
      form={form}
      isSaving={isSaving}
      formId={FORM_ID}
      additionalStepCheck={() => true}
    />
  ) : (
    <AdvancedModeFooter
      form={form}
      setForm={updateForm}
      onClose={onClose}
      onCreate={() => onCreate(simpleMode)}
      isSaving={isSaving}
      editMode={editMode}
      additionalValidationCheck={() => true}
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
      //@ts-expect-error
      stepRenderers={[() => {}]}
      step={step}
      formId={FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      thresholdResult={{}}
      //@ts-expect-error
      TagBasedPayloadConfigurator={null}
      isDynamicCustomPayloadValid
      AdvancedModeElement={AdvancedModeContainer}
      SimpleModeElement={SimpleModeContainer}
    />
  );
}
