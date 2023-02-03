/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ActionConfigDialogPresenter from 'in-events/components/AutomationActions/action_associations_dialog/ActionConfigDialogPresenter';
import { MessageType, EventProps } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
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
  eventDetails: EventProps;
}

export default function ActionConfigDialog(props: ActionConfigDialogProps) {
  const ACTION_ASSOCIATION_FORM_ID = 'action-association-editor';
  const { form, withTrackCreate, withTrackClose, isSaving } = props;

  const footer = (
    <DialogFooter
      onSecondaryActionClick={withTrackClose}
      secondaryActionText={t('in-events:cancelButton')}
      primaryActionText={t('in-events:saveButton')}
      primaryActionDisabled={isSaving}
      saving={isSaving}
      form={form}
      onPrimaryActionClick={withTrackCreate}
    />
  );

  return (
    <ActionConfigDialogPresenter
      {...props}
      formId={ACTION_ASSOCIATION_FORM_ID}
      handleSubmit={withTrackCreate}
      footer={footer}
    />
  );
}
