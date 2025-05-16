/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, ListForm, MapForm } from 'formalistic';
import React, { useMemo, useEffect } from 'react';
import classNames from 'classnames';
import { fromJS } from 'immutable';

import { Typography, Spacer, Link, DescriptionList, DescriptionItem } from '@instana/components';
import { Action, Parameter, VolatileId, DynamicFieldValue } from '@instana/types';
import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getAnsibleFields,
  getInterpreterToUse,
  getScriptFromFields,
  getDocLinkFromFields,
  getWebhookFields,
  getGithubFields,
  getGitlabFields,
  getJiraFields,
  getManualContentFromFields,
  getGitLinkFromFields,
  base64ToUtf8
} from 'in-automation/utils/actionField';
import { toViewModel } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  ACTION_TRANSLATIONS,
  ACTION_TYPE,
  AUTH_TRANSLATIONS,
  GIT_OPERATIONS,
  JIRA_OPERATIONS
} from 'in-automation/constants';
import DynamicTagBasedPayloadConfigurator from 'in-automation/components/DynamicTagBasedPayloadConfigurator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ManualActionContent from 'in-automation/components/ManualActionContent/ManualActionContent';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { ResolvedDynamicParamValue, NewPolicy } from 'in-automation/types';
import CreatableComboBox from 'in-components/ComboBox/CreatableComboBox';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import ValidationBlock from 'in-components/form/ValidationBlock';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import HelpText from 'in-components/form/HelpText/HelpText';
import Notification from 'in-components/form/Notification';
import { Col } from 'in-components/layout/Grid/Grid';
import { Row } from 'in-components/layout/Grid/Grid';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { getSnapshot } from 'in-stores/snapshot';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './RunActionDialog.mless';

export const TRIGGERING_AGENT = 'TRIGGERING_AGENT';
export const TRIGGERING_HOST_FQDN = 'TRIGGERING_HOST_FQDN';
export const TRIGGERING_HOST_IP = 'TRIGGERING_HOST_IP';

interface RunActionDialogContentProps {
  error: string;
  actionInstanceId: string;
  action: Action;
  form: MapForm<any> | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any> | undefined>>;
  volatileId: VolatileId;
  agentSnapShots: OUT | null | undefined;
  errorResolvingDynamicParameters: boolean;
  resolvedDynamicParameters: ResolvedDynamicParamValue[] | null | undefined;
  policy?: NewPolicy;
  isSaving?: boolean;
}

export default function RunActionDialogContent({
  error,
  actionInstanceId,
  action,
  form,
  setForm,
  volatileId,
  agentSnapShots,
  errorResolvingDynamicParameters,
  resolvedDynamicParameters,
  policy,
  isSaving = false
}: RunActionDialogContentProps) {
  if (!form || isSaving || agentSnapShots?.progress?.loading) return <LoadingIndicator size="xxl" />;

  if (error && !actionInstanceId) {
    return (
      <>
        <Typography variant="body-small">{error}</Typography>
        <Spacer horizontal="xsmall" />
      </>
    );
  }

  if (actionInstanceId) {
    return (
      <Typography variant="body-small">
        {error && (
          <>
            <Typography variant="body-small">{error}</Typography>
            <Spacer horizontal="xsmall" />
          </>
        )}
        {t('in-automation:linkToActionHistory')}
      </Typography>
    );
  }
  if (action.type === ACTION_TYPE.MANUAL) {
    return <ManualActionContent content={getManualContentFromFields(action.fields)} addCopyButton />;
  }

  return (
    <HorizontalFlexWrapper className={locals.alignStretch}>
      <Col lg={8}>
        <div className={locals.borderRight}>
          <MetadataActionContent action={action} viewRecommendedAction={false} />
          {action.type === ACTION_TYPE.ANSIBLE && (
            <AnsibleActionContent
              form={form}
              setForm={setForm}
              action={action}
              resolvedDynamicParameters={resolvedDynamicParameters}
              policy={policy}
            />
          )}
          <div>
            <AgentSelection
              policy={policy}
              form={form}
              volatileId={volatileId}
              setForm={setForm}
              agentSnapShots={agentSnapShots}
            />
            <Typography variant="body-small">{t('in-automation:actionCannotBeUndone')}</Typography>
          </div>
        </div>
        <Spacer horizontal="normal" />
      </Col>
      <Col className={locals.parameterContainer} lg={4}>
        <DescriptionList inComponents>
          <DescriptionItem
            inComponents
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-automation:parameters')}
          >
            <ParameterInput
              errorResolvingDynamicParameters={errorResolvingDynamicParameters}
              action={action}
              form={form}
              setForm={setForm}
              policy={policy}
            />
          </DescriptionItem>
        </DescriptionList>
      </Col>
    </HorizontalFlexWrapper>
  );
}

function AgentSelection({
  form,
  setForm,
  agentSnapShots,
  volatileId,
  policy
}: Pick<RunActionDialogContentProps, 'form' | 'setForm' | 'agentSnapShots' | 'volatileId' | 'policy'>) {
  const targetAgent = form?.get('targetAgent') as Field<string> | undefined;

  const hostSnapshots = useObservable(() => {
    const getHostSnapshotIds = (agentSnapShots?.data?.online || []).map(agent =>
      getHostSnapshotId(fromJS(agent)).map(id => ({ id, agent }))
    );

    if (getHostSnapshotIds.length > 0) {
      return combineLatest(getHostSnapshotIds).flatMap(
        hostData =>
          combineLatest(
            hostData.map(({ id, agent }) =>
              getSnapshot(id).map(hostSnapshot => ({
                hostSnapshot,
                agent
              }))
            )
          ).map(data => ({ loading: false, data })) // wrap result
      );
    } else {
      return just({ loading: false, data: [] });
    }
  }, [agentSnapShots?.data?.online]) ?? { loading: true, data: [] };

  if ('loading' in hostSnapshots && hostSnapshots.loading) {
    return <LoadingIndicator size="xxl" />;
  }

  if (!hostSnapshots) return null;

  const sortedOptions = Array.isArray(hostSnapshots.data)
    ? hostSnapshots.data
        .map(({ hostSnapshot, agent }) => {
          const isTriggeringAgent = agent.volatileId?.host_id === volatileId.host_id;
          const hostname = hostSnapshot?.get('label');
          return {
            label: isTriggeringAgent ? t('in-automation:triggeringAgent', { hostname }) : hostname,
            value: agent.volatileId?.host_id ?? ''
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label))
    : [];

  const options = policy
    ? [...sortedOptions, { value: TRIGGERING_AGENT, label: t('in-automation:policies.triggeringAgent') }]
    : sortedOptions;

  return (
    <>
      {targetAgent?.map(field => (
        <FormGroup>
          <Label htmlFor="target-agent" hasError={!field.valid && field.touched}>
            {t('in-automation:targetAgent')}
          </Label>
          <ComboBox
            options={options}
            id="target-agent"
            value={field.value}
            isClearable={false}
            onChange={o => {
              const updatedForm = form?.updateIn(['targetAgent'], field =>
                (field as Field<string>).setValue((o as Option).value).setTouched(true)
              );
              setForm(updatedForm);
            }}
          />

          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-automation:targetAgentDescription')}</HelpText>
          {options.length === 0 && (
            <ValidationBlock className={locals.subErrorTextFormField}>{t('in-automation:agentEmpty')}</ValidationBlock>
          )}
        </FormGroup>
      ))}
    </>
  );
}

function ScriptActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const script = getScriptFromFields(action.fields);
  const gitUrl = getGitLinkFromFields(action.fields);
  if (gitUrl.value === '') {
    let plaintextScript = script.value;
    if (script.encoding === 'base64') {
      plaintextScript = base64ToUtf8(plaintextScript);
    }
    const interpreter = getInterpreterToUse(action);
    let plaintextInterpreter = interpreter.value;
    if (interpreter.encoding === 'base64') {
      plaintextInterpreter = base64ToUtf8(plaintextInterpreter);
    }
    return (
      <DescriptionList inComponents>
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={t('in-automation:titleInterpreter')}
        >
          {plaintextInterpreter}
        </DescriptionItem>
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={t('in-automation:titleScriptContent')}
        >
          <Code withExpandButton withoutCopyButton code={plaintextScript} lang={'bash'} softWrap />
        </DescriptionItem>
      </DescriptionList>
    );
  } else {
    return (
      <DescriptionList inComponents>
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={t('in-automation:titleScriptContent')}
        >
          <Link external href={gitUrl.value}>
            {gitUrl.value}
          </Link>
        </DescriptionItem>
      </DescriptionList>
    );
  }
}

export function MetadataActionContent({
  action,
  viewRecommendedAction = false
}: {
  action: Action;
  viewRecommendedAction?: boolean;
}) {
  return (
    <>
      <DescriptionList inComponents>
        {viewRecommendedAction && (
          <DescriptionItem
            inComponents
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-automation:name')}
          >
            {action.name}
          </DescriptionItem>
        )}
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={t('in-automation:description')}
        >
          {action.description}
        </DescriptionItem>
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={t('in-automation:titleActionType')}
        >
          {ACTION_TRANSLATIONS[action.type]}
        </DescriptionItem>
      </DescriptionList>
      {action.type === ACTION_TYPE.SCRIPT && <ScriptActionContent action={action} />}
      {action.type === ACTION_TYPE.DOC_LINK && <DocActionContent action={action} />}
      {action.type === ACTION_TYPE.HTTP && <WebhookActionContent action={action} />}
      {action.type === ACTION_TYPE.GITHUB && <GithubActionContent action={action} />}
      {action.type === ACTION_TYPE.MANUAL && (
        <ManualActionContent content={getManualContentFromFields(action.fields)} addCopyButton />
      )}
      {action.type === ACTION_TYPE.GITLAB && <GitlabActionContent action={action} />}
      {action.type === ACTION_TYPE.JIRA && <JiraActionContent action={action} />}
      {action.type === ACTION_TYPE.ANSIBLE && viewRecommendedAction && <AnsibleActionMetadata action={action} />}
    </>
  );
}

function DocActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const link = getDocLinkFromFields(action.fields).value;
  return (
    <DescriptionList inComponents>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:titleUrl')}
      >
        <Link external href={link}>
          {link}
        </Link>
      </DescriptionItem>
    </DescriptionList>
  );
}

function WebhookActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { host, method, body, headerParsed, authenParsed } = getWebhookFields(action);
  const headerEntries = Object.entries(headerParsed);
  const authType = AUTH_TRANSLATIONS[authenParsed.type];
  return (
    <DescriptionList inComponents>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:request')}
      >
        <div>
          <Typography variant="body-small">{t('in-automation:method', { method: method.value })}</Typography>
        </div>
        <div>
          <Typography variant="body-small">{t('in-automation:host', { host: host.value })}</Typography>
        </div>
        {body && (
          <div>
            <Typography variant="body-small">{t('in-automation:body', { body: body.value })}</Typography>
          </div>
        )}
        {headerEntries?.length > 0 && (
          <div>
            <Typography variant="body-small">
              {t('in-automation:headers')}
              <ul>
                {headerEntries.map(h => (
                  <li key={h[0]}>
                    {h[0]}: {h[1]}
                  </li>
                ))}
              </ul>
            </Typography>
          </div>
        )}
        <div>
          <Typography variant="body-small">{t('in-automation:authType', { authType })}</Typography>
        </div>
      </DescriptionItem>
    </DescriptionList>
  );
}

function GithubActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { owner, repo, ticketActionType } = getGithubFields(action);
  const ticketTypeTranslated = GIT_OPERATIONS.find(a => a.value === ticketActionType.value)?.translation;
  return (
    <DescriptionList inComponents>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:request')}
      >
        <div>
          <Typography variant="body-small">{t('in-automation:ownerInfo', { owner: owner.value })}</Typography>
        </div>
        <div>
          <Typography variant="body-small">{t('in-automation:repoInfo', { repo: repo.value })}</Typography>
        </div>
        <div>
          <Typography variant="body-small">
            {t('in-automation:operationInfo', { ticketType: ticketTypeTranslated })}
          </Typography>
        </div>
      </DescriptionItem>
    </DescriptionList>
  );
}

function GitlabActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { projectId, ticketActionType } = getGitlabFields(action);
  const ticketTypeTranslated = GIT_OPERATIONS.find(a => a.value === ticketActionType.value)?.translation;
  return (
    <DescriptionList inComponents>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:request')}
      >
        <div>
          <Typography variant="body-small">
            {t('in-automation:projectIdInfo', { projectId: projectId.value })}
          </Typography>
        </div>
        <div>
          <Typography variant="body-small">
            {t('in-automation:operationInfo', { ticketType: ticketTypeTranslated })}
          </Typography>
        </div>
      </DescriptionItem>
    </DescriptionList>
  );
}

function JiraActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { project, ticketActionType } = getJiraFields(action);
  const ticketTypeTranslated = JIRA_OPERATIONS.find(a => a.value === ticketActionType.value)?.translation;
  return (
    <DescriptionList inComponents>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:request')}
      >
        <div>
          <Typography variant="body-small">{t('in-automation:projectInfo', { project: project.value })}</Typography>
        </div>
        <div>
          <Typography variant="body-small">
            {t('in-automation:operationInfo', { ticketType: ticketTypeTranslated })}
          </Typography>
        </div>
      </DescriptionItem>
    </DescriptionList>
  );
}

function ParameterInput({
  action,
  form,
  setForm,
  errorResolvingDynamicParameters,
  policy
}: Pick<RunActionDialogContentProps, 'action' | 'form' | 'setForm' | 'errorResolvingDynamicParameters' | 'policy'>) {
  const { inputParameters } = action;
  if (!inputParameters || inputParameters.filter(parameter => !shouldHideParameter(parameter)).length === 0) {
    return (
      <NoDataAvailable
        height={200}
        title={t('in-automation:noParametersTitle')}
        text={t('in-automation:noParametersText')}
      />
    );
  }
  return (
    <Col>
      {errorResolvingDynamicParameters && (
        <Notification failure>{t('in-automation:failedToResolveDynamicParameters')}</Notification>
      )}
      <Spacer vertical="normal" />
      {inputParameters?.map(parameter => {
        if (shouldHideParameter(parameter)) return;
        if (parameter.type === 'vault') {
          return <VaultParameterInput key={parameter.name} form={form} parameter={parameter} setForm={setForm} />;
        } else if (parameter.type === 'dynamic') {
          return (
            <DynamicParameterInput
              key={parameter.name}
              form={form}
              parameter={parameter}
              setForm={setForm}
              policy={policy}
            />
          );
        }
        // Will need to handle rendering dynamic parameters here
        return <StaticParameterInput key={parameter.name} form={form} parameter={parameter} setForm={setForm} />;
      })}
    </Col>
  );
}

interface ParameterInputParams extends Pick<RunActionDialogContentProps, 'form' | 'setForm'> {
  parameter: Parameter;
}

function VaultParameterInput({ form, parameter, setForm }: ParameterInputParams) {
  const parametersForm = form?.get('parameters') as MapForm<any> | undefined;
  const parameterField = parametersForm?.get(parameter.name!) as ListForm<any> | undefined;
  const pathField = parameterField?.get(0) as Field<string> | undefined;
  const keyField = parameterField?.get(1) as Field<string> | undefined;

  const onChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForm = form?.updateIn(['parameters', parameter.name], field =>
      (field as ListForm<any>).set(
        index,
        ((field as ListForm<any>).get(index) as Field<string>).setValue(e.target.value).setTouched(true)
      )
    );
    setForm(updatedForm);
  };

  const pathHasError = !pathField?.valid && pathField?.touched;
  const keyHasError = !keyField?.valid && keyField?.touched;
  const hasError = (!parameterField?.valid && parameterField?.hierarchyTouched) || pathHasError || keyHasError;

  return (
    <>
      {parameterField && keyField && pathField && (
        <FormGroup key={`${parameter.name}-input`}>
          <Row withoutSideMargin className={locals.justifyContent}>
            <Label
              className={classNames({
                [locals.parameterLabel]: !hasError
              })}
              hasError={hasError}
            >
              {parameter.required ? parameter.label : t('in-automation:optional', { name: parameter.label })}
            </Label>
            <Label>{t('in-automation:vault')}</Label>
          </Row>
          <TouchedMessages field={parameterField} className={locals.subErrorTextFormField} />
          <Label hasError={pathHasError}>{t('in-automation:secretPath')}</Label>
          <Input value={pathField.value} onChange={onChange(0)} hasError={pathHasError} />
          <TouchedMessages field={pathField} className={locals.subErrorTextFormField} />
          <Spacer vertical="small" />
          <Label hasError={keyHasError}>{t('in-automation:secretKey')}</Label>
          <Input value={keyField.value} onChange={onChange(1)} hasError={keyHasError} />
          <TouchedMessages field={keyField} className={locals.subErrorTextFormField} />
        </FormGroup>
      )}
      <Spacer vertical="medium" />
    </>
  );
}

function StaticParameterInput({ parameter, form, setForm }: ParameterInputParams) {
  const parametersForm = form?.get('parameters') as MapForm<any> | undefined;
  const parameterField = parametersForm?.get(parameter.name) as Field<string> | undefined;

  return (
    <>
      {parameterField && (
        <FormGroup key={`${parameter.name}-input`}>
          <Row withoutSideMargin className={locals.justifyContent}>
            <Label
              className={classNames({ [locals.parameterLabel]: !(!parameterField.valid && parameterField.touched) })}
              htmlFor={parameter.name}
              hasError={!parameterField.valid && parameterField.touched}
            >
              {parameter.required ? parameter.label : t('in-automation:optional', { name: parameter.label })}
            </Label>
            <Label>{t('in-automation:static')}</Label>
          </Row>
          <Input
            id={`${parameter.name}-input`}
            value={parameterField.value}
            placeholder={t('in-automation:enterParameterValue')}
            onChange={e => {
              const updatedForm = form?.updateIn(['parameters', parameter.name], field =>
                (field as Field<string>).setValue(e.target.value).setTouched(true)
              );
              setForm(updatedForm);
            }}
            hasError={!parameterField.valid && parameterField.touched}
          />
          <TouchedMessages field={parameterField} className={locals.subErrorTextFormField} />
        </FormGroup>
      )}
      <Spacer vertical="medium" />
    </>
  );
}

const safeJsonParse = (raw: string) => {
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};

function DynamicParameterInput({ parameter, form, setForm, policy }: ParameterInputParams & { policy?: NewPolicy }) {
  const parametersForm = form?.get('parameters') as MapForm<any> | undefined;
  const parameterField = parametersForm?.get(parameter.name) as Field<string> | undefined;

  const parsedDynamicValue: DynamicFieldValue = safeJsonParse(parameter.value ?? '{}');
  return (
    <>
      {parameterField && (
        <FormGroup key={`${parameter.name}-input`}>
          <Row withoutSideMargin className={locals.justifyContent}>
            <Label
              className={classNames({ [locals.parameterLabel]: !(!parameterField.valid && parameterField.touched) })}
              htmlFor={parameter.name}
              hasError={!parameterField.valid && parameterField.touched}
            >
              {parameter.required ? parameter.label : t('in-automation:optional', { name: parameter.label })}
            </Label>
            <Label>{t('in-automation:dynamic')}</Label>
          </Row>
          <DynamicTagBasedPayloadConfigurator value={toViewModel(parsedDynamicValue)} disabled />
          {!policy && (
            <>
              <Spacer vertical="small" />
              <Input
                id={`${parameter.name}-input`}
                value={parameterField.value}
                placeholder={t('in-automation:enterParameterValue')}
                onChange={e => {
                  const updatedForm = form?.updateIn(['parameters', parameter.name], field =>
                    (field as Field<string>).setValue(e.target.value).setTouched(true)
                  );
                  setForm(updatedForm);
                }}
                hasError={!parameterField.valid && parameterField.touched}
              />
              <TouchedMessages field={parameterField} className={locals.subErrorTextFormField} />
            </>
          )}
        </FormGroup>
      )}
      <Spacer vertical="medium" />
    </>
  );
}

export const TRIGGERING_HOST_FQDN_OPTION = {
  value: TRIGGERING_HOST_FQDN,
  label: t('in-automation:policies.triggeringHostFqdn')
};

export const TRIGGERING_HOST_IP_OPTION = {
  value: TRIGGERING_HOST_IP,
  label: t('in-automation:policies.triggeringHostIp')
};
function AnsibleActionContent({
  action,
  resolvedDynamicParameters,
  form,
  setForm,
  policy
}: Pick<RunActionDialogContentProps, 'action' | 'resolvedDynamicParameters' | 'form' | 'setForm' | 'policy'>) {
  const ip = resolvedDynamicParameters?.find(p => p.name === 'ip')?.resolvedValue ?? '[]';
  const parsedIp: string[] = safeJsonParse(ip ? ip : '[]');

  const fqdn = resolvedDynamicParameters?.find(p => p.name === 'fqdn')?.resolvedValue ?? '[]';
  const parsedFqdn: string[] = safeJsonParse(fqdn ? fqdn : '[]');

  const allOptions: Option[] = [...parsedIp, ...parsedFqdn]
    .map(host => ({ label: host, value: host }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const hostLimitField = form?.getIn(['hostsLimit']) as Field<Option[]> | undefined;
  // This field helps us with keeping hostlimit options static
  const hostLimitFormField = form?.getIn(['hostsLimitForm']) as Field<Option[]> | undefined;
  const selectedValues = hostLimitFormField?.value?.map(v => v.value);

  const filteredOptions = useMemo(() => {
    if (!selectedValues || selectedValues.length === 0) {
      return [];
    }

    const hasFqdn = selectedValues.includes('TRIGGERING_HOST_FQDN');
    const hasIp = selectedValues.includes('TRIGGERING_HOST_IP');

    // Extract custom values (anything not FQDN or IP)
    const customValues = selectedValues.filter(v => v !== 'TRIGGERING_HOST_FQDN' && v !== 'TRIGGERING_HOST_IP');

    // Map custom values back to Option objects (in case hostLimitFormField has labels)
    const customOptions = hostLimitFormField?.value?.filter(opt => customValues.includes(opt.value)) ?? [];

    // Build dynamic options
    let dynamicOptions: Option[] = [];

    if (hasFqdn && hasIp) {
      dynamicOptions = allOptions;
    } else if (hasFqdn) {
      dynamicOptions = allOptions.filter(opt => parsedFqdn?.includes(opt.value));
    } else if (hasIp) {
      dynamicOptions = allOptions.filter(opt => parsedIp?.includes(opt.value));
    }

    return [...customOptions, ...dynamicOptions];
    // Have to load options only once we resolve dynamic parameters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues]);

  useEffect(() => {
    if (!policy && selectedValues && selectedValues.length > 0) {
      const updatedForm = form?.updateIn(['hostsLimit'], (field: Field<Option[]>) =>
        field.setValue(filteredOptions).setTouched(true)
      );
      setForm(updatedForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let policyOptions = [];
  if (policy) {
    policyOptions.push(TRIGGERING_HOST_FQDN_OPTION, TRIGGERING_HOST_IP_OPTION);
  }
  return (
    <>
      <AnsibleActionMetadata action={action} />
      <FormGroup key="hostLimit">
        <Label htmlFor="hostLimit">{t('in-automation:hostsLimit')}</Label>
        <CreatableComboBox
          id={locals.hostLimit}
          isMulti
          options={policy ? policyOptions : filteredOptions}
          value={hostLimitField?.value ?? []}
          onChange={(value: Option[]) => {
            setForm(form?.updateIn(['hostsLimit'], (field: Field<Option[]>) => field.setValue(value).setTouched(true)));
          }}
        />
        <HelpText className={locals.subTextFormField}>{t('in-automation:hostsLimitHelpText')}</HelpText>
      </FormGroup>
    </>
  );
}

function AnsibleActionMetadata({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { jobTemplateUrl, isWorkflowJobTemplate } = getAnsibleFields(action);

  return (
    <>
      <DescriptionList inComponents>
        <DescriptionItem
          inComponents
          className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
          title={isWorkflowJobTemplate ? t('in-automation:workflowJobTemplate') : t('in-automation:jobTemplate')}
        >
          <Link external href={jobTemplateUrl}>
            {action.name}
          </Link>
        </DescriptionItem>
      </DescriptionList>
    </>
  );
}

// This is to support backwards compatability of old actions created before hidden was removed from dynamic parameters
export const shouldHideParameter = (parameter: Parameter) => parameter.hidden && parameter.type !== 'dynamic';
