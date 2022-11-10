/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { keyBy } from 'lodash';

import { Field, Nullish } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: Action | Nullish) => {
  if (isDocLink(action?.type)) {
    return t('in-settings:tabs.docLink');
  } else if (isScript(action?.type)) {
    return t('in-settings:tabs.script');
  } else if (isWebhook(action?.type)) {
    return t('in-settings:tabs.HTTP');
  } else {
    return action?.type;
  }
};

const getFieldsByNames = (fields: Field[] | undefined): Record<string, Field | null> => keyBy(fields, 'name');
export const getScriptFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.script_ssh;
export const getDocLinkFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.URL;

export const isDocLink = (type?: string) => type === DOC_LINK_TYPE;
export const isScript = (type?: string) => type === SCRIPT_TYPE;
export const isWebhook = (type?: string) => type === WEBHOOK_TYPE;

export const DOC_LINK_TYPE = 'doc_link';
export const SCRIPT_TYPE = 'SCRIPT';
export const WEBHOOK_TYPE = 'HTTP';

export const HTTP_METHODS = Object.freeze(['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'TRACE']);

export const AUTH_TYPES = Object.freeze([
  { value: 'noAuth', translation: t('in-settings:tabs.noAuth') },
  { value: 'basicAuth', translation: t('in-settings:tabs.basicAuth') },
  { value: 'bearerToken', translation: t('in-settings:tabs.bearerToken') },
  { value: 'apiKey', translation: t('in-settings:tabs.apiKey') }
]);
