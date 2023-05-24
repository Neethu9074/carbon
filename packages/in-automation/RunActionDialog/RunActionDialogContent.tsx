/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, ListForm, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Link, Typography, Spacer } from '@instana/components';

import { toViewModel } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/CustomPayload/TagBasedPayloadConfigurator/TagBasedPayloadConfigurator';
import {
  AUTH_TYPES,
  getScriptFromFields,
  getType,
  getWebhookFields,
  isScript,
  isWebhook
} from 'in-automation/ActionCatalog/shared';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList/DescriptionList';
import { TagBasedPayloadConfigurator } from 'in-automation/ActionCatalog/ParameterDialog';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { Action, Parameter, VolatileId, DynamicFieldValue } from 'in-types';
import { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { close } from 'in-components/DialogPresenter/store';
import HelpText from 'in-components/form/HelpText/HelpText';
import Notification from 'in-components/form/Notification';
import Select from 'in-components/form/Select/Select';
import { Col } from 'in-components/layout/Grid/Grid';
import { Row } from 'in-components/layout/Grid/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';
import Code from 'in-components/Code';
import { t, Trans } from 'in-i18n';

import locals from './RunActionDialog.mless';

interface RunActionDialogContentProps {
  error: string;
  actionInstanceId: string;
  action: Action;
  form: MapForm<any> | undefined;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any> | undefined>>;
  volatileId: VolatileId;
  agentSnapShots: OUT | null | undefined;
  errorResolvingDynamicParameters: boolean;
}

export default function RunActionDialogContent({
  error,
  actionInstanceId,
  action,
  form,
  setForm,
  volatileId,
  agentSnapShots,
  errorResolvingDynamicParameters
}: RunActionDialogContentProps) {
  const timeConfig = useTimeConfig();

  if (error) return <Typography variant="body-small">{error}</Typography>;
  if (!form) return <LoadingIndicator size="xxl" />;
  if (actionInstanceId) {
    const tagFilterExpression = tagFilter('log.custom', 'EQUALS', actionInstanceId, 'actionInstanceId');
    const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });
    return (
      <Typography variant="body-small">
        <Trans
          i18nKey="in-automation:linkToActionLogs"
          components={{
            // @ts-expect-error
            logsLink: <Link target="_blank" onClick={close} href$={link} />
          }}
        />
      </Typography>
    );
  }
  return (
    <HorizontalFlexWrapper className={locals.alignStretch}>
      <div className={locals.borderRight}>
        <DescriptionList>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-automation:description')}
          >
            {action.description}
          </DescriptionItem>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-automation:titleActionType')}
          >
            {getType(action.type)}
          </DescriptionItem>
        </DescriptionList>
        {isScript(action.type) && <ScriptActionContent action={action} />}
        {isWebhook(action.type) && <WebhookActionContent action={action} />}
        <AgentSelection form={form} volatileId={volatileId} setForm={setForm} agentSnapShots={agentSnapShots} />
        <Typography variant="body-small">{t('in-automation:actionCannotBeUndone')}</Typography>
      </div>
      <Spacer horizontal="normal" />
      <Col className={locals.parameterContainer} lg={4}>
        <DescriptionList>
          <DescriptionItem
            className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
            title={t('in-automation:parameters')}
          >
            <ParameterInput
              errorResolvingDynamicParameters={errorResolvingDynamicParameters}
              action={action}
              form={form}
              setForm={setForm}
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
  volatileId
}: Pick<RunActionDialogContentProps, 'form' | 'setForm' | 'agentSnapShots' | 'volatileId'>) {
  const targetAgent = form?.get('targetAgent') as Field<string> | undefined;
  return (
    <>
      {targetAgent?.map(field => (
        <FormGroup>
          <Label htmlFor="target-agent" hasError={!field.valid && field.touched}>
            {t('in-automation:targetAgent')}
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
                {t('in-automation:pleaseSelect')}
              </option>
              {agentSnapShots?.data?.online?.map(agent => {
                const hostname = agent.data?.hostname;
                const label =
                  agent.volatileId?.host_id === volatileId.host_id
                    ? t('in-automation:triggeringAgent', { hostname })
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
          <HelpText className={locals.subTextFormField}>{t('in-automation:targetAgentDescription')}</HelpText>
        </FormGroup>
      ))}
    </>
  );
}

function ScriptActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const script = getScriptFromFields(action.fields);
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = atob(plaintextScript);
  }
  return (
    <DescriptionList>
      <DescriptionItem
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:titleScriptContent')}
      >
        <Code withExpandButton withoutCopyButton code={plaintextScript} lang={'bash'} softWrap />
      </DescriptionItem>
    </DescriptionList>
  );
}

function WebhookActionContent({ action }: Pick<RunActionDialogContentProps, 'action'>) {
  const { host, method, body, headerParsed, authenParsed } = getWebhookFields(action);
  const headerEntries = Object.entries(headerParsed);
  const authType = AUTH_TYPES.find(a => a.value === authenParsed.type)?.translation;
  return (
    <DescriptionList>
      <DescriptionItem
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

function ParameterInput({
  action,
  form,
  setForm,
  errorResolvingDynamicParameters
}: Pick<RunActionDialogContentProps, 'action' | 'form' | 'setForm' | 'errorResolvingDynamicParameters'>) {
  const { inputParameters } = action;
  if (!inputParameters || inputParameters.filter(parameter => !parameter.hidden).length === 0) {
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
        if (parameter.hidden) return;
        if (parameter.type === 'vault') {
          return <VaultParameterInput key={parameter.name} form={form} parameter={parameter} setForm={setForm} />;
        } else if (parameter.type === 'dynamic') {
          return <DynamicParameterInput key={parameter.name} form={form} parameter={parameter} setForm={setForm} />;
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

function DynamicParameterInput({ parameter, form, setForm }: ParameterInputParams) {
  const parametersForm = form?.get('parameters') as MapForm<any> | undefined;
  const parameterField = parametersForm?.get(parameter.name) as Field<string> | undefined;

  const parsedDynamicValue: DynamicFieldValue = (raw => {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  })(parameter.value ?? '{}');
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
          <TagBasedPayloadConfigurator value={toViewModel(parsedDynamicValue)} disabled />
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
        </FormGroup>
      )}
      <Spacer vertical="medium" />
    </>
  );
}
