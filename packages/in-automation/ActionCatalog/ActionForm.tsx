/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, useContext } from 'react';
import { Field, MapForm } from 'formalistic';

import { Link, Spacer, Typography } from '@instana/components';
import { Toggle } from '@instana/legacy';

import {
  putApiKeyFields,
  putBasicFields,
  putBearerField,
  putDocLinkField,
  putScriptField,
  putWebhookFields,
  putManualField,
  removeApiKeyFields,
  removeBasicFields,
  removeBearerField,
  removeDocLinkField,
  removeManualContentField,
  removeScriptField,
  removeWebhookFields,
  removeGithubFields,
  removeGitlabFields,
  removeJiraFields,
  putGithubFields,
  putGithubOpenTicketFields,
  putGithubCloseTicketFields,
  putGithubCommentTicketFields,
  removeGithubOpenTicketFields,
  removeCloseAndCommentTicketFields,
  putGitlabFields,
  removeGitlabOpenTicketFields,
  putGitlabOpenTicketFields,
  putGitlabCloseTicketFields,
  putGitlabCommentTicketFields,
  putJiraFields,
  removeJiraOpenTicketFields,
  putJiraOpenTicketFields,
  putJiraCloseTicketFields,
  putJiraCommentTicketFields,
  createTicketIdParameter
} from 'in-automation/ActionCatalog/ActionFormDefinition';
import {
  API_KEY,
  AUTH_TYPES,
  BASIC_AUTH,
  BEARER_TOKEN,
  DOC_LINK_TYPE,
  GITHUB_TYPE,
  HTTP_METHODS,
  HTTP_METHODS_WITH_BODY,
  isDocLink,
  isScript,
  isWebhook,
  NO_AUTH,
  SCRIPT_TYPE,
  WEBHOOK_TYPE,
  getType,
  MANUAL_TYPE,
  isManual,
  isAnsible,
  getAnsibleFields,
  isGithub,
  isGitlab,
  isJira,
  GH_TICKET_TYPES,
  OPEN,
  CLOSE,
  ADD_COMMENT,
  doesParameterExist,
  GL_ISSUE_TYPES,
  GITLAB_TYPE,
  JIRA_TYPE,
  JIRA_ISSUE_TYPES,
  getHelpTextType,
  JIRA_OPERATIONS
} from 'in-automation/ActionCatalog/shared';
import SmartAlertsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/SmartAlertsSelection';
import EventsSelection from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/EventsSelection';
import { ActionFormEntity, isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import AdditionalHeadersTable from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import SectionHeading from 'in-settings/components/SectionHeading';
import FieldsTable from 'in-automation/ActionCatalog/FieldsTable';
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
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ActionForm.mless';

interface ActionFormProps {
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  entity: ActionFormEntity;
  setForm: SetFormFunction;
  isCreate: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  close?: boolean;
}

export default function ActionForm({ form, setForm, onChange, entity: action, isCreate }: ActionFormProps) {
  const type = (form.get('type') as Field<string>).value;
  const showTimeoutSection = isScript(type) || isWebhook(type) || isAnsible(type);
  return (
    <fieldset>
      <Row>
        <Col lg={8}>
          <SectionHeading>{t('in-automation:ActionCatalog.1ActionDetails')}</SectionHeading>
          <MetaDataSection form={form} setForm={setForm} onChange={onChange} />
          <SectionHeading>{t('in-automation:ActionCatalog.2ActionConfiguration')}</SectionHeading>
          <TypeSection form={form} onChange={onChange} entity={action} isCreate={isCreate} />
          {isDocLink(type) && <DocLinkSection form={form} onChange={onChange} />}
          {isScript(type) && <ScriptSection form={form} onChange={onChange} />}
          {isWebhook(type) && <WebhookSection setForm={setForm} form={form} onChange={onChange} entity={action} />}
          {isAnsible(type) && <AnsibleSection entity={action} />}
          {isGithub(type) && <GithubSection form={form} onChange={onChange} setForm={setForm} entity={action} />}
          {isGitlab(type) && <GitlabSection form={form} onChange={onChange} setForm={setForm} entity={action} />}
          {isJira(type) && <JiraSection form={form} onChange={onChange} setForm={setForm} entity={action} />}
          {isManual(type) && <ManualSection form={form} onChange={onChange} />}
          {showTimeoutSection && (
            <>
              <TimeoutSection form={form} onChange={onChange} />
            </>
          )}
          {!isDocLink(type) && !isManual(type) && (
            <>
              <SectionHeading>{t('in-automation:ActionCatalog.3ParamaterDetails')}</SectionHeading>
              <FormGroup>
                <ParametersTable form={form} setForm={setForm} onChange={onChange} />
              </FormGroup>
            </>
          )}
          {role?.canConfigureEventsAndAlerts && (
            <>
              <SectionHeading>
                {showTimeoutSection ? 4 : 3}. {t('in-automation:ActionCatalog.ActionAssociationsForEvent')}
              </SectionHeading>
              <EventsSelection form={form} setForm={setForm} />
            </>
          )}
          {role?.canConfigureApplicationSmartAlerts && (
            <>
              <SectionHeading>
                {showTimeoutSection ? 5 : 4}. {t('in-automation:ActionCatalog.ActionAssociationsForSmartAlert')}
              </SectionHeading>
              <SmartAlertsSelection form={form} setForm={setForm} isAutomation />
            </>
          )}
        </Col>
      </Row>
    </fieldset>
  );
}

const TimeoutSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const timeout = form.get('timeout') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);
  const type = (form.get('type') as Field<string>).value;
  return (
    <>
      {timeout.map(field => (
        <FormGroup>
          <Label htmlFor="action-timeout" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.timeout')}
          </Label>
          <Input
            id="action-timeout"
            type="number"
            // NOTE: Timeout is a special field we want to allow to be editable for Ansible actions
            disabled={isNotEditable && !isAnsible(type)}
            value={isNaN(parseInt(field.value)) ? '' : field.value}
            onChange={e => onChange('timeout', e.target.value)}
            hasError={!field.valid && field.touched}
            min="1"
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.timeoutHelpText')}</HelpText>
        </FormGroup>
      ))}
    </>
  );
};
const MetaDataSection = ({ form, setForm, onChange }: Pick<ActionFormProps, 'form' | 'setForm' | 'onChange'>) => {
  const name = form.get('name') as Field<string>;
  const description = form.get('description') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      {name.map(field => (
        <FormGroup>
          <Label htmlFor="action-name" hasError={!field.valid && field.touched}>
            {t('in-automation:name')}
          </Label>
          <Input
            id="action-name"
            type="text"
            disabled={isNotEditable}
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
            {t('in-automation:description')}
          </Label>
          <TextArea
            id="action-description"
            value={field.value}
            readOnly={isNotEditable}
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
  const isNotEditable = useContext(isNotEditableContext);

  return type.map(field => (
    <FormGroup>
      <Label htmlFor="action-type" hasError={!field.valid && field.touched}>
        {t('in-automation:type')}
      </Label>
      {isCreate && !isNotEditable ? (
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
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putDocLinkField(updatedForm, action);
                } else if (isScript(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putScriptField(updatedForm, action);
                } else if (isWebhook(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putWebhookFields(updatedForm, action);
                } else if (isManual(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = putManualField(updatedForm, action);
                } else if (isGithub(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putGithubFields(updatedForm, action);
                } else if (isGitlab(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = removeJiraFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putGitlabFields(updatedForm, action);
                } else if (isJira(type)) {
                  updatedForm = removeDocLinkField(updatedForm);
                  updatedForm = removeScriptField(updatedForm);
                  updatedForm = removeWebhookFields(updatedForm);
                  updatedForm = removeGithubFields(updatedForm);
                  updatedForm = removeGitlabFields(updatedForm);
                  updatedForm = removeManualContentField(updatedForm);
                  updatedForm = putJiraFields(updatedForm, action);
                }
                return updatedForm;
              })
            }
            hasError={!field.valid && field.touched}
          >
            <option value={DOC_LINK_TYPE}>{t('in-automation:ActionCatalog.docLink')}</option>
            <option value={SCRIPT_TYPE}>{t('in-automation:ActionCatalog.script')}</option>
            <option value={WEBHOOK_TYPE}>{t('in-automation:ActionCatalog.http')}</option>
            <option value={MANUAL_TYPE}>{t('in-automation:ActionCatalog.manual')}</option>
            <option value={GITHUB_TYPE}>{t('in-automation:ActionCatalog.github')}</option>
            <option value={GITLAB_TYPE}>{t('in-automation:ActionCatalog.gitlab')}</option>
            <option value={JIRA_TYPE}>{t('in-automation:ActionCatalog.jira')}</option>
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{getHelpTextType(type.value)}</HelpText>
        </>
      ) : (
        <Typography variant="body-regular">{getType(action.type)}</Typography>
      )}
    </FormGroup>
  ));
};

const DocLinkSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const docLink = form.get('docLink') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return docLink.map(field => (
    <FormGroup>
      <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.docLink')}
      </Label>
      <Input
        id="action-docLink"
        type="text"
        value={field.value}
        disabled={isNotEditable}
        onChange={e => onChange('docLink', e.target.value)}
        hasError={!field.valid && field.touched}
        maxLength={256}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.docLinkDescription')}</HelpText>
    </FormGroup>
  ));
};

const ManualSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const manualContent = form.get('manualContent') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);
  return manualContent.map(field => (
    <FormGroup>
      <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.content')}
      </Label>
      <Code
        lineNumbers
        readOnly={isNotEditable}
        mode={'markdown'}
        value={field.value}
        onChange={value => onChange('manualContent', value)}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>
        {t('in-automation:ActionCatalog.manualContentDescription')}
      </HelpText>
    </FormGroup>
  ));
};

const ScriptSection = ({ form, onChange }: Pick<ActionFormProps, 'form' | 'onChange'>) => {
  const script = form.get('script') as Field<string>;
  const subtype = form.get('subtype') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      {subtype.map(field => (
        <FormGroup>
          <Label htmlFor="action-subtype" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.interpreter')}
          </Label>
          <Input
            id="action-subtype"
            type="text"
            disabled={isNotEditable}
            value={field.value}
            onChange={e => onChange('subtype', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.interpreterHelper')}</HelpText>
        </FormGroup>
      ))}
      {script.map(field => (
        <FormGroup>
          <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
            {t('in-automation:ActionCatalog.script')}
          </Label>
          <Code
            readOnly={isNotEditable}
            lineNumbers
            mode={'shell'}
            value={field.value}
            onChange={value => onChange('script', value)}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
        </FormGroup>
      ))}
    </>
  );
};

const GithubSection = ({
  form,
  onChange,
  setForm,
  entity: action
}: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm' | 'entity'>) => {
  const owner = form.get('owner') as Field<string>;
  const repo = form.get('repo') as Field<string>;
  const ticketActionType = form.get('ticketActionType') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);
  let parameters = (form.get('parameters') as Field<MappedParameter[]>).value;

  return (
    <>
      <Row>
        <Col lg={5}>
          {owner.map(field => (
            <FormGroup>
              <Label htmlFor="github-owner" hasError={!field.valid && field.touched}>
                {t('in-automation:owner')}
              </Label>
              <Input
                id="github-owner"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('owner', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={5}>
          {repo.map(field => (
            <FormGroup>
              <Label htmlFor="github-repo" hasError={!field.valid && field.touched}>
                {t('in-automation:repo')}
              </Label>
              <Input
                id="github-repo"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('repo', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={2}>
          {ticketActionType.map(field => (
            <FormGroup>
              <Label htmlFor="github-ticket-type" hasError={!field.valid && field.touched}>
                {t('in-automation:operation')}
              </Label>
              <Select
                id="github-ticket-type"
                value={field.value}
                disabled={isNotEditable}
                onChange={e =>
                  onChange('ticketActionType', e.target.value, updatedForm => {
                    const type = (updatedForm.get('ticketActionType') as Field<string>).value;
                    if (type == OPEN) {
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGithubOpenTicketFields(updatedForm, action);
                    } else if (type == CLOSE) {
                      updatedForm = removeGithubOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGithubCloseTicketFields(updatedForm, action);
                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Issue', 'Github issue id'));
                      }
                      onChange('parameters', parameters);
                    } else if (type == ADD_COMMENT) {
                      updatedForm = removeGithubOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGithubCommentTicketFields(updatedForm, action);

                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Issue', 'Github issue id'));
                      }
                      onChange('parameters', parameters);
                    }
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {GH_TICKET_TYPES.map(({ value, translation }) => (
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
      {ticketActionType.value === OPEN && <GithubOpenSection form={form} onChange={onChange} setForm={setForm} />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection form={form} onChange={onChange} close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection form={form} onChange={onChange} />}
    </>
  );
};

const GithubOpenSection = ({ form, onChange, setForm }: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm'>) => {
  const title = form.get('title') as Field<string>;
  const body = form.get('body') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      <Row>
        <Col lg={12}>
          {title.map(field => (
            <FormGroup>
              <Label htmlFor="github-title" hasError={!field.valid && field.touched}>
                {t('in-automation:title')}
              </Label>
              <Input
                id="github-title"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('title', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.gitTitleHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {body.map(field => (
            <FormGroup>
              <Label htmlFor="github-body" hasError={!field.valid && field.touched}>
                {t('in-automation:ActionCatalog.githubBody')}
              </Label>
              <TextArea
                id="github-body"
                value={field.value}
                rows={15}
                disabled={isNotEditable}
                onChange={e => onChange('body', (e.target as HTMLTextAreaElement).value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.gitBodyHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <FormGroup>
        <FieldsTable
          form={form}
          setForm={setForm}
          onChange={onChange}
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>

      <FormGroup>
        <FieldsTable
          form={form}
          setForm={setForm}
          onChange={onChange}
          label={t('in-automation:assignees')}
          fieldName="assignees"
          customAddRowLabel={t('in-automation:ActionCatalog.addAssignees')}
          noDataMessage={t('in-automation:ActionCatalog.noAssigneesConfigured')}
        />
      </FormGroup>
    </>
  );
};

const TicketCloseAndCommentSection = ({
  form,
  onChange,
  close = false
}: Pick<ActionFormProps, 'form' | 'onChange' | 'close'>) => {
  const comment = form.get('comment') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      {comment.map(field => (
        <FormGroup>
          <Label htmlFor="ticket-comment" hasError={!field.valid && field.touched}>
            {close ? t('in-automation:ActionCatalog.commentOptional') : t('in-automation:comment')}
          </Label>
          <TextArea
            id="ticket-comment"
            value={field.value}
            disabled={isNotEditable}
            onChange={e => onChange('comment', (e.target as HTMLTextAreaElement).value)}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
        </FormGroup>
      ))}
    </>
  );
};

const GitlabSection = ({
  form,
  onChange,
  setForm,
  entity: action
}: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm' | 'entity'>) => {
  const projectId = form.get('projectId') as Field<string>;
  const ticketActionType = form.get('ticketActionType') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);
  let parameters = (form.get('parameters') as Field<MappedParameter[]>).value;

  return (
    <>
      <Row>
        <Col lg={8}>
          {projectId.map(field => (
            <FormGroup>
              <Label htmlFor="gitlab-projectId" hasError={!field.valid && field.touched}>
                {t('in-automation:projectId')}
              </Label>
              <Input
                id="gitlab-projectId"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('projectId', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={4}>
          {ticketActionType.map(field => (
            <FormGroup>
              <Label htmlFor="github-ticket-type" hasError={!field.valid && field.touched}>
                {t('in-automation:operation')}
              </Label>
              <Select
                id="github-ticket-type"
                value={field.value}
                disabled={isNotEditable}
                onChange={e =>
                  onChange('ticketActionType', e.target.value, updatedForm => {
                    const type = (updatedForm.get('ticketActionType') as Field<string>).value;
                    if (type == OPEN) {
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGitlabOpenTicketFields(updatedForm, action);
                    } else if (type == CLOSE) {
                      updatedForm = removeGitlabOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGitlabCloseTicketFields(updatedForm, action);
                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Issue', 'Gitlab issue id'));
                      }
                      onChange('parameters', parameters);
                    } else if (type == ADD_COMMENT) {
                      updatedForm = removeGitlabOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putGitlabCommentTicketFields(updatedForm, action);

                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Issue', 'Gitlab issue id'));
                      }
                      onChange('parameters', parameters);
                    }
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {GH_TICKET_TYPES.map(({ value, translation }) => (
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
      {ticketActionType.value === OPEN && <GitlabOpenSection form={form} onChange={onChange} setForm={setForm} />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection form={form} onChange={onChange} close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection form={form} onChange={onChange} />}
    </>
  );
};

const GitlabOpenSection = ({ form, onChange, setForm }: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm'>) => {
  const title = form.get('title') as Field<string>;
  const body = form.get('body') as Field<string>;
  const issue_type = form.get('issue_type') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      <Row>
        <Col lg={12}>
          {title.map(field => (
            <FormGroup>
              <Label htmlFor="gitlab-title" hasError={!field.valid && field.touched}>
                {t('in-automation:title')}
              </Label>
              <Input
                id="gitlab-title"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('title', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.gitTitleHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {body.map(field => (
            <FormGroup>
              <Label htmlFor="gitlab-description" hasError={!field.valid && field.touched}>
                {t('in-automation:description')}
              </Label>
              <TextArea
                id="gitlab-description"
                value={field.value}
                rows={15}
                disabled={isNotEditable}
                onChange={e => onChange('body', (e.target as HTMLTextAreaElement).value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.gitBodyHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <FormGroup>
        <FieldsTable
          form={form}
          setForm={setForm}
          onChange={onChange}
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>

      <FormGroup>
        {issue_type.map(field => (
          <FormGroup>
            <Label htmlFor="gitlab-issue-type" hasError={!field.valid && field.touched}>
              {t('in-automation:issueType')}
            </Label>
            <Select
              id="gitlab-issue-type"
              value={field.value}
              disabled={isNotEditable}
              onChange={e => onChange('issue_type', e.target.value)}
              hasError={!field.valid && field.touched}
            >
              {GL_ISSUE_TYPES.map(({ value, translation }) => (
                <option key={value} value={value}>
                  {translation}
                </option>
              ))}
            </Select>
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </FormGroup>
    </>
  );
};

const JiraSection = ({
  form,
  onChange,
  setForm,
  entity: action
}: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm' | 'entity'>) => {
  const project = form.get('project') as Field<string>;
  const ticketActionType = form.get('ticketActionType') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);
  let parameters = (form.get('parameters') as Field<MappedParameter[]>).value;

  return (
    <>
      <Row>
        <Col lg={8}>
          {project.map(field => (
            <FormGroup>
              <Label htmlFor="jira-project" hasError={!field.valid && field.touched}>
                {t('in-automation:project')}
              </Label>
              <Input
                id="jira-project"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('project', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={4}>
          {ticketActionType.map(field => (
            <FormGroup>
              <Label htmlFor="jira-ticket-type" hasError={!field.valid && field.touched}>
                {t('in-automation:operation')}
              </Label>
              <Select
                id="jira-ticket-type"
                value={field.value}
                disabled={isNotEditable}
                onChange={e =>
                  onChange('ticketActionType', e.target.value, updatedForm => {
                    const type = (updatedForm.get('ticketActionType') as Field<string>).value;
                    if (type == OPEN) {
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putJiraOpenTicketFields(updatedForm, action);
                    } else if (type == CLOSE) {
                      updatedForm = removeJiraOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putJiraCloseTicketFields(updatedForm, action);
                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Task', 'Jira task id'));
                      }
                      onChange('parameters', parameters);
                    } else if (type == ADD_COMMENT) {
                      updatedForm = removeJiraOpenTicketFields(updatedForm);
                      updatedForm = removeCloseAndCommentTicketFields(updatedForm);
                      updatedForm = putJiraCommentTicketFields(updatedForm, action);

                      if (!doesParameterExist(parameters, 'id')) {
                        parameters.push(createTicketIdParameter('Task', 'Jira task id'));
                      }
                      onChange('parameters', parameters);
                    }
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {JIRA_OPERATIONS.map(({ value, translation }) => (
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
      {ticketActionType.value === OPEN && <JiraOpenSection form={form} onChange={onChange} setForm={setForm} />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection form={form} onChange={onChange} close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection form={form} onChange={onChange} />}
    </>
  );
};

const JiraOpenSection = ({ form, onChange, setForm }: Pick<ActionFormProps, 'form' | 'onChange' | 'setForm'>) => {
  const summary = form.get('summary') as Field<string>;
  const body = form.get('body') as Field<string>;
  const assignee = form.get('assignee') as Field<string>;
  const issue_type = form.get('issue_type') as Field<string>;
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <>
      <Row>
        <Col lg={12}>
          {summary.map(field => (
            <FormGroup>
              <Label htmlFor="jira-summary" hasError={!field.valid && field.touched}>
                {t('in-automation:title')}
              </Label>
              <Input
                id="jira-summary"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('summary', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.jiraTitleHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          {body.map(field => (
            <FormGroup>
              <Label htmlFor="jira-description" hasError={!field.valid && field.touched}>
                {t('in-automation:description')}
              </Label>
              <TextArea
                id="jira-description"
                value={field.value}
                rows={15}
                disabled={isNotEditable}
                onChange={e => onChange('body', (e.target as HTMLTextAreaElement).value)}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-automation:ActionCatalog.jiraBodyHelptext')}
              </HelpText>
            </FormGroup>
          ))}
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          {assignee.map(field => (
            <FormGroup>
              <Label htmlFor="jira-assignee" hasError={!field.valid && field.touched}>
                {t('in-automation:assignee')}
              </Label>
              <Input
                id="jira-assignee"
                type="text"
                disabled={isNotEditable}
                value={field.value}
                onChange={e => onChange('assignee', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
        <Col lg={6}>
          <FormGroup>
            {issue_type.map(field => (
              <FormGroup>
                <Label htmlFor="jira-issue-type" hasError={!field.valid && field.touched}>
                  {t('in-automation:issueType')}
                </Label>
                <Select
                  id="jira-issue-type"
                  value={field.value}
                  disabled={isNotEditable}
                  onChange={e => onChange('issue_type', e.target.value)}
                  hasError={!field.valid && field.touched}
                >
                  {JIRA_ISSUE_TYPES.map(({ value, translation }) => (
                    <option key={value} value={value}>
                      {translation}
                    </option>
                  ))}
                </Select>
                <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              </FormGroup>
            ))}
          </FormGroup>
        </Col>
      </Row>

      <FormGroup>
        <FieldsTable
          form={form}
          setForm={setForm}
          onChange={onChange}
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>
    </>
  );
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

  const isNotEditable = useContext(isNotEditableContext);

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
                disabled={isNotEditable}
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
                disabled={isNotEditable}
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
                disabled={isNotEditable}
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
                disabled={isNotEditable}
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
              <Toggle
                disabled={isNotEditable}
                checked={field.value}
                onChange={e => onChange('ignoreCertErrors', e.target.checked)}
              />
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
                disabled={isNotEditable}
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
                disabled={isNotEditable}
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
                disabled={isNotEditable}
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
  const isNotEditable = useContext(isNotEditableContext);

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
              disabled={isNotEditable}
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
  const isNotEditable = useContext(isNotEditableContext);

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
              disabled={isNotEditable}
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
              {t('in-automation:value')}
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
              disabled={isNotEditable}
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
  const isNotEditable = useContext(isNotEditableContext);

  return (
    <HorizontalFlexWrapper>
      <Input
        className={locals.width100}
        id="action-password"
        type={showPassword ? 'text' : 'password'}
        disabled={isNotEditable}
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

const AnsibleSection = ({ entity }: Pick<ActionFormProps, 'entity'>) => {
  const { jobTemplateUrl } = getAnsibleFields(entity);
  return (
    <>
      <FormGroup className={locals.widthFitContent}>
        <Label>{t('in-automation:jobTemplate')}</Label>
        <Link external href={jobTemplateUrl}>
          {entity.name}
        </Link>
      </FormGroup>
    </>
  );
};
