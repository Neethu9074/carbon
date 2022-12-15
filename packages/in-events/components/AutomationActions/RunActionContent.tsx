/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Link, Typography, Spacer } from '@instana/components';

import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  getAuthenFromFields,
  getBodyFromFields,
  getHeaderFromFields,
  getHostFromFields,
  getIgnoreCertErrorsFromFields,
  getMethodFromFields,
  getScriptFromFields,
  getType,
  isScript,
  isWebhook
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { AdditionalHeaders, Authen } from 'in-api/automation';
import { close } from 'in-components/DialogPresenter/store';
import HelpText from 'in-components/form/HelpText/HelpText';
import Select from 'in-components/form/Select/Select';
import { Col } from 'in-components/layout/Grid/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import { Action, VolatileId } from 'in-types';
import Code from 'in-components/Code';
import { t, Trans } from 'in-i18n';

import locals from './RunAction.mless';

interface RunActionContentProps {
  error: string;
  actionInstanceId: string;
  action: Action;
  form: MapForm | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm | undefined>>;
  volatileId: VolatileId;
  agentSnapShots: OUT | null | undefined;
}

export default function RunActionContent({
  error,
  actionInstanceId,
  action,
  form,
  setForm,
  volatileId,
  agentSnapShots
}: RunActionContentProps) {
  const timeConfig = useTimeConfig();

  if (error) return <Typography variant="body-small">{error}</Typography>;
  if (actionInstanceId) {
    const tagFilterExpression = tagFilter('log.custom', 'EQUALS', actionInstanceId, 'actionInstanceId');
    const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });
    return (
      <Typography variant="body-small">
        <Trans
          i18nKey="in-settings:tabs.linkToActionLogs"
          components={{
            // @ts-expect-error
            logsLink: <Link onClick={close} href$={link} />
          }}
        />
      </Typography>
    );
  }
  return (
    <HorizontalFlexWrapper>
      <div className={locals.borderRight}>
        <DescriptionList>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-events:titleDescription')}
          >
            {action.description}
          </DescriptionItem>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-events:titleActionType')}
          >
            {getType(action)}
          </DescriptionItem>
        </DescriptionList>
        {isScript(action.type) && <ScriptActionContent action={action} />}
        {isWebhook(action.type) && <WebhookActionContent action={action} />}
        <AgentSelection form={form} volatileId={volatileId} setForm={setForm} agentSnapShots={agentSnapShots} />
        <Typography variant="body-small">{t('in-events:actionCannotBeUndone')}</Typography>
      </div>
      <Spacer horizontal="normal" />
      <ParameterInput action={action} form={form} setForm={setForm} />
    </HorizontalFlexWrapper>
  );
}

export const getWebhookFields = (action: Action) => {
  let host = getHostFromFields(action.fields);
  const method = getMethodFromFields(action.fields);
  const body = getBodyFromFields(action.fields);
  const headerString = getHeaderFromFields(action.fields);
  const header: AdditionalHeaders = JSON.parse(headerString);
  const ignoreCertErrors = getIgnoreCertErrorsFromFields(action.fields);
  const authenString = getAuthenFromFields(action.fields);
  const authen: Authen = JSON.parse(authenString);
  if (authen.type === BASIC_AUTH) {
    const { username, password } = authen;
    const authenString = `Basic ${btoa(`${username}:${password}`)}`;
    header['Authorization'] = authenString;
  } else if (authen.type === BEARER_TOKEN) {
    const { bearerToken } = authen;
    const authenString = `Bearer ${bearerToken}`;
    header['Authorization'] = authenString;
  } else if (authen.type === API_KEY) {
    const { apiKey, apiKeyAddTo, apiKeyValue } = authen;
    if (apiKeyAddTo === 'header') {
      header[apiKey!] = apiKeyValue!;
    } else if (apiKeyAddTo === 'query') {
      host = host.includes('?') ? `${host}&${apiKey}=${apiKeyValue}` : `${host}?${apiKey}=${apiKeyValue}`;
    }
  }
  return { host, method, body, header: JSON.stringify(header), ignoreCertErrors };
};

const AgentSelection = ({
  form,
  setForm,
  agentSnapShots,
  volatileId
}: Pick<RunActionContentProps, 'form' | 'setForm' | 'agentSnapShots' | 'volatileId'>) => {
  const targetAgent = form?.get('targetAgent') as Field<string> | undefined;
  return (
    <>
      {targetAgent?.map(field => (
        <FormGroup>
          <Label htmlFor="target-agent" hasError={!field.valid && field.touched}>
            {t('in-events:targetAgent')}
          </Label>
          <Select
            id="target-agent"
            value={field.value}
            onChange={e => {
              const updatedForm = form?.updateIn(['targetAgent'], field =>
                (field as Field<string>).setValue(e.target.value).setTouched(true)
              );
              setForm(updatedForm);
            }}
            hasError={!field.valid && field.touched}
          >
            <>
              <option hidden value="">
                {t('in-events:pleaseSelect')}
              </option>
              {agentSnapShots?.data?.online?.map(agent => {
                const hostname = agent.data?.hostname;
                const label =
                  agent.volatileId?.host_id === volatileId.host_id
                    ? t('in-events:triggeringAgent', { hostname })
                    : hostname;
                return (
                  <option key={agent.volatileId?.host_id} value={agent.volatileId?.host_id}>
                    {label}
                  </option>
                );
              })}
            </>
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-events:targetAgentDescription')}</HelpText>
        </FormGroup>
      ))}
    </>
  );
};

const ScriptActionContent = ({ action }: { action: Action }) => {
  const script = getScriptFromFields(action.fields);
  return (
    <DescriptionList>
      <DescriptionItem
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-events:titleScriptContent')}
      >
        <Code withExpandButton withoutCopyButton code={atob(script)} lang={'bash'} softWrap />
      </DescriptionItem>
    </DescriptionList>
  );
};

const WebhookActionContent = ({ action }: { action: Action }) => {
  const { host, method, body, header } = getWebhookFields(action);
  const headerEntries = Object.entries(JSON.parse(header) as AdditionalHeaders);
  return (
    <DescriptionList>
      <DescriptionItem
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-events:request')}
      >
        <div>
          <Typography variant="body-small">{t('in-events:method', { method })}</Typography>
        </div>
        <div>
          <Typography variant="body-small">{t('in-events:host', { host })}</Typography>
        </div>
        {body && (
          <div>
            <Typography variant="body-small">{t('in-events:body', { body })}</Typography>
          </div>
        )}
        {headerEntries?.length > 0 && (
          <div>
            <Typography variant="body-small">
              {t('in-events:headers')}
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
      </DescriptionItem>
    </DescriptionList>
  );
};

const ParameterInput = ({ action, form, setForm }: Pick<RunActionContentProps, 'action' | 'form' | 'setForm'>) => {
  const { parameters } = action;
  const parametersForm = form?.get('parameters') as MapForm | undefined;
  return (
    <Col>
      {parameters?.map(parameter => {
        if (parameter.hidden) return;
        if (parameter.type === 'vault') {
          const keyField = parametersForm?.get(`${parameter.name}-key`) as Field<string> | undefined;
          const pathField = parametersForm?.get(`${parameter.name}-path`) as Field<string> | undefined;
          return (
            keyField &&
            pathField && (
              <FormGroup key={`${parameter.label}-input`}>
                <Label hasError={(!keyField.valid && keyField.touched) || (!pathField.valid && pathField.touched)}>
                  {parameter.name}
                </Label>
                <Input
                  value={keyField.value}
                  onChange={e => {
                    const updatedForm = form?.updateIn(['parameters', `${parameter.name}-key`], field =>
                      (field as Field<string>).setValue(e.target.value).setTouched(true)
                    );
                    setForm(updatedForm);
                  }}
                  hasError={!keyField.valid && keyField.touched}
                />
                <TouchedMessages field={keyField} className={locals.subErrorTextFormField} />
                <Spacer vertical="small" />
                <Input
                  value={pathField.value}
                  onChange={e => {
                    const updatedForm = form?.updateIn(['parameters', `${parameter.name}-path`], field =>
                      (field as Field<string>).setValue(e.target.value).setTouched(true)
                    );
                    setForm(updatedForm);
                  }}
                  hasError={!pathField.valid && pathField.touched}
                />
                <TouchedMessages field={pathField} className={locals.subErrorTextFormField} />
              </FormGroup>
            )
          );
        }
        const parameterField = parametersForm?.get(parameter.name) as Field<string> | undefined;
        return (
          <>
            {parameterField && (
              <FormGroup key={`${parameter.label}-input`}>
                <Label htmlFor={parameter.name} hasError={!parameterField.valid && parameterField.touched}>
                  {parameter.name}
                </Label>
                <Input
                  id={`${parameter.name}-input`}
                  value={parameterField.value}
                  placeholder={t('in-custom-dashboards:widgets.chart.axesConfigurator.auto')}
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
          </>
        );
      })}
    </Col>
  );
};
