/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Spacer, Toggle } from '@instana/components';

import {
  putApiKeyFields,
  putBasicFields,
  putBearerField,
  putDocLinkField,
  putScriptField,
  putWebhookFields,
  removeApiKeyFields,
  removeBasicFields,
  removeBearerField,
  removeDocLinkField,
  removeScriptField,
  removeWebhookFields
} from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import {
  API_KEY,
  AUTH_TYPES,
  BASIC_AUTH,
  BEARER_TOKEN,
  DOC_LINK_TYPE,
  HTTP_METHODS,
  HTTP_METHODS_WITH_BODY,
  isDocLink,
  isScript,
  isWebhook,
  NO_AUTH,
  SCRIPT_TYPE,
  WEBHOOK_TYPE
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import AdditionalHeadersTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/AdditionalHeadersTable';
import ParametersTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ParametersTable';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import TagsTable from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import IconButton from 'in-components/IconButton/IconButton';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import TextArea from 'in-components/form/TextArea';
import Code from 'in-components/form/Code/Code';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

interface ActionFormProps {
  form: MapForm;
  onChange: OnEntityChange<ActionFormEntity>;
  entity: ActionFormEntity;
  setForm: SetFormFunction;
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
            {isWebhook(type) && <WebhookSection setForm={setForm} form={form} onChange={onChange} entity={action} />}
            {!isDocLink(type) && (
              <FormGroup>
                <ParametersTable form={form} setForm={setForm} onChange={onChange} />
              </FormGroup>
            )}
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
              onChange('type', e.target.value, updatedForm => {
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
      <Code lineNumbers mode={'shell'} value={field.value} onChange={value => onChange('script', value)} />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.scriptDescription')}</HelpText>
    </FormGroup>
  ));
};

const WebhookSection = ({ form, setForm, onChange, entity: action }: ActionFormProps) => {
  const host = form.get('host') as Field<string>;
  const method = form.get('method') as Field<string>;
  const accept = form.get('accept') as Field<string>;
  const body = form.get('body') as Field<string>;
  const acceptLanguage = form.get('acceptLanguage') as Field<string>;
  const contentType = form.get('contentType') as Field<string>;
  const ignoreCertErrors = form.get('ignoreCertErrors') as Field<boolean>;
  const authType = form.get('authType') as Field<string>;

  const renderBodyAndContentType = HTTP_METHODS_WITH_BODY.includes(method.value);
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
                {HTTP_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
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
          {ignoreCertErrors.map(field => (
            <FormGroup>
              <Label htmlFor="action-ignoreCertErrors" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.ignoreCertErrors')}
              </Label>
              <Toggle checked={field.value} onChange={e => onChange('ignoreCertErrors', e.target.checked)} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {authType.map(field => (
            <FormGroup>
              <Label htmlFor="action-authType" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.authType')}
              </Label>
              <Select
                id="action-authType"
                value={field.value}
                onChange={e =>
                  onChange('authType', e.target.value, updatedForm => {
                    const authType = (updatedForm.get('authType') as Field<string>).value;
                    if (authType == NO_AUTH) {
                      updatedForm = removeBasicFields(updatedForm);
                      updatedForm = removeBearerField(updatedForm);
                      updatedForm = removeApiKeyFields(updatedForm);
                    } else if (authType == BASIC_AUTH) {
                      updatedForm = putBasicFields(updatedForm, action);
                    } else if (authType == BEARER_TOKEN) {
                      updatedForm = putBearerField(updatedForm, action);
                    } else if (authType == API_KEY) {
                      updatedForm = putApiKeyFields(updatedForm, action);
                    }
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {AUTH_TYPES.map(({ value, translation }) => (
                  <option key={value} value={value}>
                    {translation}
                  </option>
                ))}
              </Select>
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
      </Row>
      {authType.value === BASIC_AUTH && <BasicAuth form={form} onChange={onChange} />}
      {authType.value === BEARER_TOKEN && <BearerAuth form={form} onChange={onChange} />}
      {authType.value === API_KEY && <APIAuth form={form} onChange={onChange} />}
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
        <AdditionalHeadersTable form={form} setForm={setForm} onChange={onChange} />
      </FormGroup>
    </>
  );
};

const BasicAuth = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const username = form.get('username') as Field<string>;
  const password = form.get('password') as Field<string>;
  return (
    <Row>
      <Col lg={6}>
        {username.map(field => (
          <FormGroup>
            <Label htmlFor="action-username" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.username')}
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
          </FormGroup>
        ))}
      </Col>
      <Col lg={6}>
        {password.map(field => (
          <FormGroup>
            <Label htmlFor="action-password" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.password')}
            </Label>
            <SecuredInput form={form} onChange={onChange} fieldKey="password" />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
};

const BearerAuth = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const bearerToken = form.get('bearerToken') as Field<string>;
  return (
    <Row>
      <Col lg={12}>
        {bearerToken.map(field => (
          <FormGroup>
            <Label htmlFor="action-bearerToken" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.bearerToken')}
            </Label>
            <SecuredInput form={form} onChange={onChange} fieldKey="bearerToken" />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
};

const APIAuth = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const apiKey = form.get('apiKey') as Field<string>;
  const apiKeyValue = form.get('apiKeyValue') as Field<string>;
  const apiKeyAddTo = form.get('apiKeyAddTo') as Field<string>;

  return (
    <Row>
      <Col lg={4}>
        {apiKey.map(field => (
          <FormGroup>
            <Label htmlFor="action-apiKey" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.key')}
            </Label>
            <Input
              id="action-apiKey"
              type="text"
              value={field.value}
              onChange={e => onChange('apiKey', e.target.value)}
              hasError={!field.valid && field.touched}
              maxLength={256}
            />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
      <Col lg={6}>
        {apiKeyValue.map(field => (
          <FormGroup>
            <Label htmlFor="action-apiKeyValue" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.value')}
            </Label>
            <SecuredInput form={form} onChange={onChange} fieldKey="apiKeyValue" />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
      <Col lg={2}>
        {apiKeyAddTo.map(field => (
          <FormGroup>
            <Label htmlFor="action-apiKeyAddTo" hasError={!field.valid && field.touched}>
              {t('in-settings:tabs.apiKeyAddTo')}
            </Label>
            <Select
              id="action-apiKeyAddTo"
              value={field.value}
              onChange={e => onChange('apiKeyAddTo', e.target.value)}
              hasError={!field.valid && field.touched}
            >
              <option value="header">{t('in-settings:tabs.header')}</option>
              <option value="query">{t('in-settings:tabs.queryParams')}</option>
            </Select>
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
};

const tooltipTranslation = {
  apiKeyValue: [t('in-settings:tabs.hideAPIKeyTooltip'), t('in-settings:tabs.showAPIKeyTooltip')],
  password: [t('in-settings:tabs.hidePasswordTooltip'), t('in-settings:tabs.showPasswordTooltip')],
  bearerToken: [t('in-settings:tabs.hideBeaererTokenTooltip'), t('in-settings:tabs.showBeaererTokenTooltip')]
} as const;

const SecuredInput = ({
  form,
  onChange,
  fieldKey
}: Pick<ActionFormProps, 'form' | 'onChange'> & { fieldKey: keyof typeof tooltipTranslation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const field = form.get(fieldKey) as Field<string>;
  return (
    <HorizontalFlexWrapper>
      <Input
        className={locals.width100}
        id="action-password"
        type={showPassword ? 'text' : 'password'}
        placeholder={'*******************'}
        value={field.value}
        onChange={e => onChange(fieldKey, e.target.value)}
        hasError={!field.valid && field.touched}
        maxLength={256}
      />
      <Spacer horizontal="xsmall" />
      <Tooltip content={showPassword ? tooltipTranslation[fieldKey][0] : tooltipTranslation[fieldKey][1]}>
        <IconButton
          buttonType="button"
          kind="info"
          type={showPassword ? 'lib_views_hide' : 'lib_views_show'}
          onClick={() => {
            setShowPassword(showPassword => !showPassword);
          }}
          iconSize="xs"
          alignment="right"
        />
      </Tooltip>
    </HorizontalFlexWrapper>
  );
};
