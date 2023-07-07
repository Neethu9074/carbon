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
import ConfigureAssociatedActionsDialogContent from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogContent';
import { getAllActions, EventSpecification } from 'in-automation/api';
import { Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import { associateActionsTracker } from 'in-automation/tracker';
import { close } from 'in-components/DialogPresenter/store';

export type ConfigureAssociatedActionsDialogProps = {
  eventSpecification: EventSpecification | ApplicationAlertConfigWithMetadata;
  actions: Action[];
  isCustomEvent: boolean;
  onClose: typeof close;
  triggerReload: (n: number) => void;
};

export type ConfigureAssociatedActionsDialogState = {
  form: MapForm<any>;
  setForm: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['form']>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['isSaving']>>;
  allActions: Action[];
  savingError: boolean;
  setSavingError: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['savingError']>>;
  triggerReload: (n: number) => void;
};

export type OnSubmit = () => void;

export default function ConfigureAssociatedActionsDialog({
  eventSpecification,
  actions,
  isCustomEvent,
  onClose,
  triggerReload
}: ConfigureAssociatedActionsDialogProps) {
  const [form, setForm] = useState<ConfigureAssociatedActionsDialogState['form']>(createForm(actions));
  const [savingError, setSavingError] = useState<ConfigureAssociatedActionsDialogState['savingError']>(false);
  const [isSaving, setIsSaving] = useState<ConfigureAssociatedActionsDialogState['isSaving']>(false);
  const allActions =
    useObservable<ConfigureAssociatedActionsDialogState['allActions'], never[]>(getAllActions, []) ?? [];
  const onSubmit: OnSubmit = () => {
    createOrSaveAction({
      form,
      isCustomEvent,
      onClose,
      setIsSaving,
      eventSpecification,
      allActions,
      setSavingError,
      triggerReload
    });
  };

  return (
    <ConfigureAssociatedActionsDialogContent
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
  ConfigureAssociatedActionsDialogProps,
  'eventSpecification' | 'isCustomEvent' | 'onClose'
> &
  Pick<
    ConfigureAssociatedActionsDialogState,
    'setIsSaving' | 'form' | 'allActions' | 'setSavingError' | 'triggerReload'
  >;

function createOrSaveAction({
  form,
  isCustomEvent,
  eventSpecification,
  setIsSaving,
  allActions,
  onClose,
  setSavingError,
  triggerReload
}: CreateOrSaveActionParams) {
  setIsSaving(true);
  const actionIds = getActionsFromForm(form).value;
  const actions = actionIds.map(id => ({ id })) as Action[];

  const { id: eventId, name: eventName } = eventSpecification;
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
    // This helps to reload the actions table
    triggerReload(Math.random());
  };
  const handleErrors = () => {
    setSavingError(true);
    setIsSaving(false);
  };
  if (isCustomEvent) {
    getCustomEventSpecificationMutable(eventId).once(
      response => saveCustomEventSpecificationWithActions({ ...response, actions }).once(closeAndReload, handleErrors),
      handleErrors
    );
    return;
  }
  updateActionsAssignedToBuiltInEvent(actions, eventId).once(closeAndReload, handleErrors);
}

function createForm(actions: ConfigureAssociatedActionsDialogProps['actions']) {
  return createMapForm().put(
    'actionIds',
    createField({
      value: actions.map(action => action.id)
    })
  );
}

export function getActionsFromForm(form: ConfigureAssociatedActionsDialogState['form']) {
  return form.get('actionIds') as Field<string[]>;
}
