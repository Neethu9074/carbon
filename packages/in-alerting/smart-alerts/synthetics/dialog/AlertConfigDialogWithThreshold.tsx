/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { stepConfigs, stepRenderers } from 'in-alerting/smart-alerts/synthetics/dialog/simple/simpleModeSteps';
import AlertConfigDialogPresenter from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AdvancedModeContainer from 'in-alerting/smart-alerts/synthetics/dialog/advanced/AdvancedModeContainer';
import { AdvancedModeFooter } from 'in-alerting/smart-alerts/components/dialog/advanced/AdvancedModeFooter';
import { triggerScrollToInvalidItem } from 'in-components/StepsContainer/useScrollToFirstInvalidNavItem';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { MessageType } from 'in-components/MessageStack';
import { days } from 'in-services/time';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};
interface AlertConfigDialogWithThresholdProps {
  form: MapForm;
  updateForm: ((form: MapForm, setForm?: (form: MapForm) => void) => void) | ((form: MapForm) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  onClose: () => void;
  editMode: boolean;
  startWithSimpleMode: boolean;
  onCreate: () => void;
  isSaving: boolean;
  messages: MessageType[];
}

export default function AlertConfigDialogWithThreshold(props: AlertConfigDialogWithThresholdProps) {
  return <SmartAlertConfigDialogWithQueryValidation {...props} />;
}

const FORM_ID = 'smart-alert-editor';

function SmartAlertConfigDialogWithQueryValidation({ ...props }: AlertConfigDialogWithThresholdProps) {
  const { form, updateForm, startWithSimpleMode, editMode, isSaving, onCreate, onClose, messages, onChange } = props;
  const [simpleMode, setSimpleMode] = useState(startWithSimpleMode);
  const { QueryBuilder: AlertQueryBuilder } = useMemo(
    () => createBoundedAlertQueryBuilder(tagSuggestionTimeConfig),
    []
  );
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
      onCreate={onCreate}
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
      withTrackCreate={onCreate}
      updateForm={updateForm}
      messages={messages}
      onChange={onChange}
      stepConfigs={stepConfigs}
      //@ts-expect-error needs adaption in SimpleModeContainerProps
      stepRenderers={stepRenderers}
      step={step}
      formId={FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      thresholdResult={{}}
      TagBasedPayloadConfigurator={null}
      isDynamicCustomPayloadValid
      QueryBuilderComponent={AlertQueryBuilder}
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      isTagFilterFormModelValid
    />
  );
}
