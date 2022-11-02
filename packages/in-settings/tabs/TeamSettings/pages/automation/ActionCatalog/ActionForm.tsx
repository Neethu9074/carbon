/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { SetStateAction } from 'react';
import { Field, MapForm } from 'formalistic';

import {
  DOC_LINK_TYPE,
  isDocLink,
  isScript,
  isWebhook,
  SCRIPT_TYPE,
  WEBHOOK_TYPE
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import {
  putDocLinkField,
  putScriptField,
  putWebhookFields,
  removeDocLinkField,
  removeScriptField,
  removeWebhookFields
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import TagsTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable';
import AdditionalHeadersTable, {
  Header
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/AdditionalHeadersTable';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { ImmutableNewAction } from 'in-api/automation';
import TextArea from 'in-components/form/TextArea';
import Code from 'in-components/form/Code/Code';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

interface ActionFormProps {
  form: MapForm;
  onChange: Function;
  entity: ImmutableNewAction;
  setForm: (form: MapForm) => SetStateAction<MapForm>;
}

export default function ActionForm({ form, setForm, onChange, entity: action }: ActionFormProps) {
  const type = (form.get('type') as Field<string>).value;
  return (
    <fieldset>
      <SectionHeading>{t('in-settings:tabs.1ActionDetails')}</SectionHeading>
      <Row>
        <Col lg={8}>
          <>
            <MetaDataSection form={form} setForm={setForm} onChange={onChange} entity={action} />
            {isDocLink(type) && <DocLinkSection form={form} onChange={onChange} />}
            {isScript(type) && <ScriptSection form={form} onChange={onChange} />}
            {isWebhook(type) && <WebhookSection setForm={setForm} form={form} onChange={onChange} />}
          </>
        </Col>
      </Row>
    </fieldset>
  );
}

const MetaDataSection = ({ form, setForm, onChange, entity: action }: ActionFormProps) => {
  const name = form.get('name') as Field<string>;
  const description = form.get('description') as Field<string>;
  const type = form.get('type') as Field<string>;
  return (
    <>
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="action-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="action-name"
            type="text"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
            autoFocus
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.showsUpInTheListOfActions')}</HelpText>
        </FormGroup>
      ))}
      {description.map(field => (
        <FormGroup>
          <Label htmlFor="action-description" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.description')}
          </Label>
          <TextArea
            id="action-description"
            value={field.value}
            onChange={e => onChange('description', (e.target as HTMLTextAreaElement).value)}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.showsUpInTheActionDescription')}</HelpText>
        </FormGroup>
      ))}
      {type.map(field => (
        <FormGroup>
          <Label htmlFor="action-type" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.type')}
          </Label>
          <Select
            id="action-type"
            value={field.value}
            onChange={e =>
              onChange('type', e.target.value, (updatedForm: MapForm) => {
                // WILL NEED TO UPDATE THIS FOR NEW TYPES
                const type = (updatedForm.get('type') as Field<string>).value;
                if (isDocLink(type)) {
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = putDocLinkField(updatedForm, action);
                } else if (isScript(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = putScriptField(updatedForm, action);
                } else if (isWebhook(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = putWebhookFields(updatedForm, action);
                }
                return updatedForm;
              })
            }
            hasError={!field.valid && field.touched}
          >
            <option value={DOC_LINK_TYPE}>{t('in-settings:tabs.docLink')}</option>
            <option value={SCRIPT_TYPE}>{t('in-settings:tabs.script')}</option>
            <option value={WEBHOOK_TYPE}>{t('in-settings:tabs.http')}</option>
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.actionTypeHelper')}</HelpText>
        </FormGroup>
      ))}
      <FormGroup>
        <TagsTable form={form} setForm={setForm} onChange={onChange} />
      </FormGroup>
    </>
  );
};

const DocLinkSection = ({ form, onChange }: Omit<ActionFormProps, 'setForm' | 'entity'>) => {
  const docLink = form.get('docLink') as Field<string>;
  return docLink.map(field => (
    <FormGroup>
      <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
        {t('in-settings:tabs.docLink')}
      </Label>
      <Input
        id="action-docLink"
        type="text"
        value={field.value}
        onChange={e => onChange('docLink', e.target.value)}
        hasError={!field.valid && field.touched}
        maxLength={256}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.docLinkDescription')}</HelpText>
    </FormGroup>
  ));
};

const ScriptSection = ({ form, onChange }: Omit<ActionFormProps, 'setForm' | 'entity'>) => {
  const script = form.get('script') as Field<string>;
  return script.map(field => (
    <FormGroup>
      <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
        {t('in-settings:tabs.script')}
      </Label>
      <Code lineNumbers mode={'shell'} value={field.value} onChange={(value: string) => onChange('script', value)} />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.scriptDescription')}</HelpText>
    </FormGroup>
  ));
};

const WebhookSection = ({ form, setForm, onChange }: Omit<ActionFormProps, 'entity'>) => {
  const host = form.get('host') as Field<string>;
  const method = form.get('method') as Field<string>;
  const username = form.get('username') as Field<string>;
  const password = form.get('password') as Field<string>;
  const accept = form.get('accept') as Field<string>;
  const body = form.get('body') as Field<string>;
  const acceptLanguage = form.get('acceptLanguage') as Field<string>;
  const contentType = form.get('contentType') as Field<string>;
  const additionalHeaders = form.get('additionalHeaders') as Field<Header[]>;

  const renderBodyAndContentType = ['PATCH', 'PUT', 'POST'].includes(method.value);
  return (
    <>
      <Row>
        <Col lg={10}>
          {host.map(field => (
            <FormGroup>
              <Label htmlFor="action-host" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.host')}
              </Label>
              <Input
                id="action-host"
                type="text"
                value={field.value}
                onChange={e => onChange('host', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={2}>
          {method.map(field => (
            <FormGroup>
              <Label htmlFor="action-method" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.method')}
              </Label>
              <Select
                id="action-method"
                value={field.value}
                onChange={e => onChange('method', e.target.value)}
                hasError={!field.valid && field.touched}
              >
                <option value={'GET'}>GET</option>
                <option value={'PATCH'}>PATCH</option>
                <option value={'POST'}>POST</option>
                <option value={'PUT'}>PUT</option>
                <option value={'DELETE'}>DELETE</option>
                <option value={'OPTIONS'}>OPTIONS</option>
                <option value={'HEAD'}>HEAD</option>
                <option value={'TRACE'}>TRACE</option>
              </Select>
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
      </Row>
      {renderBodyAndContentType && (
        <>
          {contentType.map(field => (
            <FormGroup>
              <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.contentType')}
              </Label>
              <Input
                id="action-contentType"
                type="text"
                value={field.value}
                onChange={e => onChange('contentType', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.contentTypeDescription')}</HelpText>
            </FormGroup>
          ))}
          {body.map(field => (
            <FormGroup>
              <Label htmlFor="action-body" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.body')}
              </Label>
              <TextArea
                id="action-body"
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => onChange('body', target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.bodyDescription')}</HelpText>
            </FormGroup>
          ))}
        </>
      )}
      <Row>
        <Col lg={6}>
          {username.map(field => (
            <FormGroup>
              <Label htmlFor="action-username" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.usernameOptional')}
              </Label>
              <Input
                id="action-username"
                type="text"
                value={field.value}
                onChange={e => onChange('username', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.webookUsernameDescription')}</HelpText>
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {password.map(field => (
            <FormGroup>
              <Label htmlFor="action-password" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.passwordOptional')}
              </Label>
              <Input
                id="action-password"
                type="text"
                value={field.value}
                onChange={e => onChange('password', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.webookPasswordDescription')}</HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <Row>
        <Col lg={6}>
          {accept.map(field => (
            <FormGroup>
              <Label htmlFor="action-accept" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.accept')}
              </Label>
              <Input
                id="action-accept"
                type="text"
                value={field.value}
                onChange={e => onChange('accept', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.acceptDescription')}</HelpText>
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {acceptLanguage.map(field => (
            <FormGroup>
              <Label htmlFor="action-acceptLanguage" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.acceptLanguage')}
              </Label>
              <Input
                id="action-acceptLanguage"
                type="text"
                value={field.value}
                onChange={e => onChange('acceptLanguage', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.acceptLanguageDescription')}</HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <FormGroup>
        {additionalHeaders.map(field => (
          <>
            <AdditionalHeadersTable field={field} form={form} setForm={setForm} onChange={onChange} />
          </>
        ))}
      </FormGroup>
    </>
  );
};
