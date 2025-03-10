/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field } from 'formalistic';

import { ActionType } from '@instana/types';

import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';
import { ACTION_TYPE } from 'in-automation/constants';
import { t } from 'in-i18n';

function isFieldValid(field: Field<any>): boolean {
  return field.valid || !field.touched;
}

export const isMetadataValid = (form: ActionForm): boolean =>
  isFieldValid(form.get('name')) && isFieldValid(form.get('description'));

export const isDocActionConfigurationValid = (form: ActionForm): boolean => isFieldValid(form.get('docLink'));

export const isScriptActionConfigurationValid = (form: ActionForm): boolean => isFieldValid(form.get('script'));

export const isGHActionConfigurationValid = (form: ActionForm): boolean =>
  isFieldValid(form.get('owner')) &&
  isFieldValid(form.get('repo')) &&
  ((form.get('ticketActionType').value === 'open' &&
    isFieldValid(form.get('title')) &&
    isFieldValid(form.get('body'))) ||
    (form.get('ticketActionType').value === 'add_comment' && isFieldValid(form.get('comment'))) ||
    form.get('ticketActionType').value === 'close');

export const isGLActionConfigurationValid = (form: ActionForm): boolean =>
  isFieldValid(form.get('projectId')) &&
  ((form.get('ticketActionType').value === 'open' &&
    isFieldValid(form.get('title')) &&
    isFieldValid(form.get('body'))) ||
    (form.get('ticketActionType').value === 'add_comment' && isFieldValid(form.get('comment'))) ||
    form.get('ticketActionType').value === 'close');

export const isJiraActionConfigurationValid = (form: ActionForm): boolean =>
  isFieldValid(form.get('projectId')) &&
  ((form.get('ticketActionType').value === 'open' &&
    isFieldValid(form.get('summary')) &&
    isFieldValid(form.get('body'))) ||
    (form.get('ticketActionType').value === 'add_comment' && isFieldValid(form.get('comment'))) ||
    form.get('ticketActionType').value === 'close');

export const isHTTPActionConfigurationValid = (form: ActionForm): boolean =>
  isFieldValid(form.get('host')) &&
  isFieldValid(form.get('additionalHeaders')) &&
  isFieldValid(form.get('contentType')) &&
  isFieldValid(form.get('accept')) &&
  ((form.get('authType').value === 'basicAuth' &&
    isFieldValid(form.get('username')) &&
    isFieldValid(form.get('password'))) ||
    (form.get('authType').value === 'bearerToken' && isFieldValid(form.get('bearerToken'))) ||
    (form.get('authType').value === 'apiKey' &&
      isFieldValid(form.get('apiKey')) &&
      isFieldValid(form.get('apiKeyValue'))) ||
    form.get('authType').value === 'noAuth');

export const isManualActionConfigurationValid = (form: ActionForm): boolean => isFieldValid(form.get('manualContent'));

export const isActionConfigurationValid = (form: ActionForm, type: ActionType): boolean => {
  switch (type) {
    case ACTION_TYPE.GITHUB:
      return isGHActionConfigurationValid(form);
    case ACTION_TYPE.GITLAB:
      return isGLActionConfigurationValid(form);
    case ACTION_TYPE.JIRA:
      return isJiraActionConfigurationValid(form);
    case ACTION_TYPE.HTTP:
      return isHTTPActionConfigurationValid(form);
    case ACTION_TYPE.SCRIPT:
      return isScriptActionConfigurationValid(form);
    case ACTION_TYPE.DOC_LINK:
      return isDocActionConfigurationValid(form);
    case ACTION_TYPE.MANUAL:
      return isManualActionConfigurationValid(form);
    case ACTION_TYPE.ANSIBLE:
      return true;
    default:
      return false;
  }
};

export const generateNavItems = (form: ActionForm) => {
  const type = form.get('type').value;
  return [
    {
      label: t('in-automation:ActionCatalog.actionDetails'),
      scrollId: '1-action-details',
      title: t('in-automation:ActionCatalog.actionDetails'),
      content: null,
      valid: isMetadataValid(form)
    },
    {
      label: t('in-automation:ActionCatalog.actionConfiguration'),
      scrollId: '2-action-configuration',
      title: t('in-automation:ActionCatalog.actionConfiguration'),
      content: null,
      valid: isActionConfigurationValid(form, type)
    },
    {
      label: t('in-automation:ActionCatalog.parameterDetails'),
      scrollId: '3-parameter-details',
      title: t('in-automation:ActionCatalog.parameterDetails'),
      content: null,
      valid: true,
      hidden: [ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(type ?? ACTION_TYPE.DOC_LINK)
    }
  ];
};
