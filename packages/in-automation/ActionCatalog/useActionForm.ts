/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, MapForm, ValidationResult, Field } from 'formalistic';
import { useState } from 'react';
import mimeDb from 'mime-db';

import { ActionType, Field as ActionField } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

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
  TicketTypes,
  createDocLinkField,
  createScriptFields,
  createManualField,
  createWebhookFields,
  createGithubFields,
  createGitlabFields,
  createJiraFields
} from 'in-automation/utils/actionField';
import { NewAction, ActionFilter, ApiKeyAuth, BasicAuth, BearerAuth, NoAuth } from 'in-automation/types';
import { ACTION_TYPE, AUTH_TYPE, OPEN, CLOSE, ADD_COMMENT } from 'in-automation/constants';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { Header } from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import { positiveNumberValidator } from 'in-services/validators/number';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { notBlankValidator } from 'in-services/validators/string';
import { Label } from 'in-automation/ActionCatalog/FieldsTable';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

function getAuthenFromForm(form: ActionForm) {
  const authType = (form.get('authType') as Field<string>).value;
  if (authType === AUTH_TYPE.BASIC_AUTH) {
    const username = (form.get('username') as Field<string>).value;
    const password = (form.get('password') as Field<string>).value;
    return {
      type: AUTH_TYPE.BASIC_AUTH,
      username,
      password
    } as BasicAuth;
  } else if (authType === AUTH_TYPE.BEARER_TOKEN) {
    const bearerToken = (form.get('bearerToken') as Field<string>).value;
    return {
      type: AUTH_TYPE.BEARER_TOKEN,
      bearerToken
    } as BearerAuth;
  } else if (authType === AUTH_TYPE.API_KEY) {
    const apiKey = (form.get('apiKey') as Field<string>).value;
    const apiKeyValue = (form.get('apiKeyValue') as Field<string>).value;
    const apiKeyAddTo = (form.get('apiKeyAddTo') as Field<string>).value;
    return {
      type: AUTH_TYPE.API_KEY,
      apiKey,
      apiKeyValue,
      apiKeyAddTo
    } as ApiKeyAuth;
  }
  return {
    type: AUTH_TYPE.NO_AUTH
  } as NoAuth;
}
export function getActionFromForm(form: ActionForm, action: ActionFormEntity): NewAction {
  const name = (form.get('name') as Field<string>).value;
  const description = (form.get('description') as Field<string>).value;
  const type = (form.get('type') as Field<ActionType>).value;
  const tags = (form.get('tags') as Field<string[]>).value;
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const timeout = (form.get('timeout') as Field<string>).value;
  const fields: ActionField[] = [];
  if (type === ACTION_TYPE.DOC_LINK) {
    const docLink = (form.get('docLink') as Field<string>).value;
    fields.push(createDocLinkField(docLink));
  } else if (type === ACTION_TYPE.MANUAL) {
    const content = (form.get('manualContent') as Field<string>).value;
    fields.push(createManualField(content));
  } else if (type === ACTION_TYPE.SCRIPT) {
    const value = (form.get('script') as Field<string>).value;
    const subtype = (form.get('subtype') as Field<string>).value;
    fields.push(...createScriptFields({ value, subtype, timeout }));
  } else if (type === ACTION_TYPE.GITHUB) {
    const owner = (form.get('owner') as Field<string>).value;
    const repo = (form.get('repo') as Field<string>).value;
    const ticketActionType = (form.get('ticketActionType') as Field<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const title = (form.get('title') as Field<string>).value;
      const body = (form.get('body') as Field<string>).value;
      const labels = (form.get('labels') as Field<any>).value;
      const assignees = (form.get('assignees') as Field<any>).value;
      const labelsString = labels.map((label: Label) => label.value).join(',');
      const assigneesString = assignees.map((assignee: Label) => assignee.value).join(',');
      type = {
        type: 'open',
        title,
        body,
        labels: labelsString,
        assignees: assigneesString
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createGithubFields({ owner: owner, repo: repo, ticketActionType: type }));
  } else if (type === ACTION_TYPE.GITLAB) {
    const projectId = (form.get('projectId') as Field<string>).value;
    const ticketActionType = (form.get('ticketActionType') as Field<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const title = (form.get('title') as Field<string>).value;
      const body = (form.get('body') as Field<string>).value;
      const labels = (form.get('labels') as Field<any>).value;
      const issue_type = (form.get('issue_type') as Field<any>).value;
      const labelsString = labels.map((label: Label) => label.value).join(',');
      type = {
        type: 'open',
        title,
        body,
        labels: labelsString,
        issue_type
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createGitlabFields({ projectId: projectId, ticketActionType: type }));
  } else if (type === ACTION_TYPE.JIRA) {
    const project = (form.get('project') as Field<string>).value;
    const ticketActionType = (form.get('ticketActionType') as Field<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const summary = (form.get('summary') as Field<string>).value;
      const body = (form.get('body') as Field<string>).value;
      const labels = (form.get('labels') as Field<any>).value;
      const assignee = (form.get('assignee') as Field<string>).value;
      const issue_type = (form.get('issue_type') as Field<any>).value;
      const labelsString = labels.map((tag: Label) => tag.value).join(',');
      type = {
        type: 'open',
        summary,
        body,
        labels: labelsString,
        assignee,
        issue_type
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as Field<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createJiraFields({ project: project, ticketActionType: type }));
  } else if (type === ACTION_TYPE.HTTP) {
    const host = (form.get('host') as Field<string>).value;
    const method = (form.get('method') as Field<string>).value;
    const accept = (form.get('accept') as Field<string>).value;
    const acceptLanguage = (form.get('acceptLanguage') as Field<string>).value;
    const contentType = (form.get('contentType') as Field<string>).value;
    const additionalHeaders = (form.get('additionalHeaders') as Field<Header[]>).value;
    const body = (form.get('body') as Field<string>).value;
    const ignoreCertErrors = (form.get('ignoreCertErrors') as Field<boolean>).value;
    const authen = getAuthenFromForm(form);
    fields.push(
      ...createWebhookFields({
        timeout,
        host,
        method,
        accept,
        acceptLanguage,
        contentType,
        additionalHeaders: additionalHeaders.reduce(
          (headers, header) => ({
            ...headers,
            [header.value[0]]: header.value[1]
          }),
          {}
        ),
        body,
        authen,
        ignoreCertErrors
      })
    );
  } else if (type === ACTION_TYPE.ANSIBLE) {
    fields.push(...(action?.fields ?? []));
  }
  const inputParameters = type === ACTION_TYPE.DOC_LINK ? [] : parameters.map(parameter => parameter.value);
  return {
    name,
    description,
    fields,
    type,
    tags,
    inputParameters
  };
}

function mimeValidator(str: string): ValidationResult {
  if (isNotBlank(str) && !(str in mimeDb)) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.theValueMustBeValidMime')
      }
    ];
  }

  return null;
}

function urlValidator(string: string): ValidationResult {
  try {
    new URL(string);
    return null;
  } catch (err) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.validUrl')
      }
    ];
  }
}

function additionalHeadersValidator(additionalHeaders: Header[]): ValidationResult {
  const hasBlankAdditionalHeaders = additionalHeaders.reduce(
    (hasBlank, additionalHeader) => hasBlank || additionalHeader.value.includes(''),
    false
  );
  if (hasBlankAdditionalHeaders) {
    return [
      {
        severity: 'error',
        message: t('in-automation:theValueMustNotBeBlank')
      }
    ];
  }
  return null;
}

function timeoutValidator(timeout: string) {
  if (timeout === '') return null;
  return positiveNumberValidator(timeout);
}

function tagFilterExpressionValidator(tags: string[], actionFilter: 'all' | ActionFilter): ValidationResult {
  if (actionFilter === 'all' || actionFilter.tags.length === 0) return null;
  const hasRequiredTag = tags.some(tag => actionFilter.tags.includes(tag));
  if (!hasRequiredTag) {
    const formattedTags = actionFilter.tags.join(', ');
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.mustHaveRequiredTag', { tags: formattedTags })
      }
    ];
  }
  return null;
}

function filterType(actionFilter: 'all' | ActionFilter, type: ActionType) {
  if (actionFilter === 'all' || actionFilter.types.length === 0 || actionFilter.types.includes(type)) return type;
  return actionFilter.types[0];
}
function createActionFormDefinition(action: ActionFormEntity, actionFilter: 'all' | ActionFilter) {
  const { tags = [], inputParameters = [], name, description = '', type, fields } = action;
  const mappedInputParameters = inputParameters.map(parameter => ({ id: generateUniqueShortId(), value: parameter }));
  const filteredType = filterType(actionFilter, type);
  const timeout = getTimeoutFromFields(fields).value;
  let form: ActionForm = createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: description,
        validator: type === ACTION_TYPE.ANSIBLE ? undefined : notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: filteredType,
        validator: notBlankValidator
      })
    )
    .put(
      'tags',
      createField({
        value: tags,
        validator: tags => tagFilterExpressionValidator(tags, actionFilter)
      })
    )
    .put(
      'parameters',
      createField({
        value: mappedInputParameters
      })
    )
    .put(
      'timeout',
      createField({
        value: timeout,
        validator: timeoutValidator
      })
    );
  if (filteredType === ACTION_TYPE.DOC_LINK) form = putDocLinkField(form, action);
  else if (filteredType === ACTION_TYPE.SCRIPT) form = putScriptField(form, action);
  else if (filteredType === ACTION_TYPE.HTTP) form = putWebhookFields(form, action);
  else if (filteredType === ACTION_TYPE.GITHUB) form = putGithubFields(form, action);
  else if (filteredType === ACTION_TYPE.GITLAB) form = putGitlabFields(form, action);
  else if (filteredType === ACTION_TYPE.JIRA) form = putJiraFields(form, action);
  else if (filteredType === ACTION_TYPE.MANUAL) form = putManualField(form, action);
  return form;
}

export function putDocLinkField(form: ActionForm, action: ActionFormEntity): ActionForm {
  const value = getDocLinkFromFields(action.fields).value;

  return form.put(
    'docLink',
    createField({
      value: value,
      validator: composeAndShortCircuitOnError(notBlankValidator, urlValidator)
    })
  );
}

export function putManualField(form: ActionForm, action: ActionFormEntity): ActionForm {
  const content = getManualContentFromFields(action.fields);
  let contentText = content.value;
  if (content.encoding === 'base64') {
    contentText = atob(contentText);
  }
  return form.put(
    'manualContent',
    createField({
      value: contentText,
      validator: notBlankValidator
    })
  );
}

export function removeDocLinkField(form: ActionForm) {
  return form.remove('docLink');
}

export function removeManualContentField(form: ActionForm) {
  return form.remove('manualContent');
}

export function putScriptField(form: ActionForm, action: ActionFormEntity): ActionForm {
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

  return form
    .put(
      'script',
      createField({
        value: plaintextScript,
        validator: notBlankValidator
      })
    )
    .put(
      'subtype',
      createField({
        value: plaintextInterpreter
      })
    );
}

export function removeScriptField(form: ActionForm) {
  return form.remove('script').remove('subtype');
}

export function putGithubFields(form: ActionForm, action: ActionFormEntity) {
  const { owner, repo, ticketActionType } = getGithubFields(action);
  form = form
    .put(
      'owner',
      createField({
        value: owner.value,
        validator: notBlankValidator
      })
    )
    .put(
      'repo',
      createField({
        value: repo.value,
        validator: notBlankValidator
      })
    )
    .put(
      'ticketActionType',
      createField({
        value: ticketActionType.value,
        validator: notBlankValidator
      })
    );
  if (ticketActionType.value == OPEN) form = putGithubOpenTicketFields(form, action);
  else if (ticketActionType.value == CLOSE) form = putGithubCloseTicketFields(form, action);
  else if (ticketActionType.value == ADD_COMMENT) form = putGithubCommentTicketFields(form, action);
  return form;
}

export function removeGithubFields(form: ActionForm) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('owner').remove('repo').remove('ticketActionType');
}
export function putGithubOpenTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeGithubOpenTicketFields(form);
  // Remove parameter with name "id"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));

  const { title, body, labels, assignees } = getGithubOpenTicketFields(action);
  form = form
    .put(
      'title',
      createField({
        value: title.value,
        validator: notBlankValidator
      })
    )
    .put(
      'body',
      createField({
        value: body.value,
        validator: notBlankValidator
      })
    )
    .put(
      'labels',
      createField({
        value: labels.value ? labels.value.split(',').map(label => ({ value: label, id: generateUniqueShortId() })) : []
      })
    )
    .put(
      'assignees',
      createField({
        value: assignees.value
          ? assignees.value.split(',').map(assignee => ({ value: assignee, id: generateUniqueShortId() }))
          : []
      })
    );
  return form;
}

export function putGithubCloseTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeGithubOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value
    })
  );

  return form;
}

export function putGithubCommentTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeGithubOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value,
      validator: notBlankValidator
    })
  );

  return form;
}

export function removeGithubOpenTicketFields(form: ActionForm) {
  return form.remove('title').remove('body').remove('labels').remove('assignees');
}

export function removeCloseAndCommentTicketFields(form: ActionForm) {
  return form.remove('comment');
}

export function putGitlabFields(form: ActionForm, action: ActionFormEntity) {
  const { projectId, ticketActionType } = getGitlabFields(action);
  form = form
    .put(
      'projectId',
      createField({
        value: projectId.value,
        validator: notBlankValidator
      })
    )
    .put(
      'ticketActionType',
      createField({
        value: ticketActionType.value,
        validator: notBlankValidator
      })
    );
  if (ticketActionType.value == OPEN) form = putGitlabOpenTicketFields(form, action);
  else if (ticketActionType.value == CLOSE) form = putGitlabCloseTicketFields(form, action);
  else if (ticketActionType.value == ADD_COMMENT) form = putGitlabCommentTicketFields(form, action);
  return form;
}

export function removeGitlabFields(form: ActionForm) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('projectId').remove('ticketActionType');
}
export function putGitlabOpenTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeGitlabOpenTicketFields(form);
  // Remove parameter with name "id"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));

  const { title, body, labels, issue_type } = getGitlabOpenTicketFields(action);
  form = form
    .put(
      'title',
      createField({
        value: title.value,
        validator: notBlankValidator
      })
    )
    .put(
      'body',
      createField({
        value: body.value
      })
    )
    .put(
      'labels',
      createField({
        value: labels.value ? labels.value.split(',').map(label => ({ value: label, id: generateUniqueShortId() })) : []
      })
    )
    .put(
      'issue_type',
      createField({
        value: issue_type.value,
        validator: notBlankValidator
      })
    );
  return form;
}

export function putGitlabCloseTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeGitlabOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value
    })
  );

  return form;
}

export function putGitlabCommentTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeGitlabOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value,
      validator: notBlankValidator
    })
  );

  return form;
}

export function removeGitlabOpenTicketFields(form: ActionForm) {
  return form.remove('title').remove('body').remove('labels').remove('issue_type');
}

export function putJiraFields(form: ActionForm, action: ActionFormEntity) {
  const { project, ticketActionType } = getJiraFields(action);
  form = form
    .put(
      'project',
      createField({
        value: project.value,
        validator: notBlankValidator
      })
    )
    .put(
      'ticketActionType',
      createField({
        value: ticketActionType.value,
        validator: notBlankValidator
      })
    );
  if (ticketActionType.value == OPEN) form = putJiraOpenTicketFields(form, action);
  else if (ticketActionType.value == CLOSE) form = putJiraCloseTicketFields(form, action);
  else if (ticketActionType.value == ADD_COMMENT) form = putJiraCommentTicketFields(form, action);
  return form;
}

export function removeJiraFields(form: ActionForm) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('project').remove('ticketActionType');
}
export function putJiraOpenTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeJiraOpenTicketFields(form);
  // Remove parameter with name "id"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'id');
  form = form.put('parameters', createField({ value: updatedParameters }));

  const { summary, body, labels, assignee, issue_type } = getJiraOpenTicketFields(action);
  form = form
    .put(
      'summary',
      createField({
        value: summary.value,
        validator: notBlankValidator
      })
    )
    .put(
      'body',
      createField({
        value: body.value,
        validator: notBlankValidator
      })
    )
    .put(
      'labels',
      createField({
        value: labels.value ? labels.value.split(',').map(label => ({ value: label, id: generateUniqueShortId() })) : []
      })
    )
    .put(
      'assignee',
      createField({
        value: assignee.value
      })
    )
    .put(
      'issue_type',
      createField({
        value: issue_type.value,
        validator: notBlankValidator
      })
    );
  return form;
}

export function putJiraCloseTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeJiraOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value
    })
  );

  return form;
}

export function putJiraCommentTicketFields(form: ActionForm, action: ActionFormEntity) {
  form = removeJiraOpenTicketFields(form);
  const { comment } = getCloseAndCommentFields(action);
  form = form.put(
    'comment',
    createField({
      value: comment.value,
      validator: notBlankValidator
    })
  );

  return form;
}

export function removeJiraOpenTicketFields(form: ActionForm) {
  return form.remove('summary').remove('body').remove('labels').remove('assignee').remove('issue_type');
}

export function putWebhookFields(form: ActionForm, action: ActionFormEntity) {
  const { method, host, body, headerParsed, ignoreCertErrors, authenParsed } = getWebhookFields(action);
  const {
    'Content-Type': contentType,
    Accept: accept,
    'Accept-Language': acceptLanguage,
    ...additionalHeaders
  } = headerParsed;
  form = form
    .put(
      'method',
      createField({
        value: method.value,
        validator: notBlankValidator
      })
    )
    .put(
      'host',
      createField({
        value: host.value,
        validator: notBlankValidator
      })
    )
    .put(
      'body',
      createField({
        value: body.value
      })
    )
    .put(
      'ignoreCertErrors',
      createField({
        value: ignoreCertErrors.value === 'true'
      })
    )
    .put(
      'authType',
      createField({
        value: authenParsed.type,
        validator: notBlankValidator
      })
    )
    .put(
      'contentType',
      createField({
        value: contentType ?? '',
        validator: mimeValidator
      })
    )
    .put(
      'accept',
      createField({
        value: accept ?? '',
        validator: mimeValidator
      })
    )
    .put(
      'acceptLanguage',
      createField({
        value: acceptLanguage ?? ''
      })
    )
    .put(
      'additionalHeaders',
      createField({
        value: Object.entries(additionalHeaders).map(header => ({
          value: header,
          id: generateUniqueShortId()
        })),
        validator: additionalHeadersValidator
      })
    );
  if (authenParsed.type == AUTH_TYPE.BASIC_AUTH) form = putBasicFields(form, action);
  else if (authenParsed.type == AUTH_TYPE.BEARER_TOKEN) form = putBearerField(form, action);
  else if (authenParsed.type == AUTH_TYPE.API_KEY) form = putApiKeyFields(form, action);
  return form;
}

export function removeWebhookFields(form: ActionForm) {
  return form
    .remove('method')
    .remove('host')
    .remove('body')
    .remove('ignoreCertErrors')
    .remove('username')
    .remove('password')
    .remove('contentType')
    .remove('accept')
    .remove('acceptLanguage')
    .remove('additionalHeaders')
    .remove('authType');
}

export function putBasicFields(form: ActionForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: BasicAuth = JSON.parse(authenString.value);
  form = removeApiKeyFields(form);
  form = removeBearerField(form);
  return form
    .put(
      'username',
      createField({
        value: authen.username ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'password',
      createField({
        value: authen.password ?? '',
        validator: notBlankValidator
      })
    );
}
export function putBearerField(form: ActionForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: BearerAuth = JSON.parse(authenString.value);
  form = removeBasicFields(form);
  form = removeApiKeyFields(form);
  return form.put(
    'bearerToken',
    createField({
      value: authen.bearerToken ?? '',
      validator: notBlankValidator
    })
  );
}
export function putApiKeyFields(form: ActionForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: ApiKeyAuth = JSON.parse(authenString.value);
  form = removeBasicFields(form);
  form = removeBearerField(form);
  return form
    .put(
      'apiKey',
      createField({
        value: authen.apiKey ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'apiKeyValue',
      createField({
        value: authen.apiKeyValue ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'apiKeyAddTo',
      createField({
        value: authen.apiKeyAddTo ?? 'header',
        validator: notBlankValidator
      })
    );
}

export function removeBasicFields(form: ActionForm) {
  return form.remove('username').remove('password');
}
export function removeBearerField(form: ActionForm) {
  return form.remove('bearerToken');
}
export function removeApiKeyFields(form: ActionForm) {
  return form.remove('apiKey').remove('apiKeyValue').remove('apiKeyAddTo');
}

export const createTicketIdParameter = (type: string, description: string) => ({
  id: generateUniqueShortId(),
  value: {
    label: `${type} Id`,
    name: 'id',
    description: description,
    required: true,
    type: 'static',
    valueType: 'string'
  }
});

export type ActionForm = MapForm<any>;

export default function useActionForm(action: ActionFormEntity, actionFilter: 'all' | ActionFilter) {
  return useState<ActionForm>(createActionFormDefinition(action, actionFilter));
}
