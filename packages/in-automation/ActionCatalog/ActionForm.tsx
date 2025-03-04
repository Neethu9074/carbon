/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { Link, Typography, Toggle, TextArea, Select, FormGroup, CarbonNumberInput } from '@instana/components';
import { ActionType, Result } from '@instana/types';

import {
  ACTION_TYPE,
  ACTION_TYPES,
  HTTP_METHODS,
  HTTP_METHODS_WITH_BODY,
  NON_CREATABLE_ACTION_TYPES,
  AUTH_TYPES,
  GIT_OPERATIONS,
  OPEN,
  CLOSE,
  ADD_COMMENT,
  GL_ISSUE_TYPES,
  JIRA_ISSUE_TYPES,
  JIRA_OPERATIONS,
  ACTION_TRANSLATIONS,
  AUTH_TRANSLATIONS,
  AUTH_TYPE
} from 'in-automation/constants';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import useActionDetailsUrlParams from 'in-automation/ActionCatalog/useActionDetailsUrlParams';
import { createTicketIdParameter } from 'in-automation/ActionCatalog/useActionForm/utils';
import AdditionalHeadersTable from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { getAnsibleFields } from 'in-automation/utils/actionField';
import SectionHeading from 'in-settings/components/SectionHeading';
import FieldsTable from 'in-automation/ActionCatalog/FieldsTable';
import CreatableTagSelect from 'in-components/CreatableTagSelect';
import ScrollStep from 'in-components/StepsContainer/ScrollStep';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { ActionFilter, AuthenType } from 'in-automation/types';
import useActionTags from 'in-automation/hooks/useActionTags';
import HelpText from 'in-components/form/HelpText/HelpText';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { isLoading } from 'in-services/util/result';
import Code from 'in-components/form/Code/Code';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Action.mless';

export function ActionFormBody({
  action,
  actionFilter
}: {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}) {
  const { form } = useActionFormContext();
  const type = form.get('type').value;

  const showTimeoutSection = [ACTION_TYPE.SCRIPT, ACTION_TYPE.HTTP, ACTION_TYPE.ANSIBLE].includes(type);
  const showParametersSection = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(type);

  return (
    <LeftRightPadding>
      <Row>
        <Col lg={10}>
          <Fragment key="1-action-details">
            <ScrollStep id="1-action-details">
              <SectionHeading>{t('in-automation:ActionCatalog.1ActionDetails')}</SectionHeading>
              <MetaDataSection actionFilter={actionFilter} />
            </ScrollStep>
          </Fragment>
          <Fragment key="2-action-configuration">
            <ScrollStep id="2-action-configuration">
              <SectionHeading>{t('in-automation:ActionCatalog.2ActionConfiguration')}</SectionHeading>
              <TypeSection action={action} actionFilter={actionFilter} />
              {type === ACTION_TYPE.DOC_LINK && <DocLinkSection />}
              {type === ACTION_TYPE.SCRIPT && <ScriptSection />}
              {type === ACTION_TYPE.HTTP && <WebhookSection />}
              {type === ACTION_TYPE.ANSIBLE && <AnsibleSection action={action} />}
              {type === ACTION_TYPE.GITHUB && <GithubSection />}
              {type === ACTION_TYPE.GITLAB && <GitlabSection />}
              {type === ACTION_TYPE.JIRA && <JiraSection />}
              {type === ACTION_TYPE.MANUAL && <ManualSection />}
              {showTimeoutSection && <TimeoutSection />}
            </ScrollStep>
          </Fragment>

          {showParametersSection && (
            <>
              <Fragment key="3-parameter-details">
                <ScrollStep id="3-parameter-details">
                  <SectionHeading>{t('in-automation:ActionCatalog.3ParamaterDetails')}</SectionHeading>
                  <FormGroup>
                    <ParametersTable />
                  </FormGroup>
                </ScrollStep>
              </Fragment>
            </>
          )}
        </Col>
      </Row>
    </LeftRightPadding>
  );
}

function TimeoutSection() {
  const { form, setForm } = useActionFormContext();

  const isNotEditable = useIsNotEditableContext();

  const timeout = form.get('timeout');
  const type = form.get('type').value;

  // NOTE: Timeout is a special field we want to allow to be editable for Ansible actions
  const disabled = isNotEditable && type !== ACTION_TYPE.ANSIBLE;

  return timeout.map(field => (
    <FormGroup key={1}>
      <Label htmlFor="action-timeout" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.timeout')}
      </Label>
      <CarbonNumberInput
        allowEmpty
        id="action-timeout"
        type="number"
        disabled={disabled}
        value={field.value}
        onChange={(_e, state) => {
          setForm(form => form.updateIn(['timeout'], item => item.setValue(state.value as string).setTouched(true)));
        }}
        invalid={!field.valid && field.touched}
        size="sm"
        min={1}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.timeoutHelpText')}</HelpText>
    </FormGroup>
  ));
}

function filterTags(actionFilter: 'all' | ActionFilter, availableTags: Result<string[]>) {
  if (actionFilter === 'all' || actionFilter.tags.length === 0) {
    return availableTags.data;
  } else {
    return availableTags.data?.filter(tag => actionFilter.tags.includes(tag));
  }
}

function MetaDataSection({ actionFilter }: { actionFilter: 'all' | ActionFilter }) {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();
  const availableTags = useActionTags();

  const name = form.get('name');
  const description = form.get('description');
  const tags = form.get('tags');

  const filteredTags = filterTags(actionFilter, availableTags);

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
            onChange={e =>
              setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)))
            }
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
            onChange={e =>
              setForm(form =>
                form.updateIn(['description'], item =>
                  item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                )
              )
            }
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>
            {t('in-automation:ActionCatalog.showsUpInTheActionDescription')}
          </HelpText>
        </FormGroup>
      ))}
      {tags.map(field => (
        <FormGroup>
          <Label htmlFor="action-tags" hasError={!field.valid && field.touched}>
            {actionFilter !== 'all' && actionFilter.tags.length > 0
              ? t('in-automation:tags')
              : t('in-automation:tagsLabel')}
          </Label>
          <CreatableTagSelect
            id="action-tags"
            isLoading={isLoading(availableTags)}
            tags={filteredTags}
            value={field.value}
            onChange={newTags =>
              setForm(form => form.updateIn(['tags'], item => item.setValue(newTags).setTouched(true)))
            }
            disabled={isNotEditable || !role?.canConfigureAutomationActions}
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
        </FormGroup>
      ))}
    </>
  );
}

const typeOptions = ACTION_TYPES.filter(type => !NON_CREATABLE_ACTION_TYPES.includes(type));
function filterTypes(actionFilter: 'all' | ActionFilter) {
  if (actionFilter === 'all' || actionFilter.types.length === 0) {
    return typeOptions;
  } else {
    return typeOptions.filter(option => actionFilter.types.includes(option));
  }
}

function getHelpTextType(type: ActionType) {
  switch (type) {
    case 'SCRIPT':
      return t('in-automation:ActionCatalog.scripthelpText');
    case 'HTTP':
      return t('in-automation:ActionCatalog.httpHelpText');
    case 'GITHUB':
      return t('in-automation:ActionCatalog.githubHelpText');
    case 'GITLAB':
      return t('in-automation:ActionCatalog.gitlabHelpText');
    case 'JIRA':
      return t('in-automation:ActionCatalog.jiraHelpText');
    case 'MANUAL':
      return t('in-automation:ActionCatalog.manualHelpText');
    case 'DOC_LINK':
      return t('in-automation:ActionCatalog.docLinkHelpText');
    default:
      return '';
  }
}

function TypeSection({ action, actionFilter }: { action?: ActionFormEntity; actionFilter: 'all' | ActionFilter }) {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();
  const actionId = action && 'id' in action ? (action as any).id : undefined;
  const { isCreate } = useActionDetailsUrlParams({ actionId, copy: false });

  const type = form.get('type');

  const filteredTypes = filterTypes(actionFilter);

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
            onChange={e => {
              setForm(form => {
                // Update 'type'
                const updatedForm = form.updateIn(['type'], item =>
                  item.setValue(e.target.value as ActionType).setTouched(true)
                );
                const type = updatedForm.get('type').value;
                const isGHGLJIRA =
                  type === ACTION_TYPE.GITHUB || type === ACTION_TYPE.GITLAB || type === ACTION_TYPE.JIRA;
                // Check the updated form state and conditionally update 'ticketActionType'
                if (isGHGLJIRA) {
                  return updatedForm.updateIn(['ticketActionType'], item => item.setValue('open').setTouched(true));
                }

                return updatedForm;
              });
            }}
            hasError={!field.valid && field.touched}
          >
            {filteredTypes.map(type => (
              <option key={type} value={type}>
                {ACTION_TRANSLATIONS[type]}
              </option>
            ))}
          </Select>
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          <HelpText className={locals.subTextFormField}>{getHelpTextType(type.value)}</HelpText>
        </>
      ) : (
        <Typography variant="body-regular">{action ? ACTION_TRANSLATIONS[action.type] : ''}</Typography>
      )}
    </FormGroup>
  ));
}

function DocLinkSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const docLink = form.get('docLink');

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
        onChange={e =>
          setForm(form => form.updateIn(['docLink'], item => item.setValue(e.target.value).setTouched(true)))
        }
        hasError={!field.valid && field.touched}
        maxLength={256}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>{t('in-automation:ActionCatalog.docLinkDescription')}</HelpText>
    </FormGroup>
  ));
}

function ManualSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const manualContent = form.get('manualContent');

  return manualContent.map(field => (
    <FormGroup>
      <Label htmlFor="action-docLink" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.content')}
      </Label>
      <Code
        lineNumbers={!isNotEditable}
        readOnly={isNotEditable}
        mode={'markdown'}
        value={field.value}
        onChange={value =>
          setForm(form => form.updateIn(['manualContent'], item => item.setValue(value).setTouched(true)))
        }
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
      <HelpText className={locals.subTextFormField}>
        {t('in-automation:ActionCatalog.manualContentDescription')}
      </HelpText>
    </FormGroup>
  ));
}

function ScriptSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();
  const script = form.get('script');
  const subtype = form.get('subtype');

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
            onChange={e =>
              setForm(form => form.updateIn(['subtype'], item => item.setValue(e.target.value).setTouched(true)))
            }
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
            onChange={value =>
              setForm(form => form.updateIn(['script'], item => item.setValue(value).setTouched(true)))
            }
          />
          <TouchedMessages field={field} className={locals.subErrorTextFormField} />
        </FormGroup>
      ))}
    </>
  );
}

function checkIdParameter(form: ActionForm, type: string) {
  const parameters = form.get('parameters').value;
  const hasIdParameter = parameters.find(parameter => parameter.value.name === 'id') !== undefined;
  if (type == OPEN && hasIdParameter) {
    return form.updateIn(['parameters'], item =>
      item.setValue(parameters.filter(parameter => parameter.value.name !== 'id'))
    );
  }
  if (type == OPEN || hasIdParameter) return form;
  parameters.push(createTicketIdParameter('Issue', 'Github issue id'));
  return form.updateIn(['parameters'], item => item.setValue(parameters));
}

function GithubSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();
  const owner = form.get('owner');
  const repo = form.get('repo');
  const ticketActionType = form.get('ticketActionType');

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
                onChange={e =>
                  setForm(form => form.updateIn(['owner'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form => form.updateIn(['repo'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                  setForm(form => {
                    const type = e.target.value;
                    let updatedForm = form.updateIn(['ticketActionType'], item => item.setValue(type).setTouched(true));
                    updatedForm = checkIdParameter(updatedForm, type);
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {GIT_OPERATIONS.map(({ value, translation }) => (
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
      {ticketActionType.value === OPEN && <GithubOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function GithubOpenSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const title = form.get('title');
  const body = form.get('body');

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
                onChange={e =>
                  setForm(form => form.updateIn(['title'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['body'], item =>
                      item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                    )
                  )
                }
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
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>
      <FormGroup>
        <FieldsTable
          label={t('in-automation:assignees')}
          fieldName="assignees"
          customAddRowLabel={t('in-automation:ActionCatalog.addAssignees')}
          noDataMessage={t('in-automation:ActionCatalog.noAssigneesConfigured')}
        />
      </FormGroup>
    </>
  );
}

function TicketCloseAndCommentSection({ close = false }: { close?: boolean }) {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const comment = form.get('comment');

  return comment.map(field => (
    <FormGroup>
      <Label htmlFor="ticket-comment" hasError={!field.valid && field.touched}>
        {close ? t('in-automation:ActionCatalog.commentOptional') : t('in-automation:comment')}
      </Label>
      <TextArea
        id="ticket-comment"
        value={field.value}
        disabled={isNotEditable}
        onChange={e =>
          setForm(form =>
            form.updateIn(['comment'], item => item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true))
          )
        }
        hasError={!field.valid && field.touched}
      />
      <TouchedMessages field={field} className={locals.subErrorTextFormField} />
    </FormGroup>
  ));
}

function GitlabSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const projectId = form.get('projectId');
  const ticketActionType = form.get('ticketActionType');

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
                onChange={e =>
                  setForm(form => form.updateIn(['projectId'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                  setForm(form => {
                    const type = e.target.value;
                    let updatedForm = form.updateIn(['ticketActionType'], item => item.setValue(type).setTouched(true));
                    updatedForm = checkIdParameter(updatedForm, type);
                    return updatedForm;
                  })
                }
                hasError={!field.valid && field.touched}
              >
                {GIT_OPERATIONS.map(({ value, translation }) => (
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
      {ticketActionType.value === OPEN && <GitlabOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function GitlabOpenSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const title = form.get('title');
  const body = form.get('body');
  const issue_type = form.get('issue_type');

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
                onChange={e =>
                  setForm(form => form.updateIn(['title'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['body'], item =>
                      item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                    )
                  )
                }
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
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>

      {issue_type.map(field => (
        <FormGroup>
          <Label htmlFor="gitlab-issue-type" hasError={!field.valid && field.touched}>
            {t('in-automation:issueType')}
          </Label>
          <Select
            id="gitlab-issue-type"
            value={field.value}
            disabled={isNotEditable}
            onChange={e =>
              setForm(form => form.updateIn(['issue_type'], item => item.setValue(e.target.value).setTouched(true)))
            }
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
    </>
  );
}

function JiraSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();
  const project = form.get('project');
  const ticketActionType = form.get('ticketActionType');

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
                onChange={e =>
                  setForm(form => form.updateIn(['project'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                  setForm(form => {
                    const type = e.target.value;
                    let updatedForm = form.updateIn(['ticketActionType'], item => item.setValue(type).setTouched(true));
                    updatedForm = checkIdParameter(updatedForm, type);
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
      {ticketActionType.value === OPEN && <JiraOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function JiraOpenSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const summary = form.get('summary');
  const body = form.get('body');
  const assignee = form.get('assignee');
  const issue_type = form.get('issue_type');

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
                onChange={e =>
                  setForm(form => form.updateIn(['summary'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['body'], item =>
                      item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                    )
                  )
                }
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
                onChange={e =>
                  setForm(form => form.updateIn(['assignee'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                  onChange={e =>
                    setForm(form =>
                      form.updateIn(['issue_type'], item => item.setValue(e.target.value).setTouched(true))
                    )
                  }
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
          label={t('in-automation:labels')}
          fieldName="labels"
          customAddRowLabel={t('in-automation:ActionCatalog.addLabels')}
          noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
        />
      </FormGroup>
    </>
  );
}

const authOptions = AUTH_TYPES.map(type => ({ value: type, label: AUTH_TRANSLATIONS[type] }));

function WebhookSection() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const host = form.get('host');
  const method = form.get('method');
  const accept = form.get('accept');
  const body = form.get('httpBody');
  const acceptLanguage = form.get('acceptLanguage');
  const contentType = form.get('contentType');
  const ignoreCertErrors = form.get('ignoreCertErrors');
  const authType = form.get('authType');

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
                disabled={isNotEditable}
                value={field.value}
                onChange={e =>
                  setForm(form => form.updateIn(['host'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form => form.updateIn(['method'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['contentType'], item => item.setValue(e.target.value).setTouched(true))
                  )
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['httpBody'], item =>
                      item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                    )
                  )
                }
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
                onToggle={e =>
                  setForm(form => form.updateIn(['ignoreCertErrors'], item => item.setValue(e).setTouched(true)))
                }
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
                  setForm(form =>
                    form.updateIn(['authType'], item => item.setValue(e.target.value as AuthenType).setTouched(true))
                  )
                }
                hasError={!field.valid && field.touched}
              >
                {authOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
            </FormGroup>
          ))}
        </Col>
      </Row>
      {authType.value === AUTH_TYPE.BASIC_AUTH && <BasicAuth />}
      {authType.value === AUTH_TYPE.BEARER_TOKEN && <BearerAuth />}
      {authType.value === AUTH_TYPE.API_KEY && <APIAuth />}
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
                onChange={e =>
                  setForm(form => form.updateIn(['accept'], item => item.setValue(e.target.value).setTouched(true)))
                }
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
                onChange={e =>
                  setForm(form =>
                    form.updateIn(['acceptLanguage'], item => item.setValue(e.target.value).setTouched(true))
                  )
                }
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
        <AdditionalHeadersTable form={form} setForm={setForm} />
      </FormGroup>
    </>
  );
}

function BasicAuth() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const username = form.get('username');
  const password = form.get('password');

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
              onChange={e =>
                setForm(form => form.updateIn(['username'], item => item.setValue(e.target.value).setTouched(true)))
              }
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
            <Input
              id="action-password"
              type="password"
              disabled={isNotEditable}
              placeholder={'*******************'}
              value={field.value}
              onChange={e =>
                setForm(form => form.updateIn(['password'], item => item.setValue(e.target.value).setTouched(true)))
              }
              hasError={!field.valid && field.touched}
              maxLength={256}
            />

            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
}

function BearerAuth() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const bearerToken = form.get('bearerToken');

  return (
    <Row>
      <Col lg={12}>
        {bearerToken.map(field => (
          <FormGroup>
            <Label htmlFor="action-bearerToken" hasError={!field.valid && field.touched}>
              {t('in-automation:ActionCatalog.bearerToken')}
            </Label>
            <Input
              id="action-bearerToken"
              type="password"
              disabled={isNotEditable}
              placeholder={'*******************'}
              value={field.value}
              onChange={e =>
                setForm(form => form.updateIn(['bearerToken'], item => item.setValue(e.target.value).setTouched(true)))
              }
              hasError={!field.valid && field.touched}
              maxLength={256}
            />
            <TouchedMessages field={field} className={locals.subErrorTextFormField} />
          </FormGroup>
        ))}
      </Col>
    </Row>
  );
}

function APIAuth() {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const apiKey = form.get('apiKey');
  const apiKeyValue = form.get('apiKeyValue');
  const apiKeyAddTo = form.get('apiKeyAddTo');

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
              onChange={e =>
                setForm(form => form.updateIn(['apiKey'], item => item.setValue(e.target.value).setTouched(true)))
              }
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
            <Input
              id="action-apiKeyValue"
              type="password"
              disabled={isNotEditable}
              placeholder={'*******************'}
              value={field.value}
              onChange={e =>
                setForm(form => form.updateIn(['apiKeyValue'], item => item.setValue(e.target.value).setTouched(true)))
              }
              hasError={!field.valid && field.touched}
              maxLength={256}
            />
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
              onChange={e =>
                setForm(form => form.updateIn(['apiKeyAddTo'], item => item.setValue(e.target.value).setTouched(true)))
              }
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
}

function AnsibleSection({ action }: { action?: ActionFormEntity }) {
  if (!action) return null;

  const { jobTemplateUrl, isWorkflowJobTemplate } = getAnsibleFields(action);

  const label = isWorkflowJobTemplate ? t('in-automation:workflowJobTemplate') : t('in-automation:jobTemplate');

  return (
    <FormGroup className={locals.widthFitContent}>
      <Label>{label}</Label>
      <Link external href={jobTemplateUrl}>
        {action.name}
      </Link>
    </FormGroup>
  );
}
