/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createListForm, createMapForm, Field, ListForm, MapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import {
  getInterpreterFromFields,
  getScriptFromFields,
  getWebhookFields,
  isScript,
  isWebhook
} from 'in-automation/ActionCatalog/shared';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { ActionExecutionParameter, runScriptAction, runWebhookAction } from 'in-automation/api';
import RunActionContent from 'in-automation/RunActionDialog/RunActionDialogContent';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { AgentResponse } from 'in-subscription/agentResponse';
import { Action, Event, Result, VolatileId } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { runActionTracker } from 'in-automation/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './RunActionDialog.mless';

interface RunActionDialogProps {
  volatileId: VolatileId;
  event?: Event;
  action: Action;
  test?: boolean;
}

export default function RunActionDialog({ action, volatileId, event, test }: RunActionDialogProps) {
  const [actionInstanceId, setActionInstanceId] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<MapForm<any>>();
  const agentSnapShots = useAgentSnapShots({ action, form, volatileId, setForm });
  return (
    <Dialog
      className={locals.dialog}
      titleIconType={'lib_help_error_error_circle'}
      title={getTitle({ action, error, actionInstanceId, test })}
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
            test={test}
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
                event
              })
            }
          />
        </FormFooter>
      </>
    </Dialog>
  );
}

interface GetTitleParams extends Pick<RunActionDialogProps, 'action' | 'test'> {
  actionInstanceId: string;
  error: string;
}
const getTitle = ({ action, error, actionInstanceId, test }: GetTitleParams) => {
  const actionName = action.name;
  if (error) return t('in-automation:failedToInitiate', { actionName });
  if (actionInstanceId) return t('in-automation:hasBeenInitiated', { actionName });
  if (test) return t('in-automation:chosenToTest', { actionName });
  return t('in-automation:chosenToRun', { actionName });
};

interface UseAgentSnapShotsParams extends Pick<RunActionDialogProps, 'action' | 'volatileId'> {
  form: MapForm<any> | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any> | undefined>>;
}

function useAgentSnapShots({ action, form, volatileId, setForm }: UseAgentSnapShotsParams) {
  const timeConfig = useTimeConfig();
  const query = isScript(action.type) ? 'entity.agent.capability:action-script' : 'entity.agent.capability:action-http';
  const agentSnapShots = useObservable(() => getAgentSnapshotsInTimeframe({ timeConfig, query }), [timeConfig]);
  useEffect(() => {
    if (agentSnapShots && !form) {
      setForm(createForm({ volatileId, agentSnapShots, action }));
    }
  }, [agentSnapShots, form, volatileId, action, setForm]);
  return agentSnapShots;
}

interface OnSaveParams extends Pick<RunActionDialogProps, 'action' | 'event'> {
  form: MapForm<any> | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any> | undefined>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  agentSnapShots: OUT | null | undefined;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setActionInstanceId: React.Dispatch<React.SetStateAction<string>>;
}

function onSave({
  form,
  setForm,
  setIsSaving,
  action,
  agentSnapShots,
  setError,
  setActionInstanceId,
  event
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
  const parameters = form?.get('parameters') as MapForm<any>;

  const inputParameters = parameters.reduce<ActionExecutionParameter[]>((acc, parameter, key) => {
    const parameterDefinition = action.inputParameters?.find(p => key === p.name);
    const name = parameterDefinition?.name ?? '';
    if (parameterDefinition?.type === 'vault') {
      const pathField = (parameter as ListForm<any>).get(0) as Field<string>;
      const keyField = (parameter as ListForm<any>).get(1) as Field<string>;
      return [
        ...acc,
        {
          name,
          type: 'vault',
          value: JSON.stringify({
            secretPath: pathField?.value?.trim() ?? '',
            secretKey: keyField?.value?.trim() ?? ''
          })
        }
      ];
    }
    // WILL NEED TO RESOLVE DYNAMIC PARAMS HERE
    const value = (parameter as Field<string>).value;
    if (value) {
      return [...acc, { name, value: value?.trim() }];
    }
    return acc;
  }, []);
  const hiddenInputParameters = (action.inputParameters ?? []).reduce<ActionExecutionParameter[]>((acc, parameter) => {
    if (parameter.hidden) {
      if (parameter.type === 'vault') {
        const parsedVaultValue: { secretKey?: string; secretPath?: string } = (raw => {
          try {
            return JSON.parse(raw);
          } catch (e) {
            return {};
          }
        })(parameter.value ?? '{}');
        const { secretKey, secretPath } = parsedVaultValue;
        return [
          ...acc,
          {
            name: parameter.name,
            type: 'vault',
            value: JSON.stringify({
              secretPath: secretPath ?? '',
              secretKey: secretKey ?? ''
            })
          }
        ];
      }
      return [...acc, { name: parameter.name, value: parameter.value ?? '' }];
    }
    return acc;
  }, []);
  const selectedVolatileId =
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === targetAgent.value)?.volatileId ?? {};
  const handleActionResponse = (data: [Result<null>, AgentResponse]) => {
    setIsSaving(false);
    // last element of the array is either the timeout error if the agent didn't respond in time, or the agent response (error or in progress)
    // result unknown because we only care about error
    const response = data[data.length - 1];
    if ('errors' in response) {
      setError(response.errors[0].message);
    } else if ('error' in response && response.error != null) {
      setError(response.error);
    } else {
      setActionInstanceId(response.data.actionInstanceId);
    }
  };

  const allInputParameters = [...inputParameters, ...hiddenInputParameters];
  const { id: actionId, name: actionName } = action;
  if (isScript(action.type)) {
    const script = getScriptFromFields(action.fields);
    const interpreter = getInterpreterFromFields(action.fields);
    runScriptAction({
      script,
      volatileId: selectedVolatileId,
      event,
      actionName,
      actionId,
      interpreter,
      inputParameters: allInputParameters
    }).once(handleActionResponse);
  } else if (isWebhook(action.type)) {
    const { host, method, body, ignoreCertErrors, header, authen } = getWebhookFields(action);
    runWebhookAction({
      volatileId: selectedVolatileId,
      event,
      actionName,
      actionId,
      host,
      method,
      body,
      ignoreCertErrors,
      header,
      authen,
      inputParameters: allInputParameters
    }).once(handleActionResponse);
  }
}
interface RunActionFooterProps {
  error: string;
  actionInstanceId: string;
  isSaving: boolean;
  form: MapForm<any> | undefined;
  onSave: () => void;
  test?: boolean;
}

function RunActionFooter({ error, actionInstanceId, isSaving, form, onSave, test }: RunActionFooterProps) {
  if (error || actionInstanceId) {
    return (
      <Button kind="primary" onClick={close}>
        {t('in-automation:ok')}
      </Button>
    );
  }
  return (
    <>
      <CancelButton isSaving={isSaving} onClick={close} />
      <SaveButton kind="primary" form={form} disabled={!form} isSaving={isSaving} onClick={onSave}>
        {test ? t('in-automation:testAction') : t('in-automation:runAction')}
      </SaveButton>
    </>
  );
}

interface CreateFormParams extends Pick<RunActionDialogProps, 'volatileId' | 'action'> {
  agentSnapShots: OUT;
}
function createForm({ volatileId, agentSnapShots, action }: CreateFormParams) {
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
        items: action.inputParameters?.reduce((acc, parameter) => {
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
              [parameter.name]: createListForm({
                items: [
                  createField({
                    value: parsedVaultValue?.secretPath ?? '',
                    validator: parameter.required ? notBlankValidator : undefined
                  }),
                  createField({
                    value: parsedVaultValue?.secretKey ?? '',
                    validator: parameter.required ? notBlankValidator : undefined
                  })
                ],
                validator: listForm => {
                  const hasEmptyFields = listForm.some(field => field.value === '');
                  const hasNonEmptyFields = listForm.some(field => field.value !== '');
                  if (!parameter.required && hasEmptyFields && hasNonEmptyFields) {
                    return [
                      {
                        severity: 'error',
                        message: t('in-automation:ActionCatalog.validVaultParameter')
                      }
                    ];
                  }
                  return null;
                }
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
}
