/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Spacer, Toggle, Typography } from '@instana/components';

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
} from 'in-automation/ActionCatalog/ActionFormDefinition';
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
  WEBHOOK_TYPE,
  getType
} from 'in-automation/ActionCatalog/shared';
import SmartAlertsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/SmartAlertsSelection';
import EventsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/EventsSelection';
import AdditionalHeadersTable from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import TagsTable from 'in-automation/ActionCatalog/TagsTable';
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
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  entity: ActionFormEntity;
  setForm: SetFormFunction;
  isCreate: boolean;
}

export default function ActionForm({ form, setForm, onChange, entity: action, isCreate }: ActionFormProps) {
  const type = (form.get('type') as Field<string>).value;
  return (
    <fieldset>
      <SectionHeading>{t('in-automation:ActionCatalog.1ActionDetails')}</SectionHeading>
      <Row>
        <Col lg={8}>
          <>
            <MetaDataSection form={form} setForm={setForm} onChange={onChange} />
            <SectionHeading>{t('in-automation:ActionCatalog.2ActionConfiguration')}</SectionHeading>
            <TypeSection form={form} onChange={onChange} entity={action} isCreate={isCreate} />
            {isDocLink(type) && <DocLinkSection form={form} onChange={onChange} />}
            {isScript(type) && <ScriptSection form={form} onChange={onChange} />}
            {isWebhook(type) && <WebhookSection setForm={setForm} form={form} onChange={onChange} entity={action} />}
            {!isDocLink(type) && (
              <>
                <SectionHeading>{t('in-automation:ActionCatalog.3ParamaterDetails')}</SectionHeading>
                <FormGroup>
                  <ParametersTable form={form} setForm={setForm} onChange={onChange} />
                </FormGroup>
              </>
            )}
          </>
          <SectionHeading>{t('in-automation:ActionCatalog.ActionAssociationsForEvent')}</SectionHeading>
          <EventsSelection form={form} setForm={setForm} />
          <SectionHeading>{t('in-automation:ActionCatalog.ActionAssociationsForSmartAlert')}</SectionHeading>
          <SmartAlertsSelection form={form} setForm={setForm} isAutomation />
        </Col>
      </Row>
    </fieldset>
  );
}

const MetaDataSection = ({ form, setForm, onChange }: Pick<ActionFormProps, 'form' | 'setForm' | 'onChange'>) => {
  const name = form.get('name') as Field<string>;
  const description = form.get('description') as Field<string>;
  return (
    <>
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="action-name" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.name')}
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
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:ActionCatalog.showsUpInTheListOfActions')}
          </HelpText>
        </FormGroup>
      ))}
      {description.map(field => (
        <FormGroup>
          <Label htmlFor="action-description" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.description')}
          </Label>
          <TextArea
            id="action-description"
            value={field.value}
            onChange={e => onChange('description', (e.target as HTMLTextAreaElement).value)}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:ActionCatalog.showsUpInTheActionDescription')}
          </HelpText>
        </FormGroup>
      ))}
      <FormGroup>
        <TagsTable form={form} setForm={setForm} onChange={onChange} />
      </FormGroup>
    </>
  );
};

const TypeSection = ({
  form,
  onChange,
  entity: action,
  isCreate
}: Pick<ActionFormProps, 'form' | 'onChange' | 'entity' | 'isCreate'>) => {
  const type = form.get('type') as Field<string>;

  return type.map(field => (
    <FormGroup>
      <Label htmlFor="action-type" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.type')}
      </Label>
      {isCreate ? (
        <>
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
            <option value={DOC_LINK_TYPE}>{t('in-automation:ActionCatalog.docLink')}</option>
            <option value={SCRIPT_TYPE}>{t('in-automation:ActionCatalog.script')}</option>
            <option value={WEBHOOK_TYPE}>{t('in-automation:ActionCatalog.http')}</option>
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.actionTypeHelper')}</HelpText>
        </>
      ) : (
        <Typography variant="body-small">{getType(action)}</Typography>
      )}
    </FormGroup>
  ));
};

const DocLinkSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const docLink = form.get('docLink') as Field<string>;
  return docLink.map(field => (
    <FormGroup>
      <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.docLink')}
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
      <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.docLinkDescription')}</HelpText>
    </FormGroup>
  ));
};

const ScriptSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const script = form.get('script') as Field<string>;
  return script.map(field => (
    <FormGroup>
      <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.script')}
      </Label>
      <Code lineNumbers mode={'shell'} value={field.value} onChange={value => onChange('script', value)} />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
    </FormGroup>
  ));
};

const WebhookSection = ({
  form,
  setForm,
  onChange,
  entity: action
}: Pick<ActionFormProps, 'form' | 'setForm' | 'onChange' | 'entity'>) => {
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
                {t('in-automation:ActionCatalog.host')}
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
                {t('in-automation:ActionCatalog.method')}
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
                {t('in-automation:ActionCatalog.contentType')}
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
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.contentTypeDescription')}
              </HelpText>
            </FormGroup>
          ))}
          {body.map(field => (
            <FormGroup>
              <Label htmlFor="action-body" hasError={!field.valid && field.touched}>
                {t('in-automation:ActionCatalog.body')}
              </Label>
              <TextArea
                id="action-body"
                value={field.value}
                onChange={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => onChange('body', target.value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.bodyDescription')}
              </HelpText>
            </FormGroup>
          ))}
        </>
      )}
      <Row>
        <Col lg={6}>
          {ignoreCertErrors.map(field => (
            <FormGroup>
              <Label htmlFor="action-ignoreCertErrors" hasError={!field.valid && field.touched}>
                {t('in-automation:ActionCatalog.ignoreCertErrors')}
              </Label>
              <Toggle checked={field.value} onChange={e => onChange('ignoreCertErrors', e.target.checked)} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {authType.map(field => (
            <FormGroup>
              <Label htmlFor="action-authType" hasError={!field.valid && field.touched}>
                {t('in-automation:ActionCatalog.authType')}
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
                {t('in-automation:ActionCatalog.accept')}
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
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.acceptDescription')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          {acceptLanguage.map(field => (
            <FormGroup>
              <Label htmlFor="action-acceptLanguage" hasError={!field.valid && field.touched}>
                {t('in-automation:ActionCatalog.acceptLanguage')}
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
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.acceptLanguageDescription')}
              </HelpText>
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
              {t('in-automation:ActionCatalog.username')}
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
              {t('in-automation:ActionCatalog.password')}
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
              {t('in-automation:ActionCatalog.bearerToken')}
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
              {t('in-automation:ActionCatalog.key')}
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
              {t('in-automation:ActionCatalog.value')}
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
              {t('in-automation:ActionCatalog.apiKeyAddTo')}
            </Label>
            <Select
              id="action-apiKeyAddTo"
              value={field.value}
              onChange={e => onChange('apiKeyAddTo', e.target.value)}
              hasError={!field.valid && field.touched}
            >
              <option value="header">{t('in-automation:ActionCatalog.header')}</option>
              <option value="query">{t('in-automation:ActionCatalog.queryParams')}</option>
            </Select>
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
};

const tooltipTranslation = {
  apiKeyValue: [t('in-automation:ActionCatalog.hideAPIKeyTooltip'), t('in-automation:ActionCatalog.showAPIKeyTooltip')],
  password: [
    t('in-automation:ActionCatalog.hidePasswordTooltip'),
    t('in-automation:ActionCatalog.showPasswordTooltip')
  ],
  bearerToken: [
    t('in-automation:ActionCatalog.hideBeaererTokenTooltip'),
    t('in-automation:ActionCatalog.showBeaererTokenTooltip')
  ]
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
