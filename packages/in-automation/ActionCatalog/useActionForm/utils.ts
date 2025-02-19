/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { generateUniqueShortId } from '@instana/utils';
import { Field as ActionField } from '@instana/types';

import {
  TicketTypes,
  createDocLinkField,
  createScriptFields,
  createManualField,
  createWebhookFields,
  createTimeoutField,
  createGithubFields,
  createGitlabFields,
  createJiraFields
} from 'in-automation/utils/actionField';
import { ActionForm, MappedParameter } from 'in-automation/ActionCatalog/useActionForm/types';
import { ACTION_TYPE, OPEN, CLOSE, ADD_COMMENT, AUTH_TYPE } from 'in-automation/constants';
import { NewAction, BasicAuth, BearerAuth, ApiKeyAuth, NoAuth } from 'in-automation/types';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';

export function createTicketIdParameter(type: string, description: string): MappedParameter {
  return {
    id: generateUniqueShortId(),
    value: {
      label: `${type} Id`,
      name: 'id',
      description: description,
      required: true,
      type: 'static',
      valueType: 'string'
    }
  };
}

function getAuthenFromForm(form: ActionForm) {
  const authType = form.get('authType').value;
  if (authType === AUTH_TYPE.BASIC_AUTH) {
    const username = form.get('username').value;
    const password = form.get('password').value;
    return {
      type: AUTH_TYPE.BASIC_AUTH,
      username,
      password
    } as BasicAuth;
  } else if (authType === AUTH_TYPE.BEARER_TOKEN) {
    const bearerToken = form.get('bearerToken').value;
    return {
      type: AUTH_TYPE.BEARER_TOKEN,
      bearerToken
    } as BearerAuth;
  } else if (authType === AUTH_TYPE.API_KEY) {
    const apiKey = form.get('apiKey').value;
    const apiKeyValue = form.get('apiKeyValue').value;
    const apiKeyAddTo = form.get('apiKeyAddTo').value;
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

export function getActionFromForm(form: ActionForm, action?: ActionFormEntity): NewAction {
  const name = form.get('name').value;
  const description = form.get('description').value;
  const type = form.get('type').value;
  const tags = form.get('tags').value;
  const parameters = form.get('parameters').value;
  const timeout = form.get('timeout').value;
  const fields: ActionField[] = [];
  switch (type) {
    case 'SCRIPT': {
      const value = form.get('script').value;
      const subtype = form.get('subtype').value;
      fields.push(...createScriptFields({ value, subtype, timeout }));
      break;
    }
    case 'HTTP': {
      const host = form.get('host').value;
      const method = form.get('method').value;
      const accept = form.get('accept').value;
      const acceptLanguage = form.get('acceptLanguage').value;
      const contentType = form.get('contentType').value;
      const additionalHeaders = form.get('additionalHeaders').value;
      const body = form.get('httpBody').value;
      const ignoreCertErrors = form.get('ignoreCertErrors').value;
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
      break;
    }
    case 'ANSIBLE': {
      fields.push(...(action?.fields ?? []), createTimeoutField(timeout));
      break;
    }
    case 'EXTERNAL':
      break;
    case 'GITHUB': {
      const owner = form.get('owner').value;
      const repo = form.get('repo').value;
      const ticketActionType = form.get('ticketActionType').value;
      let type: TicketTypes | null = null;
      if (ticketActionType === OPEN) {
        const title = form.get('title').value;
        const body = form.get('body').value;
        const labels = form.get('labels').value;
        const assignees = form.get('assignees').value;
        const labelsString = labels.map(label => label.value).join(',');
        const assigneesString = assignees.map(assignee => assignee.value).join(',');
        type = {
          type: 'open',
          title,
          body,
          labels: labelsString,
          assignees: assigneesString
        };
      } else if (ticketActionType === CLOSE) {
        const comment = form.get('comment').value;
        type = {
          type: 'close',
          comment
        };
      } else if (ticketActionType === ADD_COMMENT) {
        const comment = form.get('comment').value;
        type = {
          type: 'add_comment',
          comment
        };
      }
      fields.push(...createGithubFields({ owner: owner, repo: repo, ticketActionType: type }));
      break;
    }
    case 'GITLAB': {
      const projectId = form.get('projectId').value;
      const ticketActionType = form.get('ticketActionType').value;
      let type: TicketTypes | null = null;
      if (ticketActionType === OPEN) {
        const title = form.get('title').value;
        const body = form.get('body').value;
        const labels = form.get('labels').value;
        const issue_type = form.get('issue_type').value;
        const labelsString = labels.map(label => label.value).join(',');
        type = {
          type: 'open',
          title,
          body,
          labels: labelsString,
          issue_type
        };
      } else if (ticketActionType === CLOSE) {
        const comment = form.get('comment').value;
        type = {
          type: 'close',
          comment
        };
      } else if (ticketActionType === ADD_COMMENT) {
        const comment = form.get('comment').value;
        type = {
          type: 'add_comment',
          comment
        };
      }
      fields.push(...createGitlabFields({ projectId: projectId, ticketActionType: type }));
      break;
    }
    case 'JIRA': {
      const project = form.get('project').value;
      const ticketActionType = form.get('ticketActionType').value;
      let type: TicketTypes | null = null;
      if (ticketActionType === OPEN) {
        const summary = form.get('summary').value;
        const body = form.get('body').value;
        const labels = form.get('labels').value;
        const assignee = form.get('assignee').value;
        const issue_type = form.get('issue_type').value;
        const labelsString = labels.map(tag => tag.value).join(',');
        type = {
          type: 'open',
          summary,
          body,
          labels: labelsString,
          assignee,
          issue_type
        };
      } else if (ticketActionType === CLOSE) {
        const comment = form.get('comment').value;
        type = {
          type: 'close',
          comment
        };
      } else if (ticketActionType === ADD_COMMENT) {
        const comment = form.get('comment').value;
        type = {
          type: 'add_comment',
          comment
        };
      }
      fields.push(...createJiraFields({ project: project, ticketActionType: type }));
      break;
    }
    case 'MANUAL': {
      const content = form.get('manualContent').value;
      fields.push(createManualField(content));
      break;
    }
    case 'DOC_LINK': {
      const docLink = form.get('docLink').value;
      fields.push(createDocLinkField(docLink));
      break;
    }
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
