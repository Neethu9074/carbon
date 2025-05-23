/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createListForm, createMapForm, Field, ListForm, MapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

import { Action, Event, ParameterValue, VolatileId, Policy, AgentSnapshot } from '@instana/types';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import RunActionContent, {
  shouldHideParameter,
  TRIGGERING_AGENT,
  TRIGGERING_HOST_FQDN,
  TRIGGERING_HOST_FQDN_OPTION,
  TRIGGERING_HOST_IP,
  TRIGGERING_HOST_IP_OPTION
} from 'in-automation/RunActionDialog/RunActionDialogContent';
import { getTimeoutFromFields, getAnsibleHostIdFromFields } from 'in-automation/utils/actionField';
import useNavigateToActionHistory from 'in-automation/navigation/hooks/useNavigateToActionHistory';
import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { getGitLinkFromFields, getGitTypeFromFields } from 'in-automation/utils/actionField';
import { setActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import FormFooter, { CancelButton } from 'in-components/form/FormFooter/FormFooter';
import { ActionInstance } from 'in-automation/subscriptions/submitActionExecution';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { ResolvedDynamicParamValue, NewPolicy } from 'in-automation/types';
import { refreshHistory } from 'in-automation/AutomationCard/useHistory';
import { resolveDynamicParameters, runAction } from 'in-automation/api';
import { isAIAction, isAIActionCopy } from 'in-automation/utils/action';
import { isAutomatic, isManual } from 'in-automation/utils/policy';
import { notBlankValidator } from 'in-services/validators/string';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { Option, Options } from 'in-components/ComboBox/ComboBox';
import { hasError, isLoading } from 'in-services/util/result';
import { close } from 'in-components/DialogPresenter/store';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { safeParseJSON } from 'in-automation/utils/json';
import { ACTION_TYPE } from 'in-automation/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './RunActionDialog.mless';

interface RunActionDialogProps {
  volatileId: VolatileId;
  event?: Event;
  action: Action;
  test?: boolean;
  policy?: NewPolicy;
  executePolicy?: Policy;
  handleSave?: (params: ParameterValue[], volatileId: VolatileId) => void;
}

export default function RunActionDialog({
  action,
  volatileId,
  event,
  test,
  policy,
  handleSave,
  executePolicy
}: RunActionDialogProps) {
  const [actionInstanceId, setActionInstanceId] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const agentSnapShots = useAgentSnapShots({ action });
  // we usually see rec actions only when agents available. some times, when agent is stopped, we will have 10 minute window to updates actions.
  // This flag here sets true which uses to disable the run button when agent is unavailable
  const { resolvedDynamicParameters, errorResolvingDynamicParameters } = useResolvedDynamicParameters({
    action,
    event
  });
  const [form, setForm] = useRunActionForm({
    volatileId,
    agentSnapShots,
    action,
    resolvedDynamicParameters,
    policy,
    executePolicy
  });
  const { runActionTrackerSegment, testActionTrackerSegment } = useSegmentTracker();
  return (
    <div className={locals.dialogWrapper}>
      <Dialog
        className={locals.dialog}
        titleIconType={action.type === ACTION_TYPE.MANUAL ? undefined : 'lib_help_error_error_circle'}
        title={getTitle({ action, error, actionInstanceId, test, policy })}
        onClose={() => onClose({ error, actionInstanceId })}
        withoutBodyPadding
        doNotCloseOnOutsideClick
      >
        <>
          <div className={locals.actionModalPadding}>
            <RunActionContent
              action={action}
              error={error}
              isSaving={isSaving}
              actionInstanceId={actionInstanceId}
              form={form}
              setForm={setForm}
              agentSnapShots={agentSnapShots}
              volatileId={volatileId}
              errorResolvingDynamicParameters={errorResolvingDynamicParameters}
              resolvedDynamicParameters={resolvedDynamicParameters}
              policy={policy}
            />
          </div>
          <FormFooter>
            {action.type === ACTION_TYPE.MANUAL ? (
              <CancelButton onClick={close}>{t('in-automation:close')}</CancelButton>
            ) : (
              <RunActionFooter
                policy={policy}
                error={error}
                test={test}
                agentSnapShots={agentSnapShots}
                actionInstanceId={actionInstanceId}
                isSaving={isSaving}
                form={form}
                onSave={() =>
                  onSave(
                    {
                      form,
                      setForm,
                      setIsSaving,
                      action,
                      agentSnapShots,
                      setError,
                      setActionInstanceId,
                      event,
                      policy,
                      handleSave,
                      executePolicy,
                      test
                    },
                    runActionTrackerSegment,
                    testActionTrackerSegment
                  )
                }
              />
            )}
          </FormFooter>
        </>
      </Dialog>
    </div>
  );
}

function onClose({ error, actionInstanceId }: { error?: string; actionInstanceId?: string }) {
  if (error || actionInstanceId) {
    refreshHistory();
  }
  close();
}
interface GetTitleParams extends Pick<RunActionDialogProps, 'action' | 'test' | 'policy'> {
  actionInstanceId: string;
  error: string;
}
const getTitle = ({ action, error, actionInstanceId, test, policy }: GetTitleParams) => {
  const actionName = action.type === ACTION_TYPE.EXTERNAL ? action?.description : action.name;
  if (policy) return t('in-automation:configureAutomation', { actionName });
  if (error) return t('in-automation:failedToInitiate', { actionName });
  if (actionInstanceId) return t('in-automation:hasBeenInitiated', { actionName });
  if (test) return t('in-automation:chosenToTest', { actionName });
  if (action.type === ACTION_TYPE.MANUAL) return t('in-automation:viewManualAction', { actionName });
  return t('in-automation:chosenToRun', { actionName });
};

function filterAgentSnapShotsArray(hostId: string, agents: OUT | null | undefined): OUT | null | undefined {
  if (!agents || !agents.data || !agents.data.online) {
    return agents;
  }

  const filteredOnline = agents.data.online.filter((agent: AgentSnapshot) => agent?.volatileId?.host_id === hostId);

  // If no agent is found with the specified hostId, return the original agents to show the list of ansible agents
  if (filteredOnline.length === 0) {
    return agents;
  }

  return {
    ...agents,
    data: {
      ...agents.data,
      online: filteredOnline
    }
  };
}

export function useAgentSnapShots({ action }: { action: Action }) {
  const timeConfig = useTimeConfig();
  let query = '';
  const gitUrl = getGitLinkFromFields(action.fields);
  const gitType = getGitTypeFromFields(action.fields);
  if (action.type === ACTION_TYPE.SCRIPT && gitUrl.value === '') query = 'entity.agent.capability:action-script';
  else if (action.type === ACTION_TYPE.SCRIPT && gitUrl.value !== '' && gitType.value === 'github')
    query = 'entity.agent.capability:action-script entity.agent.capability:action-github-ops';
  else if (action.type === ACTION_TYPE.SCRIPT && gitUrl.value !== '' && gitType.value === 'gitlab')
    query = 'entity.agent.capability:action-script entity.agent.capability:action-gitlab-ops';
  else if (action.type === ACTION_TYPE.HTTP) query = 'entity.agent.capability:action-http';
  else if (action.type === ACTION_TYPE.ANSIBLE) query = 'entity.agent.capability:action-ansible';
  else if (action.type === ACTION_TYPE.GITHUB) query = 'entity.agent.capability:action-github';
  else if (action.type === ACTION_TYPE.GITLAB) query = 'entity.agent.capability:action-gitlab';
  else if (action.type === ACTION_TYPE.JIRA) query = 'entity.agent.capability:action-jira';
  const agentSnapShots: OUT | null | undefined = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query }),
    [timeConfig]
  );

  if (action.type === ACTION_TYPE.ANSIBLE) {
    const hostId = getAnsibleHostIdFromFields(action.fields).value;
    // filtering agent snapshot with host id (show only the agent that the action definition is associated with)
    return hostId ? filterAgentSnapShotsArray(hostId, agentSnapShots) : agentSnapShots;
  }
  return agentSnapShots;
}

const emptyParametersArray = alwaysEmptyArray as unknown as Observable<ResolvedDynamicParamValue[]>;

const ansibleHostQueries = [
  {
    name: 'fqdn',
    tagName: 'host.fqdn'
  },
  {
    name: 'ip',
    tagName: 'host.ip'
  }
];
const useResolvedDynamicParameters = ({ action, event }: { action: Action; event?: Event }) => {
  const [errorResolvingDynamicParameters, setErrorResolvingDynamicParameters] = useState(false);
  const resolvedDynamicParameters = useObservable(() => {
    if (!event) return emptyParametersArray;
    const dynamicParameters = action.inputParameters?.filter(({ type }) => type === 'dynamic') ?? [];
    if (dynamicParameters.length === 0 && action.type !== ACTION_TYPE.ANSIBLE) return emptyParametersArray;
    const parsedParameters = dynamicParameters.map(({ value, name }) => ({
      name,
      ...parseDynamicParameter(value)
    }));
    const timestamp: number =
      event.metadata?.triggerTime != null ? Math.min(event.start, event.metadata.triggerTime) : event.start;
    if (action.type === ACTION_TYPE.ANSIBLE) {
      parsedParameters.push(...ansibleHostQueries);
    }
    return resolveDynamicParameters({ eventId: event.id, parameters: parsedParameters, timestamp }).map(result => {
      if (hasError(result)) {
        setErrorResolvingDynamicParameters(true);
      }
      if (!isLoading(result)) {
        return result.data?.parameters ?? [];
      }
      return null;
    });
  }, [event, action]);
  return { resolvedDynamicParameters, errorResolvingDynamicParameters };
};

const useRunActionForm = ({
  volatileId,
  agentSnapShots,
  action,
  resolvedDynamicParameters,
  policy,
  executePolicy
}: {
  volatileId: VolatileId;
  agentSnapShots: OUT | null | undefined;
  action: Action;
  resolvedDynamicParameters: ResolvedDynamicParamValue[] | null | undefined;
  policy?: NewPolicy;
  executePolicy?: Policy;
}) => {
  const [form, setForm] = useState<MapForm<any>>();
  useEffect(() => {
    if (agentSnapShots && resolvedDynamicParameters && !form) {
      setForm(createForm({ volatileId, agentSnapShots, action, resolvedDynamicParameters, policy, executePolicy }));
    }
  }, [agentSnapShots, form, volatileId, action, resolvedDynamicParameters, policy, executePolicy]);
  return [form, setForm] as const;
};

type VaultParameter = { secretKey: string; secretPath: string };
const isVaultParameter = (param: VaultParameter | {}): param is VaultParameter => {
  return 'secretKey' in param && 'secretPath' in param;
};
function parseVaultParameter(str?: string) {
  const vaultParameter = safeParseJSON<VaultParameter>(str);
  if (!isVaultParameter(vaultParameter)) {
    return { secretKey: '', secretPath: '' };
  }
  return vaultParameter;
}

type DynamicParameter = { key?: string; tagName: string };
const isDynamicParameter = (param: DynamicParameter | {}): param is DynamicParameter => {
  return 'tagName' in param;
};
function parseDynamicParameter(str?: string) {
  const dynamicParameter = safeParseJSON<DynamicParameter>(str);
  if (!isDynamicParameter(dynamicParameter)) {
    return { key: '', tagName: '' };
  }
  return dynamicParameter;
}

interface OnSaveParams extends Pick<RunActionDialogProps, 'action' | 'event'> {
  form: MapForm<any> | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any> | undefined>>;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  agentSnapShots: OUT | null | undefined;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setActionInstanceId: React.Dispatch<React.SetStateAction<string>>;
  policy?: NewPolicy;
  handleSave?: (params: ParameterValue[], volatileId: VolatileId) => void;
  executePolicy?: Policy;
  test?: boolean;
}

function onSave(
  {
    form,
    setForm,
    setIsSaving,
    action,
    agentSnapShots,
    setError,
    setActionInstanceId,
    event,
    policy,
    handleSave,
    executePolicy,
    test
  }: OnSaveParams,
  runActionTrackerSegment: TrackingFunction,
  testActionTrackerSegment: TrackingFunction
) {
  if (!form?.hierarchyValid) {
    setForm(form?.setTouched(true, { recurse: true }));
    return;
  }
  setIsSaving(true);

  const targetAgent = form?.get('targetAgent') as Field<string>;
  const parameters = form?.get('parameters') as MapForm<any>;
  const inputParameters = parameters.reduce<ParameterValue[]>((acc, parameter, key) => {
    const parameterDefinition = action.inputParameters?.find(p => key === p.name);
    const name = parameterDefinition?.name ?? '';
    const label = parameterDefinition?.label ?? '';
    if (parameterDefinition?.type === 'dynamic' && policy) {
      return acc;
    }
    if (parameterDefinition?.type === 'vault') {
      const pathField = (parameter as ListForm<any>).get(0) as Field<string>;
      const keyField = (parameter as ListForm<any>).get(1) as Field<string>;
      if ((!pathField?.value || !keyField?.value) && !policy) {
        return acc;
      }
      return [
        ...acc,
        {
          name,
          type: 'vault',
          label,
          value: JSON.stringify({
            secretPath: pathField.value.trim() ?? '',
            secretKey: keyField.value.trim() ?? ''
          })
        }
      ];
    }

    const value = (parameter as Field<string>).value;
    if (value || policy) {
      return [...acc, { name, value: value?.trim(), label, type: parameterDefinition?.type }];
    }
    return acc;
  }, []);
  const hiddenInputParameters = policy
    ? []
    : (action.inputParameters ?? []).reduce<ParameterValue[]>((acc, parameter) => {
        if (shouldHideParameter(parameter)) {
          if (parameter.type === 'vault') {
            const { secretKey, secretPath } = parseVaultParameter(parameter.value);
            return [
              ...acc,
              {
                name: parameter.name,
                type: 'vault',
                label: parameter.label,
                value: JSON.stringify({
                  secretPath: secretPath,
                  secretKey: secretKey
                })
              }
            ];
          }
          return [
            ...acc,
            { name: parameter.name, value: parameter.value ?? '', type: 'static', label: parameter.label }
          ];
        }
        return acc;
      }, []);
  const selectedVolatileId =
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === targetAgent.value)?.volatileId ?? {};
  const handleActionResponse = (response: ActionInstance) => {
    setIsSaving(false);
    if ('errorMessage' in response && response.errorMessage != null) {
      setError(response.errorMessage);
      setActionInstanceId(response?.actionInstanceId);
    } else {
      setActionInstanceId(response.actionInstanceId);
    }
  };

  const allInputParameters = [...inputParameters, ...hiddenInputParameters];
  const { id: actionId, name: actionName } = action;
  const executePolicyId = executePolicy?.id ?? '';
  const hostsLimit = {
    name: 'hostsLimit',
    value: (form?.get('hostsLimit') as Field<Option[]>).value.map(host => host.value).join()
  };
  const timeout = getTimeoutFromFields(action.fields).value;

  // If 'policy' exists then this dialog is being used to edit the action configuration for a policy.
  // An action is not being run, but rather the action configuration is being saved.
  if (policy) {
    if (isEmpty(selectedVolatileId) && targetAgent.value !== '') {
      // @ts-expect-error
      selectedVolatileId.host_id = TRIGGERING_AGENT;
    }
    const params =
      hostsLimit.value && hostsLimit.value.length > 0 ? [...allInputParameters, hostsLimit] : allInputParameters;
    return handleSave?.(params, selectedVolatileId);
  }

  // Run the action
  if (
    [ACTION_TYPE.SCRIPT, ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA, ACTION_TYPE.HTTP].includes(
      action.type
    )
  ) {
    runAction({
      volatileId: selectedVolatileId,
      eventId: event?.id,
      actionName,
      timeout,
      actionId,
      policyId: executePolicyId,
      inputParameters: allInputParameters
    }).once(handleActionResponse);
  } else if (action.type === ACTION_TYPE.ANSIBLE) {
    runAction({
      volatileId: selectedVolatileId,
      eventId: event?.id,
      actionName,
      timeout,
      actionId,
      inputParameters:
        hostsLimit.value && hostsLimit.value.length > 0 ? [...allInputParameters, hostsLimit] : allInputParameters,
      policyId: executePolicyId
    }).once(handleActionResponse);
  }

  // Track an action was either tested or run
  if (test) {
    testActionTrackerSegment({
      actionName: action.name,
      actionType: action.type,
      aiOriginated: isAIAction(action) || isAIActionCopy(action) ? true : false
    });
  } else {
    // Set policyType when running an action via a policy
    let policyType;
    if (executePolicy) {
      policyType =
        isManual(executePolicy) && isAutomatic(executePolicy)
          ? 'both'
          : isManual(executePolicy)
          ? 'manual'
          : 'automatic';
    } else {
      policyType = '';
    }

    runActionTrackerSegment({
      actionName: action.name,
      actionType: action.type,
      policyName: executePolicy?.name ?? '',
      policyType,
      aiOriginated: isAIAction(action) || isAIActionCopy(action) ? true : false
    });
  }
}

interface RunActionFooterProps {
  error: string;
  actionInstanceId: string;
  isSaving: boolean;
  form: MapForm<any> | undefined;
  onSave: () => void;
  test?: boolean;
  policy?: NewPolicy;
  agentSnapShots: OUT | null | undefined;
}

function RunActionFooter({
  error,
  actionInstanceId,
  isSaving,
  form,
  onSave,
  test,
  policy,
  agentSnapShots
}: RunActionFooterProps) {
  const navigateToActionHistory = useNavigateToActionHistory();
  if (error || actionInstanceId) {
    return (
      <>
        <CancelButton
          isSaving={isSaving}
          onClick={() => {
            close();
            refreshHistory();
          }}
        >
          {t('in-automation:close')}
        </CancelButton>
        <Button
          kind="primary"
          onClick={() => {
            if (test) {
              navigateToActionHistory(actionInstanceId);
            } else {
              refreshHistory();
              setActiveKey('actionHistory');
            }

            close();
          }}
        >
          {t('in-automation:actionHistory.goToActionHistory')}
        </Button>
      </>
    );
  }
  return (
    <>
      <CancelButton isSaving={isSaving} onClick={close} />
      <SaveButton
        kind="primary"
        form={form}
        disabled={!form || agentSnapShots?.progress?.loading}
        isSaving={isSaving}
        onClick={onSave}
      >
        {policy
          ? t('in-automation:actionHistory.saveButton')
          : test
          ? t('in-automation:testAction')
          : t('in-automation:runAction')}
      </SaveButton>
    </>
  );
}

interface CreateFormParams extends Pick<RunActionDialogProps, 'volatileId' | 'action' | 'policy' | 'executePolicy'> {
  agentSnapShots: OUT;
  resolvedDynamicParameters: ResolvedDynamicParamValue[];
}

function getAgent(
  volatileId: VolatileId,
  agentSnapShots: OUT,
  policy: NewPolicy | undefined,
  executePolicy: Policy | undefined
) {
  const executeOrNewPolicy = policy || executePolicy;
  if (executeOrNewPolicy) {
    const agentId = executeOrNewPolicy.typeConfigurations[0]?.runnable?.runConfiguration?.actions[0]?.agentId ?? '';
    if (agentId === TRIGGERING_AGENT && executePolicy) {
      return volatileId.host_id;
    }
    return agentId;
  }
  return (
    agentSnapShots?.data?.online?.find(agent => agent.volatileId?.host_id === volatileId.host_id)?.volatileId
      ?.host_id ?? ''
  );
}

function getParameterFromName(policy: NewPolicy | undefined, name: string) {
  return policy?.typeConfigurations?.[0]?.runnable?.runConfiguration?.actions?.[0]?.inputParameterValues?.find(
    param => {
      if (param.name === name) {
        return true;
      }
      return false;
    }
  );
}

function getHostLimit(executeOrNewPolicy: NewPolicy | Policy | undefined): Options {
  if (executeOrNewPolicy) {
    const param = getParameterFromName(executeOrNewPolicy, 'hostsLimit');
    if (param) {
      const hostsLimit = param.value.split(',');

      return hostsLimit.flatMap(host => {
        const options: Option[] = [];

        if (host === TRIGGERING_HOST_FQDN) {
          options.push(TRIGGERING_HOST_FQDN_OPTION);
        }
        if (host === TRIGGERING_HOST_IP) {
          options.push(TRIGGERING_HOST_IP_OPTION);
        }
        if (host !== TRIGGERING_HOST_FQDN && host !== TRIGGERING_HOST_IP) {
          options.push({ label: host, value: host });
        }

        return options;
      });
    }
  }
  return [];
}

function getParameterFromPolicy(policy: NewPolicy | undefined, name: string): { found: boolean; value: string } {
  if (policy) {
    const param = getParameterFromName(policy, name);
    if (param) {
      return { found: true, value: param.value };
    }
  }
  return { found: false, value: '' };
}

function createForm({
  volatileId,
  agentSnapShots,
  action,
  resolvedDynamicParameters,
  policy,
  executePolicy
}: CreateFormParams) {
  const executeOrNewPolicy = policy || executePolicy;
  return (
    createMapForm()
      .put(
        'targetAgent',
        createField({
          value: getAgent(volatileId, agentSnapShots, policy, executePolicy),
          validator: notBlankValidator
        })
      )
      .put(
        'parameters',
        createMapForm({
          items: action.inputParameters?.reduce((acc, parameter) => {
            if (shouldHideParameter(parameter)) {
              return acc;
            }
            if (parameter.type === 'vault') {
              const { found, value } = getParameterFromPolicy(executeOrNewPolicy, parameter.name);
              const { secretKey, secretPath } = parseVaultParameter(found ? value : parameter.value);
              return {
                ...acc,
                [parameter.name]: createListForm({
                  items: [
                    createField({
                      value: secretPath,
                      validator: parameter.required ? notBlankValidator : undefined
                    }),
                    createField({
                      value: secretKey,
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
                          message: t('in-automation:validVaultParameter')
                        }
                      ];
                    }
                    return null;
                  }
                })
              };
            } else if (parameter.type === 'dynamic' && !policy) {
              const { resolvedValue = '' } = resolvedDynamicParameters?.find(p => p.name === parameter.name) ?? {};
              return {
                ...acc,
                [parameter.name]: createField({
                  value: formatResolvedValue(resolvedValue),
                  validator: parameter.required ? notBlankValidator : undefined
                })
              };
            }
            const { found, value } = getParameterFromPolicy(executeOrNewPolicy, parameter.name);
            return {
              ...acc,
              [parameter.name]: createField({
                value: found ? value : parameter.value ?? '',
                validator: parameter.required ? notBlankValidator : undefined
              })
            };
          }, {})
        })
      )
      .put('hostsLimit', createField({ value: getHostLimit(executeOrNewPolicy) }))
      //his field helps us with keeping hostlimit options static
      .put('hostsLimitForm', createField({ value: getHostLimit(executeOrNewPolicy) }))
  );
}

const formatResolvedValue = (value: string) => {
  try {
    const parsedValue: string[] = JSON.parse(value);
    if (parsedValue.length > 1) {
      return '[' + parsedValue.join(',') + ']';
    }
    return parsedValue[0] ?? '';
  } catch {
    return value;
  }
};
