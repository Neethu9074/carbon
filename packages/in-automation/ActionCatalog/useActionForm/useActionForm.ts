/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, ValidationResult } from 'formalistic';
import { useState, useContext } from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { ActionType } from '@instana/types';

import {
  getAuthenFromFields,
  getDocLinkFromFields,
  getManualContentFromFields,
  getInterpreterFromFields,
  getScriptFromFields,
  getTimeoutFromFields,
  getWebhookFields,
  getGithubOpenTicketFields,
  getCloseAndCommentFields,
  getGithubFields,
  getGitlabFields,
  getGitlabOpenTicketFields,
  getJiraFields,
  getJiraOpenTicketFields
} from 'in-automation/utils/actionField';
import {
  tagFilterExpressionValidator,
  urlValidator,
  timeoutValidator,
  mimeValidator,
  additionalHeadersValidator,
  checkTypeBeforeValidating
} from 'in-automation/ActionCatalog/useActionForm/validator';
import { ActionFilter, Authen, AuthenType, isApiKeyAuth, isBasicAuth, isBearerAuth } from 'in-automation/types';
import { ActionForm, MappedHeader, MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import { ACTION_TYPE, ADD_COMMENT, EPIC, ISSUE } from 'in-automation/constants';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { FormContext } from 'in-components/form/binding/FormContext';
import { notBlankValidator } from 'in-services/validators/string';
import { safeParseJSON } from 'in-automation/utils/json';

function filterType(actionFilter: 'all' | ActionFilter, type: ActionType) {
  if (actionFilter === 'all' || actionFilter.types.length === 0 || actionFilter.types.includes(type)) return type;
  return actionFilter.types[0];
}

function createActionFormFromForm(form: ActionForm, actionFilter: 'all' | ActionFilter): ActionForm {
  const nameField = form.get('name');
  const descriptionField = form.get('description');
  const typeField = form.get('type');
  const tagsField = form.get('tags');
  const parametersField = form.get('parameters');
  const timeoutField = form.get('timeout');
  const docLinkField = form.get('docLink');
  const manualContentField = form.get('manualContent');
  const scriptField = form.get('script');
  const subtypeField = form.get('subtype');
  const ownerField = form.get('owner');
  const repoField = form.get('repo');
  const ticketActionTypeField = form.get('ticketActionType');
  const titleField = form.get('title');
  const bodyField = form.get('body');
  const labelsField = form.get('labels');
  const assigneesField = form.get('assignees');
  const commentField = form.get('comment');
  const summaryField = form.get('summary');
  const assigneeField = form.get('assignee');
  const projectIdField = form.get('projectId');
  const issueTypeField = form.get('issue_type');
  const projectField = form.get('project');
  const methodField = form.get('method');
  const hostField = form.get('host');
  const httpBodyField = form.get('httpBody');
  const ignoreCertErrorsField = form.get('ignoreCertErrors');
  const authTypeField = form.get('authType');
  const contentTypeField = form.get('contentType');
  const acceptField = form.get('accept');
  const acceptLanguageField = form.get('acceptLanguage');
  const additionalHeadersField = form.get('additionalHeaders');
  const usernameField = form.get('username');
  const passwordField = form.get('password');
  const bearerTokenField = form.get('bearerToken');
  const apiKeyField = form.get('apiKey');
  const apiKeyValueField = form.get('apiKeyValue');
  const apiKeyAddToField = form.get('apiKeyAddTo');

  const validatorWrapper = <VALUE_TYPE>(
    types: ActionType | ActionType[],
    validator?: (value: VALUE_TYPE) => ValidationResult
  ) => checkTypeBeforeValidating(types, typeField.value, validator);

  return createMapForm({
    items: {
      name: createField({
        value: nameField.value,
        validator: notBlankValidator,
        touched: nameField.touched
      }),
      description: createField({
        value: descriptionField.value,
        validator: typeField.value === ACTION_TYPE.ANSIBLE ? undefined : notBlankValidator,
        touched: descriptionField.touched
      }),
      type: createField({
        value: typeField.value,
        validator: notBlankValidator,
        touched: typeField.touched
      }),
      tags: createField({
        value: tagsField.value,
        validator: tags => tagFilterExpressionValidator(tags, actionFilter)
      }),
      parameters: createField({
        value: parametersField.value,
        touched: parametersField.touched
      }),
      timeout: createField({
        value: timeoutField.value,
        validator: timeoutValidator,
        touched: timeoutField.touched
      }),
      docLink: createField({
        value: docLinkField.value,
        validator: validatorWrapper(
          ACTION_TYPE.DOC_LINK,
          composeAndShortCircuitOnError(notBlankValidator, urlValidator)
        ),
        touched: docLinkField.touched
      }),
      manualContent: createField({
        value: manualContentField.value,
        validator: validatorWrapper(ACTION_TYPE.MANUAL, notBlankValidator),
        touched: manualContentField.touched
      }),
      script: createField({
        value: scriptField.value,
        validator: validatorWrapper(ACTION_TYPE.SCRIPT, notBlankValidator),
        touched: scriptField.touched
      }),
      subtype: createField({
        value: subtypeField.value,
        touched: subtypeField.touched
      }),
      owner: createField({
        value: ownerField.value,
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator),
        touched: ownerField.touched
      }),
      repo: createField({
        value: repoField.value,
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator),
        touched: repoField.touched
      }),
      ticketActionType: createField({
        value: ticketActionTypeField.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator),
        touched: ticketActionTypeField.touched
      }),
      title: createField({
        value: titleField.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB], notBlankValidator),
        touched: titleField.touched
      }),
      body: createField({
        value: bodyField.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator),
        touched: bodyField.touched
      }),
      labels: createField({
        value: labelsField.value,
        touched: labelsField.touched
      }),
      assignees: createField({
        value: assigneesField.value,
        touched: assigneesField.touched
      }),
      comment: createField({
        value: commentField.value,
        touched: commentField.touched,
        validator: ticketActionTypeField.value === ADD_COMMENT ? notBlankValidator : undefined
      }),
      summary: createField({
        value: summaryField.value,
        touched: summaryField.touched,
        validator: validatorWrapper(ACTION_TYPE.JIRA, notBlankValidator)
      }),
      assignee: createField({
        value: assigneeField.value,
        touched: assigneeField.touched
      }),
      projectId: createField({
        value: projectIdField.value,
        validator: validatorWrapper(ACTION_TYPE.GITLAB, notBlankValidator),
        touched: projectIdField.touched
      }),
      issue_type: createField({
        value:
          issueTypeField.value === ''
            ? typeField.value === ACTION_TYPE.JIRA
              ? EPIC
              : typeField.value === ACTION_TYPE.GITLAB
              ? ISSUE
              : ''
            : issueTypeField.value,
        validator: validatorWrapper([ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator),
        touched: issueTypeField.touched
      }),
      project: createField({
        value: projectField.value,
        validator: validatorWrapper(ACTION_TYPE.JIRA, notBlankValidator),
        touched: projectField.touched
      }),
      httpBody: createField({
        value: httpBodyField.value,
        touched: httpBodyField.touched
      }),
      method: createField({
        value: methodField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator),
        touched: methodField.touched
      }),
      host: createField({
        value: hostField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator),
        touched: hostField.touched
      }),
      ignoreCertErrors: createField({
        value: ignoreCertErrorsField.value,
        touched: ignoreCertErrorsField.touched
      }),
      authType: createField<AuthenType>({
        value: authTypeField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator),
        touched: authTypeField.touched
      }),
      contentType: createField({
        value: contentTypeField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator),
        touched: contentTypeField.touched
      }),
      accept: createField({
        value: acceptField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator),
        touched: acceptField.touched
      }),
      acceptLanguage: createField({
        value: acceptLanguageField.value,
        touched: acceptLanguageField.touched
      }),
      additionalHeaders: createField({
        value: additionalHeadersField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, additionalHeadersValidator),
        touched: additionalHeadersField.touched
      }),
      username: createField({
        value: usernameField.value,
        validator: validatorWrapper(
          ACTION_TYPE.HTTP,
          authTypeField.value === 'basicAuth' ? notBlankValidator : undefined
        ),
        touched: usernameField.touched
      }),
      password: createField({
        value: passwordField.value,
        validator: validatorWrapper(
          ACTION_TYPE.HTTP,
          authTypeField.value === 'basicAuth' ? notBlankValidator : undefined
        ),
        touched: passwordField.touched
      }),
      bearerToken: createField({
        value: bearerTokenField.value,
        validator: validatorWrapper(
          ACTION_TYPE.HTTP,
          authTypeField.value === 'bearerToken' ? notBlankValidator : undefined
        ),
        touched: bearerTokenField.touched
      }),
      apiKey: createField({
        value: apiKeyField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, authTypeField.value === 'apiKey' ? notBlankValidator : undefined),
        touched: apiKeyField.touched
      }),
      apiKeyValue: createField({
        value: apiKeyValueField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, authTypeField.value === 'apiKey' ? notBlankValidator : undefined),
        touched: apiKeyValueField.touched
      }),
      apiKeyAddTo: createField({
        value: apiKeyAddToField.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, authTypeField.value === 'apiKey' ? notBlankValidator : undefined),
        touched: apiKeyAddToField.touched
      })
    }
  });
}

function createActionFormFromAction(action: ActionFormEntity, actionFilter: 'all' | ActionFilter): ActionForm {
  const { tags = [], inputParameters = [], name, description = '', type, fields } = action;
  const mappedInputParameters = inputParameters.map(parameter => ({
    id: generateUniqueShortId(),
    value: parameter
  }));
  const timeout = getTimeoutFromFields(fields).value;
  const docLink = getDocLinkFromFields(action.fields).value;
  const content = getManualContentFromFields(action.fields);
  let contentText = content.value;
  if (content.encoding === 'base64') {
    contentText = atob(contentText);
  }
  const script = getScriptFromFields(action.fields);
  const interpreter = getInterpreterFromFields(action.fields);
  let plaintextInterpreter = interpreter.value;
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = atob(plaintextScript);
  }
  if (interpreter.encoding === 'base64') {
    plaintextInterpreter = atob(plaintextInterpreter);
  }
  const { owner, repo, ticketActionType } = getGithubFields(action);
  const { title, body, labels, assignees } = getGithubOpenTicketFields(action);
  const { comment } = getCloseAndCommentFields(action);
  const { projectId } = getGitlabFields(action);
  const { issue_type } = getGitlabOpenTicketFields(action);
  const { project } = getJiraFields(action);
  const { summary, assignee } = getJiraOpenTicketFields(action);
  const { method, host, headerParsed, ignoreCertErrors, authenParsed, body: httpBody } = getWebhookFields(action);
  const {
    'Content-Type': contentType,
    Accept: accept,
    'Accept-Language': acceptLanguage,
    ...additionalHeaders
  } = headerParsed;
  const authenString = getAuthenFromFields(action.fields);
  const authen = safeParseJSON(authenString.value) as Authen;

  const validatorWrapper = <VALUE_TYPE>(
    types: ActionType | ActionType[],
    validator?: (value: VALUE_TYPE) => ValidationResult
  ) => checkTypeBeforeValidating(types, type, validator);

  return createMapForm({
    items: {
      name: createField({
        value: name,
        validator: notBlankValidator
      }),
      description: createField({
        value: description,
        validator: type === ACTION_TYPE.ANSIBLE ? undefined : notBlankValidator
      }),
      type: createField({
        value: type,
        validator: notBlankValidator
      }),
      tags: createField({
        value: tags,
        validator: tags => tagFilterExpressionValidator(tags, actionFilter)
      }),
      parameters: createField({
        value: mappedInputParameters
      }),
      timeout: createField({
        value: timeout,
        validator: timeoutValidator
      }),
      docLink: createField({
        value: docLink,
        validator: validatorWrapper(
          ACTION_TYPE.DOC_LINK,
          composeAndShortCircuitOnError(notBlankValidator, urlValidator)
        )
      }),
      manualContent: createField({
        value: contentText,
        validator: validatorWrapper(ACTION_TYPE.MANUAL, notBlankValidator)
      }),
      script: createField({
        value: plaintextScript,
        validator: validatorWrapper(ACTION_TYPE.SCRIPT, notBlankValidator)
      }),
      subtype: createField({
        value: plaintextInterpreter
      }),
      owner: createField({
        value: owner.value,
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator)
      }),
      repo: createField({
        value: repo.value,
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator)
      }),
      ticketActionType: createField({
        value: ticketActionType.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      title: createField({
        value: title.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB], notBlankValidator)
      }),
      body: createField({
        value: body.value,
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      labels: createField({
        value: labels.value ? labels.value.split(',').map(label => ({ value: label, id: generateUniqueShortId() })) : []
      }),
      assignees: createField({
        value: assignees.value
          ? assignees.value.split(',').map(assignee => ({ value: assignee, id: generateUniqueShortId() }))
          : []
      }),
      comment: createField({
        value: comment.value,
        validator: ticketActionType.value === ADD_COMMENT ? notBlankValidator : undefined
      }),
      summary: createField({
        value: summary.value,
        validator: validatorWrapper(ACTION_TYPE.JIRA, notBlankValidator)
      }),
      assignee: createField({
        value: assignee.value
      }),
      projectId: createField({
        value: projectId.value,
        validator: validatorWrapper(ACTION_TYPE.GITLAB, notBlankValidator)
      }),
      issue_type: createField({
        value: issue_type.value,
        validator: validatorWrapper([ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      project: createField({
        value: project.value,
        validator: validatorWrapper(ACTION_TYPE.JIRA, notBlankValidator)
      }),
      httpBody: createField({
        value: httpBody.value
      }),
      method: createField({
        value: method.value
      }),
      host: createField({
        value: host.value,
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator)
      }),
      ignoreCertErrors: createField({
        value: ignoreCertErrors.value === 'true'
      }),
      authType: createField<AuthenType>({
        value: authenParsed.type,
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator)
      }),
      contentType: createField({
        value: contentType ?? '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator)
      }),
      accept: createField({
        value: accept ?? '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator)
      }),
      acceptLanguage: createField({
        value: acceptLanguage ?? ''
      }),
      additionalHeaders: createField({
        value: Object.entries(additionalHeaders).map(header => ({
          value: header,
          id: generateUniqueShortId()
        })),
        validator: validatorWrapper(ACTION_TYPE.HTTP, additionalHeadersValidator)
      }),
      username: createField({
        value: isBasicAuth(authen) ? authen.username ?? '' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isBasicAuth(authen) ? notBlankValidator : undefined)
      }),
      password: createField({
        value: isBasicAuth(authen) ? authen.password ?? '' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isBasicAuth(authen) ? notBlankValidator : undefined)
      }),
      bearerToken: createField({
        value: isBearerAuth(authen) ? authen.bearerToken ?? '' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isBearerAuth(authen) ? notBlankValidator : undefined)
      }),
      apiKey: createField({
        value: isApiKeyAuth(authen) ? authen.apiKey ?? '' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isApiKeyAuth(authen) ? notBlankValidator : undefined)
      }),
      apiKeyValue: createField({
        value: isApiKeyAuth(authen) ? authen.apiKeyValue ?? '' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isApiKeyAuth(authen) ? notBlankValidator : undefined)
      }),
      apiKeyAddTo: createField({
        value: isApiKeyAuth(authen) ? authen.apiKeyAddTo ?? 'header' : '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, isApiKeyAuth(authen) ? notBlankValidator : undefined)
      })
    }
  });
}

function createDefaultActionForm(actionFilter: 'all' | ActionFilter): ActionForm {
  const filteredType = filterType(actionFilter, ACTION_TYPE.DOC_LINK);

  const validatorWrapper = <VALUE_TYPE>(
    types: ActionType | ActionType[],
    validator: (value: VALUE_TYPE) => ValidationResult
  ) => checkTypeBeforeValidating(types, filteredType, validator);

  return createMapForm({
    items: {
      name: createField({
        value: 'New Action',
        validator: notBlankValidator
      }),
      description: createField({
        value: '',
        validator: notBlankValidator
      }),
      type: createField({
        value: filteredType,
        validator: notBlankValidator
      }),
      tags: createField<string[]>({
        value: [],
        validator: tags => tagFilterExpressionValidator(tags, actionFilter)
      }),
      parameters: createField<MappedParameter[]>({
        value: []
      }),
      timeout: createField({
        value: '',
        validator: timeoutValidator
      }),
      docLink: createField({
        value: '',
        validator: validatorWrapper(
          ACTION_TYPE.DOC_LINK,
          composeAndShortCircuitOnError(notBlankValidator, urlValidator)
        )
      }),
      manualContent: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.MANUAL, notBlankValidator)
      }),
      script: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.SCRIPT, notBlankValidator)
      }),
      subtype: createField({
        value: ''
      }),
      owner: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator)
      }),
      repo: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.GITHUB, notBlankValidator)
      }),
      ticketActionType: createField({
        value: 'open',
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      title: createField({
        value: '',
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB], notBlankValidator)
      }),
      body: createField({
        value: '',
        validator: validatorWrapper([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      labels: createField<{ id: string; value: string }[]>({
        value: []
      }),
      assignees: createField<{ value: string; id: string }[]>({
        value: []
      }),
      comment: createField({
        value: ''
      }),
      summary: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.JIRA, notBlankValidator)
      }),
      assignee: createField({
        value: ''
      }),
      projectId: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.GITLAB, notBlankValidator)
      }),
      issue_type: createField({
        value: '',
        validator: validatorWrapper([ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      project: createField({
        value: '',
        validator: validatorWrapper([ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA], notBlankValidator)
      }),
      httpBody: createField({
        value: ''
      }),
      method: createField({
        value: 'GET'
      }),
      host: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator)
      }),
      ignoreCertErrors: createField({
        value: false
      }),
      authType: createField<AuthenType>({
        value: 'noAuth',
        validator: validatorWrapper(ACTION_TYPE.HTTP, notBlankValidator)
      }),
      contentType: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator)
      }),
      accept: createField({
        value: '',
        validator: validatorWrapper(ACTION_TYPE.HTTP, mimeValidator)
      }),
      acceptLanguage: createField({
        value: ''
      }),
      additionalHeaders: createField<MappedHeader[]>({
        value: [],
        validator: validatorWrapper(ACTION_TYPE.HTTP, additionalHeadersValidator)
      }),
      username: createField({
        value: ''
      }),
      password: createField({
        value: ''
      }),
      bearerToken: createField({
        value: ''
      }),
      apiKey: createField({
        value: ''
      }),
      apiKeyValue: createField({
        value: ''
      }),
      apiKeyAddTo: createField({
        value: 'header'
      })
    }
  });
}

function createActionForm({
  action,
  actionFilter,
  form
}: {
  form?: ActionForm;
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}) {
  if (form) return createActionFormFromForm(form, actionFilter);
  if (action) {
    return createActionFormFromAction(action, actionFilter);
  }
  return createDefaultActionForm(actionFilter);
}

interface UseActionFormParams {
  action?: ActionFormEntity;
  actionFilter: 'all' | ActionFilter;
}

export default function useActionForm({ action, actionFilter }: UseActionFormParams) {
  const [form, setForm] = useState(createActionForm({ action, actionFilter }));
  function updateForm(setStateAction: React.SetStateAction<ActionForm>) {
    setForm(prevForm => {
      const newForm = typeof setStateAction === 'function' ? setStateAction(prevForm) : setStateAction;
      return createActionForm({ action, actionFilter, form: newForm });
    });
  }
  return [form, updateForm] as const;
}

interface ActionFormContext {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

export function useActionFormContext() {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error('Must be used inside Form');
  }

  return context as ActionFormContext;
}
