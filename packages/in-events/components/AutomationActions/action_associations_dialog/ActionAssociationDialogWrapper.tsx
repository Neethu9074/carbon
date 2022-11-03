/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React, { useState } from 'react';
import { uniq } from 'lodash';

import { Error } from '@instana/components/types/util/dataRetrieval';
import { createLogger } from '@instana/logger';
import { useObservable } from '@instana/hooks';

import {
  updateActionsAssignedToBuiltInEvent,
  saveCustomEventSpecificationWithActions,
  getCustomEventSpecificationWithActions
} from 'in-api/eventSpecifications';
import { MessageType, EventProps } from 'in-events/components/AutomationActions/action_associations_dialog/SharedTypes';
import ActionConfigDialog from 'in-events/components/AutomationActions/action_associations_dialog/ActionConfigDialog';
import { addActionForm } from 'in-events/components/AutomationActions/action_associations_dialog/addActionForm';
import { actionsAssociatedToEvent } from 'in-events/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { getAllActions } from 'in-api/automation';
import { Action } from 'in-types';
import { t } from 'in-i18n';

const logger = createLogger(
  'in-events/components/AutomationActions/action_associations_dialog/ActionAssociationDialogWrapper'
);

interface ActionAssociationDialogWrapperProps {
  eventDetails: EventProps;
  actions: Action[];
  isCustom: boolean;
  onClose: () => void;
}

interface CreateOrSaveActionProps {
  eventDetails: EventProps;
  isCustom: boolean;
  onClose: () => void;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<MapForm>>;
  allActions: Action[];
}

export default function ActionAssociationDialogWrapper({
  eventDetails,
  actions,
  isCustom,
  onClose
}: ActionAssociationDialogWrapperProps) {
  const [form, setForm] = useState(addActionForm(actions));
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const allActions = useObservable(getAllActions, []) ?? [];
  const withTrackCreate = () => {
    createOrSaveAction({
      form,
      setForm,
      isCustom,
      onClose,
      setIsSaving,
      setMessages,
      eventDetails,
      allActions
    });
  };

  return (
    <ActionConfigDialog
      applicationLabel={t('in-events:associateActions')}
      form={form}
      setForm={setForm}
      withTrackClose={onClose}
      withTrackCreate={withTrackCreate}
      isSaving={isSaving}
      actions={actions}
      eventDetails={eventDetails}
      messages={messages}
      setMessages={setMessages}
    />
  );
}

function createOrSaveAction({
  form,
  setForm,
  isCustom,
  eventDetails,
  setIsSaving,
  setMessages,
  allActions
}: CreateOrSaveActionProps) {
  setIsSaving(true);
  //remove existing error messages:
  setMessages((prevMessages: MessageType[]) =>
    prevMessages.filter((m: { level?: string }) => m.level && m.level !== 'error')
  );

  const addMessage = (message: MessageType) => {
    setMessages((prevMessages: MessageType[]) => [...prevMessages, message]);
  };

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }

  const actionIds = (form.get('actionIds') as Field<string[]>)?.value ?? [];
  const actions = actionIds.length > 0 ? uniq(actionIds).map((value: string) => ({ id: value })) : [];

  const eventId = eventDetails.id;
  const eventName = eventDetails.name;
  const actionNames = allActions.reduce<string[]>(
    (acc, action) => [...acc, ...(actionIds.includes(action.id) ? [action.name] : [])],
    []
  );
  actionsAssociatedToEvent({
    eventName,
    actionNames
  });

  if (isCustom) {
    getCustomEventSpecificationWithActions(eventId).once(
      (response: any) => {
        if (!response.progress) {
          const eventData: any = response.toJS();
          eventData.actions = actions;
          saveCustomEventSpecificationWithActions(eventData).once(
            () => {
              close();
              window.location.reload();
            },
            (error: Error | { message: string }) => {
              logger.error(`failed to get custom event: ${error.message}`, error);
              addMessage({ level: 'error', message: error.message });
              setIsSaving(false);
            }
          );
        }
      },
      (error: Error | { message: string }) => {
        logger.error(`failed to save custom event: ${error.message}`, error);
        addMessage({ level: 'error', message: error.message });
        setIsSaving(false);
      }
    );
  } else {
    updateActionsAssignedToBuiltInEvent(actions, eventId).once(
      () => {
        close();
        window.location.reload();
      },
      (error: Error | { message: string }) => {
        logger.error(`failed to save built-in event with actions: ${error.message}`, error);
        addMessage({ level: 'error', message: error.message });
        setIsSaving(false);
      }
    );
  }
}
