/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field, createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import {
  updateActionsAssignedToBuiltInEvent,
  saveCustomEventSpecificationWithActions,
  getCustomEventSpecificationMutable
} from 'in-api/eventSpecifications';
import ConfigureAssociatedActionsDialog from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialog';
import { getAllActions, EventSpecification } from 'in-automation/api';
import { associateActionsTracker } from 'in-events/tracker';
import { close } from 'in-components/DialogPresenter/store';
import { Action } from 'in-types';

export interface ConfigureAssociatedActionsDialogWrapperProps {
  eventSpecification: EventSpecification;
  actions: Action[];
  isCustom: boolean;
  onClose: typeof close;
}

export interface ConfigureAssociatedActionsDialogWrapperState {
  form: MapForm;
  setForm: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogWrapperState['form']>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogWrapperState['isSaving']>>;
  allActions: Action[];
  savingError: boolean;
  setSavingError: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogWrapperState['savingError']>>;
}

export type OnSubmit = () => void;

export default function ConfigureAssociatedActionsDialogWrapper({
  eventSpecification,
  actions,
  isCustom,
  onClose
}: ConfigureAssociatedActionsDialogWrapperProps) {
  const [form, setForm] = useState<ConfigureAssociatedActionsDialogWrapperState['form']>(createForm({ actions }));
  const [savingError, setSavingError] = useState<ConfigureAssociatedActionsDialogWrapperState['savingError']>(false);
  const [isSaving, setIsSaving] = useState<ConfigureAssociatedActionsDialogWrapperState['isSaving']>(false);
  const allActions =
    useObservable<ConfigureAssociatedActionsDialogWrapperState['allActions'], never[]>(getAllActions, []) ?? [];
  const onSubmit: OnSubmit = () => {
    createOrSaveAction({
      form,
      isCustom,
      onClose,
      setIsSaving,
      eventSpecification,
      allActions,
      setSavingError
    });
  };

  return (
    <ConfigureAssociatedActionsDialog
      form={form}
      setForm={setForm}
      onClose={onClose}
      onSubmit={onSubmit}
      savingError={savingError}
      isSaving={isSaving}
      eventSpecification={eventSpecification}
    />
  );
}

type CreateOrSaveActionParams = Pick<
  ConfigureAssociatedActionsDialogWrapperProps,
  'eventSpecification' | 'isCustom' | 'onClose'
> &
  Pick<ConfigureAssociatedActionsDialogWrapperState, 'setIsSaving' | 'form' | 'allActions' | 'setSavingError'>;

function createOrSaveAction({
  form,
  isCustom,
  eventSpecification,
  setIsSaving,
  allActions,
  onClose,
  setSavingError
}: CreateOrSaveActionParams) {
  setIsSaving(true);
  //remove existing error messages:

  const actionIds = (form.get('actionIds') as Field<string[]>).value;
  const actions = actionIds.map(id => ({ id }));

  const eventId = eventSpecification.id;
  const eventName = eventSpecification.name;
  const actionNames = allActions.reduce<string[]>(
    (acc, action) => [...acc, ...(actionIds.includes(action.id) ? [action.name] : [])],
    []
  );
  associateActionsTracker({
    eventName,
    actionNames
  });

  const closeAndReload = () => {
    onClose();
    window.location.reload();
  };
  const handleErrors = () => {
    setSavingError(true);
    setIsSaving(false);
  };
  if (isCustom) {
    getCustomEventSpecificationMutable(eventId).once(
      response =>
        saveCustomEventSpecificationWithActions({ ...response, actions: actions as Action[] }).once(
          closeAndReload,
          handleErrors
        ),
      handleErrors
    );
    return;
  }
  updateActionsAssignedToBuiltInEvent(actions, eventId).once(closeAndReload, handleErrors);
}

export function createForm({ actions }: Pick<ConfigureAssociatedActionsDialogWrapperProps, 'actions'>) {
  return createMapForm().put(
    'actionIds',
    createField({
      value: actions.map(action => action.id)
    })
  );
}
