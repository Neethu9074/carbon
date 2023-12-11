/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, ValidationResult, Field } from 'formalistic';
import { List } from 'immutable';
import mimeDb from 'mime-db';

import { generateUniqueShortId } from '@instana/utils';

import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  getAuthenFromFields,
  getDocLinkFromFields,
  getInterpreterFromFields,
  getScriptFromFields,
  getTimeoutFromFields,
  getWebhookFields,
  getGithubOpenTicketFields,
  getCloseAndCommentFields,
  isDocLink,
  isScript,
  isWebhook,
  isAnsible,
  isGithub,
  isGitlab,
  isJira,
  OPEN,
  CLOSE,
  ADD_COMMENT,
  getGithubFields,
  getGitlabFields,
  getGitlabOpenTicketFields,
  getJiraFields,
  getJiraOpenTicketFields
} from 'in-automation/ActionCatalog/shared';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { Header } from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import { positiveNumberValidator } from 'in-services/validators/number';
import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import { ApiKeyAuth, BasicAuth, BearerAuth } from 'in-automation/api';
import { notBlankValidator } from 'in-services/validators/string';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

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

function isValidUrl(string: string): ValidationResult {
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
        message: t('in-automation:ActionCatalog.theValueMustNotBeBlank')
      }
    ];
  }
  return null;
}

export function createActionFormDefinition(action: ActionFormEntity, _isCreate: boolean) {
  const tags = action.tags ?? [];
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));
  const parameters = action.inputParameters ?? [];
  const mappedParams = parameters.map(parameter => ({ id: generateUniqueShortId(), value: parameter }));
  let form: MapForm<any> = createMapForm()
    .put(
      'name',
      createField({
        value: action.name,
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: action.description ?? '',
        validator: isAnsible(action.type) ? undefined : notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: action.type,
        validator: notBlankValidator
      })
    )
    .put(
      'tags',
      createField({
        value: mappedTags,
        validator: tags => {
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag.value === '', false);
          if (hasBlankTags) {
            return [
              {
                severity: 'error',
                message: t('in-automation:ActionCatalog.theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
      })
    )
    .put(
      'parameters',
      createField({
        value: mappedParams
      })
    )
    .put(
      'selectedEvents',
      createField({
        value: List(action.selectedEvents)
      })
    )
    .put(
      'applicationAlertConfigIds',
      createField({
        value: List(action.applicationAlertConfigIds)
      })
    )
    .put(
      'timeout',
      createField({
        value: getTimeoutFromFields(action.fields).value,
        validator: (val: string) => {
          if (val === '') return null;
          return positiveNumberValidator(val);
        }
      })
    );
  if (isDocLink(action.type)) form = putDocLinkField(form, action);
  else if (isScript(action.type)) form = putScriptField(form, action);
  else if (isWebhook(action.type)) form = putWebhookFields(form, action);
  else if (isGithub(action.type)) form = putGithubFields(form, action);
  else if (isGitlab(action.type)) form = putGitlabFields(form, action);
  else if (isJira(action.type)) form = putJiraFields(form, action);
  return form;
}

export function putDocLinkField(form: MapForm<any>, action: ActionFormEntity): MapForm<any> {
  const value = getDocLinkFromFields(action.fields).value;

  // TODO: add validator for URL???
  return form.put(
    'docLink',
    createField({
      value: value,
      validator: composeAndShortCircuitOnError(notBlankValidator, isValidUrl)
    })
  );
}

export function removeDocLinkField(form: MapForm<any>) {
  return form.remove('docLink');
}

export function putScriptField(form: MapForm<any>, action: ActionFormEntity): MapForm<any> {
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

export function removeScriptField(form: MapForm<any>) {
  return form.remove('script').remove('subtype');
}

export function putGithubFields(form: MapForm<any>, action: ActionFormEntity) {
  const { owner, repo, ticketType } = getGithubFields(action);
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
      'ticketType',
      createField({
        value: ticketType.value,
        validator: notBlankValidator
      })
    );
  if (ticketType.value == OPEN) form = putGithubOpenTicketFields(form, action);
  else if (ticketType.value == CLOSE) form = putGithubCloseTicketFields(form, action);
  else if (ticketType.value == ADD_COMMENT) form = putGithubCommentTicketFields(form, action);
  return form;
}

export function removeGithubFields(form: MapForm<any>) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('owner').remove('repo').remove('ticketType');
}
export function putGithubOpenTicketFields(form: MapForm<any>, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeGithubOpenTicketFields(form);
  // Remove parameter with name "ticketId"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
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

export function putGithubCloseTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function putGithubCommentTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function removeGithubOpenTicketFields(form: MapForm<any>) {
  return form.remove('title').remove('body').remove('labels').remove('assignees');
}

export function removeCloseAndCommentTicketFields(form: MapForm<any>) {
  return form.remove('comment');
}

export function putGitlabFields(form: MapForm<any>, action: ActionFormEntity) {
  const { projectId, ticketType } = getGitlabFields(action);
  form = form
    .put(
      'projectId',
      createField({
        value: projectId.value,
        validator: notBlankValidator
      })
    )
    .put(
      'ticketType',
      createField({
        value: ticketType.value,
        validator: notBlankValidator
      })
    );
  if (ticketType.value == OPEN) form = putGitlabOpenTicketFields(form, action);
  else if (ticketType.value == CLOSE) form = putGitlabCloseTicketFields(form, action);
  else if (ticketType.value == ADD_COMMENT) form = putGitlabCommentTicketFields(form, action);
  return form;
}

export function removeGitlabFields(form: MapForm<any>) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('projectId').remove('ticketType');
}
export function putGitlabOpenTicketFields(form: MapForm<any>, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeGitlabOpenTicketFields(form);
  // Remove parameter with name "ticketId"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
  form = form.put('parameters', createField({ value: updatedParameters }));

  const { title, gitlab_description, labels, issue_type } = getGitlabOpenTicketFields(action);
  form = form
    .put(
      'title',
      createField({
        value: title.value,
        validator: notBlankValidator
      })
    )
    .put(
      'gitlab_description',
      createField({
        value: gitlab_description.value
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

export function putGitlabCloseTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function putGitlabCommentTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function removeGitlabOpenTicketFields(form: MapForm<any>) {
  return form.remove('title').remove('gitlab_description').remove('labels').remove('issue_type');
}

export function putJiraFields(form: MapForm<any>, action: ActionFormEntity) {
  const { project, ticketType } = getJiraFields(action);
  form = form
    .put(
      'project',
      createField({
        value: project.value,
        validator: notBlankValidator
      })
    )
    .put(
      'ticketType',
      createField({
        value: ticketType.value,
        validator: notBlankValidator
      })
    );
  if (ticketType.value == OPEN) form = putJiraOpenTicketFields(form, action);
  else if (ticketType.value == CLOSE) form = putJiraCloseTicketFields(form, action);
  else if (ticketType.value == ADD_COMMENT) form = putJiraCommentTicketFields(form, action);
  return form;
}

export function removeJiraFields(form: MapForm<any>) {
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
  form = form.put('parameters', createField({ value: updatedParameters }));
  form = removeCloseAndCommentTicketFields(form);
  return form.remove('project').remove('ticketType');
}
export function putJiraOpenTicketFields(form: MapForm<any>, action: ActionFormEntity) {
  form = removeCloseAndCommentTicketFields(form);
  form = removeJiraOpenTicketFields(form);
  // Remove parameter with name "ticketId"
  const parameters = (form.get('parameters') as Field<MappedParameter[]>).value;
  const updatedParameters = parameters.filter(param => param.value.name !== 'ticketId');
  form = form.put('parameters', createField({ value: updatedParameters }));

  const { summary, jira_description, labels, assignee, issue_type } = getJiraOpenTicketFields(action);
  form = form
    .put(
      'summary',
      createField({
        value: summary.value,
        validator: notBlankValidator
      })
    )
    .put(
      'jira_description',
      createField({
        value: jira_description.value,
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

export function putJiraCloseTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function putJiraCommentTicketFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function removeJiraOpenTicketFields(form: MapForm<any>) {
  return form.remove('summary').remove('jira_description').remove('labels').remove('assignee').remove('issue_type');
}

export function putWebhookFields(form: MapForm<any>, action: ActionFormEntity) {
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
    // TODO: add validator for URL???
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
  if (authenParsed.type == BASIC_AUTH) form = putBasicFields(form, action);
  else if (authenParsed.type == BEARER_TOKEN) form = putBearerField(form, action);
  else if (authenParsed.type == API_KEY) form = putApiKeyFields(form, action);
  return form;
}

export function removeWebhookFields(form: MapForm<any>) {
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

export function putBasicFields(form: MapForm<any>, action: ActionFormEntity) {
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
export function putBearerField(form: MapForm<any>, action: ActionFormEntity) {
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
export function putApiKeyFields(form: MapForm<any>, action: ActionFormEntity) {
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

export function removeBasicFields(form: MapForm<any>) {
  return form.remove('username').remove('password');
}
export function removeBearerField(form: MapForm<any>) {
  return form.remove('bearerToken');
}
export function removeApiKeyFields(form: MapForm<any>) {
  return form.remove('apiKey').remove('apiKeyValue').remove('apiKeyAddTo');
}

export const createTicketIdParameter = (description: string) => ({
  id: generateUniqueShortId(),
  value: {
    label: 'Ticket Id',
    name: 'ticketId',
    description: `${description}`,
    required: true,
    type: 'static',
    valueType: 'string'
  }
});
