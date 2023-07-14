/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field, createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import ConfigureAssociatedActionsDialogContent from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogContent';
import { associateActionsTracker, trackAlertActionAssociated } from 'in-automation/tracker';
import { Action, ApplicationAlertConfigWithMetadata } from 'in-types';
import { updateApplicationAlertAssociations } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import { getAllActions } from 'in-automation/api';

export type ConfigureAssociatedActionsDialogProps = {
  eventSpecification: ApplicationAlertConfigWithMetadata;
  actions: Action[];
  onClose: typeof close;
  triggerReload: (n: number) => void;
  reload?: number;
};

export type ConfigureAssociatedActionsDialogState = {
  form: MapForm<any>;
  setForm: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['form']>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['isSaving']>>;
  allActions: Action[];
  savingError: boolean;
  setSavingError: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['savingError']>>;
  // summaryActionIds: string[];
  triggerReload: (n: number) => void;
  reload?: number;
};

export type OnSubmit = () => void;

export default function ConfigureAssociatedActionsAlertsDialog({
  eventSpecification,
  actions,
  onClose,
  triggerReload
}: ConfigureAssociatedActionsDialogProps) {
  const [form, setForm] = useState<ConfigureAssociatedActionsDialogState['form']>(createForm(actions));
  const [savingError, setSavingError] = useState<ConfigureAssociatedActionsDialogState['savingError']>(false);
  const [isSaving, setIsSaving] = useState<ConfigureAssociatedActionsDialogState['isSaving']>(false);
  // const summaryActionIds: string[] = actions.map(action => action.id);
  const allActions =
    useObservable<ConfigureAssociatedActionsDialogState['allActions'], never[]>(getAllActions, []) ?? [];
  const onSubmit: OnSubmit = () => {
    createOrSaveAction({
      form,
      onClose,
      setIsSaving,
      eventSpecification,
      allActions,
      setSavingError,
      // summaryActionIds,
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

type CreateOrSaveActionParams = Pick<ConfigureAssociatedActionsDialogProps, 'eventSpecification' | 'onClose'> &
  Pick<
    ConfigureAssociatedActionsDialogState,
    'setIsSaving' | 'form' | 'allActions' | 'setSavingError' | 'triggerReload'
  >;

function createOrSaveAction({
  form,
  eventSpecification,
  setIsSaving,
  allActions,
  onClose,
  setSavingError,
  // summaryActionIds,
  triggerReload
}: CreateOrSaveActionParams) {
  setIsSaving(true);
  const actionIds = getActionsFromForm(form).value;

  const { id: applicationId, name: eventName } = eventSpecification;
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
    trackAlertActionAssociated(actionIds, applicationId);
    // This helps to reload the actions table
    triggerReload(Math.random());
  };
  const handleErrors = () => {
    setSavingError(true);
    setIsSaving(false);
  };

  updateApplicationAlertAssociations({ actions: actionIds, alertId: applicationId }).once(closeAndReload, handleErrors);
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
