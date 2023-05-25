/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Field, createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';
import { uniq, pull } from 'lodash';

import { useObservable } from '@instana/hooks';
import { createLogger } from '@instana/logger';

import ConfigureAssociatedActionsDialogContent from 'in-automation/ConfigureAssociatedActionsDialog/ConfigureAssociatedActionsDialogContent';
import { Action, ApplicationAlertConfigWithMetadata, ActionAssociation, ActionAssociations } from 'in-types';
import { associateActionsTracker, trackAlertActionAssociated } from 'in-automation/tracker';
import { saveNewAssociation, getAllAssociations } from 'in-automation/api';
import { close } from 'in-components/DialogPresenter/store';
import { getAllActions } from 'in-automation/api';

const logger = createLogger('in-alerting/smart-alerts/applications/dialog/AlertConfigDialogWithThreshold');
export type ConfigureAssociatedActionsDialogProps = {
  eventSpecification: ApplicationAlertConfigWithMetadata;
  actions: Action[];
  onClose: typeof close;
};

type resultType = {
  application_alert: string[];
  custom_events: string[];
  builtin_event_ids: string[];
};

type getAlertsByActionIdsProps = { [key: string]: resultType };

export type ConfigureAssociatedActionsDialogState = {
  form: MapForm<any>;
  setForm: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['form']>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['isSaving']>>;
  allActions: Action[];
  savingError: boolean;
  setSavingError: React.Dispatch<React.SetStateAction<ConfigureAssociatedActionsDialogState['savingError']>>;
  summaryActionIds: string[];
};

export type OnSubmit = () => void;

export default function ConfigureAssociatedActionsAlertsDialog({
  eventSpecification,
  actions,
  onClose
}: ConfigureAssociatedActionsDialogProps) {
  const [form, setForm] = useState<ConfigureAssociatedActionsDialogState['form']>(createForm(actions));
  const [savingError, setSavingError] = useState<ConfigureAssociatedActionsDialogState['savingError']>(false);
  const [isSaving, setIsSaving] = useState<ConfigureAssociatedActionsDialogState['isSaving']>(false);
  const summaryActionIds: string[] = actions.map(action => action.id);
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
      summaryActionIds
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
    'setIsSaving' | 'form' | 'allActions' | 'setSavingError' | 'summaryActionIds'
  >;

function createOrSaveAction({
  form,
  eventSpecification,
  setIsSaving,
  allActions,
  onClose,
  setSavingError,
  summaryActionIds
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

  function getAlertsByActionIds(data: ActionAssociation[], actionIds: string[]) {
    const result: getAlertsByActionIdsProps = {};

    actionIds.forEach((actionId: string) => {
      result[actionId] = {
        builtin_event_ids: [],
        custom_events: [],
        application_alert: []
      };
    });

    data.forEach((item: ActionAssociation) => {
      const action = item.action || {};
      const actionId = action.id;
      const builtinEventId = item.builtin_event_id;
      const customEvent = item.custom_event;
      const applicationAlert = item.application_alert;

      if (actionIds.includes(actionId)) {
        if (builtinEventId) {
          result[actionId].builtin_event_ids.push(builtinEventId);
        }
        if (customEvent) {
          result[actionId].custom_events.push(customEvent.id);
        }
        if (applicationAlert) {
          result[actionId].application_alert.push(applicationAlert.id);
        }
      }
    });

    return result;
  }

  function actionAssociations(
    actionIds: string[],
    alertConfigId: string,
    closeAndReload: () => void,
    handleErrors: () => void
  ) {
    //concat form.actionids and actual associated action ids from alert details
    const concatenatedArray = summaryActionIds.concat(actionIds);
    //returns unique array
    const uniqueArray = [...new Set(concatenatedArray)];
    //get all associations and parse the data format. We need this data to get all associations for action.
    getAllAssociations().once(
      res => {
        const result = getAlertsByActionIds(res, uniqueArray);
        //If we delete the actions by deslecting, we will hget the difference Array
        const differenceArray = summaryActionIds.filter(item => !actionIds.includes(item));

        if (differenceArray.length > 0) {
          differenceArray.forEach(id => {
            //When we delete action association, we have to exclude the app alert id and send new array to api
            const actionAssociation: Omit<ActionAssociations, 'id'> = {
              action_id: id,
              application_alert_ids: pull(result[id].application_alert, alertConfigId),
              builtin_event_ids: result[id].builtin_event_ids,
              custom_event_ids: result[id].custom_events
            };
            saveNewAssociation(actionAssociation).once(
              () => {},

              err => {
                logger.error(`failed to associate actions:  ${err.message}`, err);
                setIsSaving(false);
              }
            );
          });
          trackAlertActionAssociated(differenceArray, alertConfigId);
        }

        //When we add  action association, we have to
        if (actionIds.length > 0) {
          uniq(actionIds).forEach(id => {
            const actionAssociation = {
              action_id: id,
              application_alert_ids: [alertConfigId],
              builtin_event_ids: result[id]?.builtin_event_ids,
              custom_event_ids: result[id]?.custom_events
            };
            saveNewAssociation(actionAssociation).once(
              () => {},

              err => {
                logger.error(`failed to associate actions: ${err.message}`, err);
                setIsSaving(false);
              }
            );
          });
          trackAlertActionAssociated(actionIds, alertConfigId);
        }
        closeAndReload();
        handleErrors();
      },
      err => {
        logger.error(`failed to get associations:  ${err.message}`, err);
      }
    );
  }

  const closeAndReload = () => {
    onClose();
    window.location.reload();
  };
  const handleErrors = () => {
    setSavingError(true);
    setIsSaving(false);
  };
  actionAssociations(actionIds, applicationId, closeAndReload, handleErrors);
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
