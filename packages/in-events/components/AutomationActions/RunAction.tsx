/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import {
  getInterpreterFromFields,
  getScriptFromFields,
  isScript,
  isWebhook,
  SCRIPT_TYPE
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import RunActionContent, { getWebhookFields } from 'in-events/components/AutomationActions/RunActionContent';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { runScriptAction, runWebhookAction } from 'in-api/automation';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { AgentResponse } from 'in-subscription/agentResponse';
import { Action, Event, Result, VolatileId } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { runActionTracker } from 'in-events/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './RunAction.mless';

function useAgentSnapShots({
  action,
  form,
  volatileId,
  setForm
}: {
  action: Action;
  form: MapForm | undefined;
  volatileId: VolatileId;
  setForm: React.Dispatch<React.SetStateAction<MapForm | undefined>>;
}) {
  const timeConfig = useTimeConfig();
  const query =
    action.type === SCRIPT_TYPE ? 'entity.agent.capability:action-script' : 'entity.agent.capability:action-http';
  const agentSnapShots = useObservable(() => getAgentSnapshotsInTimeframe({ timeConfig, query }), [timeConfig]);
  useEffect(() => {
    if (agentSnapShots && !form) {
      setForm(createForm(volatileId, agentSnapShots, action));
    }
  }, [agentSnapShots, form, volatileId, action, setForm]);
  return agentSnapShots;
}

interface RunActionProps {
  volatileId: VolatileId;
  event?: Event;
  action: Action;
  test?: boolean;
}

export default function RunAction({ action, volatileId, event, test }: RunActionProps) {
  const [actionInstanceId, setActionInstanceId] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<MapForm>();
  const agentSnapShots = useAgentSnapShots({ action, form, volatileId, setForm });
  const actionName = action.name;
  const title = error
    ? t('in-events:failedToInitiate', { actionName })
    : actionInstanceId
    ? t('in-events:hasBeenInitiated', { actionName })
    : test
    ? t('in-events:chosenToTest', { actionName })
    : t('in-events:chosenToRun', { actionName });
  return (
    <Dialog
      className={locals.dialog}
      titleIconType={'lib_help_error_error_circle'}
      title={title}
      onClose={close}
      withoutBodyPadding
    >
      <>
        <div className={locals.actionModalPadding}>
          <RunActionContent
            action={action}
            error={error}
            actionInstanceId={actionInstanceId}
            form={form}
            setForm={setForm}
            agentSnapShots={agentSnapShots}
            volatileId={volatileId}
          />
        </div>
        <FormFooter>
          <RunActionFooter
            error={error}
            actionInstanceId={actionInstanceId}
            isSaving={isSaving}
            form={form}
            onSave={() =>
              onSave({
                form,
                setForm,
                setIsSaving,
                action,
                agentSnapShots,
                setError,
                setActionInstanceId,
                event,
                actionName
              })
            }
          />
        </FormFooter>
      </>
    </Dialog>
  );
}

interface OnSaveParams {
  form: MapForm | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm | undefined>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  action: Action;
  agentSnapShots: OUT | null | undefined;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setActionInstanceId: React.Dispatch<React.SetStateAction<string>>;
  event?: Event;
  actionName: string;
}

function onSave({
  form,
  setForm,
  setIsSaving,
  action,
  agentSnapShots,
  setError,
  setActionInstanceId,
  event,
  actionName
}: OnSaveParams) {
  if (!form?.hierarchyValid) {
    setForm(form?.setTouched(true, { recurse: true }));
    return;
  }
  setIsSaving(true);
  runActionTracker({
    actionType: action.type,
    actionName: action.name
  });
  const targetAgent = form?.get('targetAgent') as Field<string>;
  const selectedVolatileId =
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === targetAgent?.value)?.volatileId ?? {};
  const handleActionResponse = (data: [Result<null>, AgentResponse]) => {
    setIsSaving(false);
    // last element of the array is either the timeout error if the agent didn't respond in time, or the agent response (error or in progress)
    // result unknown because we only care about error
    const response: Result<null> | AgentResponse = data[data.length - 1];
    if ('errors' in response) {
      setError(response.errors[0].message);
    } else if ('error' in response && response.error != null) {
      setError(response.error);
    } else {
      setActionInstanceId(response.data.actionInstanceId);
    }
  };

  if (isScript(action.type)) {
    const script = getScriptFromFields(action.fields);
    const interpreter = getInterpreterFromFields(action.fields);
    runScriptAction({ script, volatileId: selectedVolatileId, event, actionName, interpreter }).once(
      handleActionResponse
    );
  } else if (isWebhook(action.type)) {
    const { host, method, body, ignoreCertErrors, header } = getWebhookFields(action);
    runWebhookAction({
      volatileId: selectedVolatileId,
      event,
      actionName: action.name,
      host,
      method,
      body,
      ignoreCertErrors,
      header
    }).once(handleActionResponse);
  }
}
interface RunActionFooterProps {
  error: string;
  actionInstanceId: string;
  isSaving: boolean;
  form: MapForm | undefined;
  onSave: () => void;
}

function RunActionFooter({ error, actionInstanceId, isSaving, form, onSave }: RunActionFooterProps) {
  if (error || actionInstanceId) {
    return (
      <Button kind="primary" onClick={close}>
        {t('in-events:ok')}
      </Button>
    );
  }
  return (
    <>
      <CancelButton isSaving={isSaving} onClick={close} />
      <SaveButton kind="primary" form={form} disabled={!form} isSaving={isSaving} onClick={onSave}>
        {t('in-events:yes')}
      </SaveButton>
    </>
  );
}

const createForm = (volatileId: VolatileId, agentSnapShots: OUT, action: Action) => {
  const defaultValue =
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === volatileId.host_id)?.volatileId
      ?.host_id ?? '';
  return createMapForm()
    .put(
      'targetAgent',
      createField({
        value: defaultValue,
        validator: notBlankValidator
      })
    )
    .put(
      'parameters',
      createMapForm({
        items: action.parameters?.reduce((acc, parameter) => {
          if (parameter.hidden) {
            return acc;
          }
          if (parameter.type === 'vault') {
            const parsedVaultValue: { secretKey?: string; secretPath?: string } = (raw => {
              try {
                return JSON.parse(raw);
              } catch (e) {
                return {};
              }
            })(parameter?.value ?? '{}');
            return {
              ...acc,
              [`${parameter.name}-key`]: createField({
                value: parsedVaultValue?.secretKey ?? '',
                validator: notBlankValidator
              }),
              [`${parameter.name}-path`]: createField({
                value: parsedVaultValue?.secretPath ?? '',
                validator: notBlankValidator
              })
            };
          }
          return {
            ...acc,
            [parameter.name]: createField({
              value: parameter.value ?? '',
              validator: parameter.required ? notBlankValidator : undefined
            })
          };
        }, {})
      })
    );
};
