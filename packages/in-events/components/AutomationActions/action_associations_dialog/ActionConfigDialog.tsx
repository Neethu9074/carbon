/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import {
  stepConfigs,
  stepRenderers
} from 'in-events/components/AutomationActions/action_associations_dialog/steps/simpleModeSteps';
import ActionConfigDialogPresenter from 'in-events/components/AutomationActions/action_associations_dialog/ActionConfigDialogPresenter';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/applications/components/useSimpleModePageNavigation';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer';
import { MessageType } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import { SimpleDialogFooter } from 'in-components/BlueprintFormMultistep/SimpleDialogFooter';
import { selectActionsStepSwitch } from 'in-events/tracker';
import { Action } from 'in-types';
import { t } from 'in-i18n';

interface ActionConfigDialogProps {
  actions: Action[];
  withTrackClose: () => void;
  applicationLabel: string;
  withTrackCreate: () => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  messages: MessageType[];
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  isSaving: boolean;
}

export default function ActionConfigDialog(props: ActionConfigDialogProps) {
  return <ActionConfigDialogWithQueryValidation {...props} />;
}

const ACTION_ASSOCIATION_FORM_ID = 'action-association-editor';

function ActionConfigDialogWithQueryValidation(props: ActionConfigDialogProps) {
  const { form, setForm, withTrackCreate, withTrackClose, isSaving } = props;

  const { step, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm,
    onCreate: withTrackCreate,
    onClose: withTrackClose,
    onStepChanged: (oldStep, nextStep) => selectActionsStepSwitch({ oldStep, nextStep })
  });

  const footer = (
    <SimpleDialogFooter
      step={step}
      backOrCancel={backOrCancel}
      stepConfigs={stepConfigs}
      form={form}
      isSaving={isSaving}
      formId={ACTION_ASSOCIATION_FORM_ID}
      customSaveButtonText={t('in-events:saveButton')}
    />
  );

  return (
    <ActionConfigDialogPresenter
      {...props}
      stepConfigs={stepConfigs}
      stepRenderers={stepRenderers}
      step={step}
      formId={ACTION_ASSOCIATION_FORM_ID}
      handleSubmit={handleSubmit}
      footer={footer}
      SimpleModeElement={SimpleModeContainer}
    />
  );
}
