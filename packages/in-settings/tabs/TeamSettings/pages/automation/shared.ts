/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { keyBy } from 'lodash';

import { AdditionalHeaders, Authen } from 'in-api/automation';
import { ActionFormEntity } from './ActionCatalog/Action';
import { Field, Nullish } from 'in-types';
import { Action } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: Action | Nullish) => {
  if (isDocLink(action?.type)) {
    return t('in-settings:tabs.docLink');
  } else if (isScript(action?.type)) {
    return t('in-settings:tabs.script');
  } else if (isWebhook(action?.type)) {
    return t('in-settings:tabs.http');
  } else {
    return action?.type;
  }
};

const getFieldsByNames = (fields: Field[] | undefined): Record<string, Field | null> => keyBy(fields, 'name');
export const getScriptFromFields = (fields: Field[] | undefined) =>
  getFieldsByNames(fields)?.script_content?.value ?? getFieldsByNames(fields)?.script_ssh?.value ?? '';
export const getInterpreterFromFields = (fields: Field[] | undefined) =>
  getFieldsByNames(fields)?.interpreter?.value ?? getFieldsByNames(fields)?.subtype?.value ?? '';
export const getDocLinkFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.URL?.value ?? '';
export const getBodyFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.body?.value ?? '';
export const getHeaderFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.header?.value ?? '{}';
export const getMethodFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.method?.value ?? 'GET';
export const getHostFromFields = (fields: Field[] | undefined) => getFieldsByNames(fields)?.host?.value ?? '';
export const getIgnoreCertErrorsFromFields = (fields: Field[] | undefined) =>
  getFieldsByNames(fields)?.ignoreCertErrors?.value ?? 'false';
export const getAuthenFromFields = (fields: Field[] | undefined) =>
  getFieldsByNames(fields)?.authen?.value ?? `{"type":"${NO_AUTH}"}`;

export function getWebhookFields(action: ActionFormEntity) {
  const host = getHostFromFields(action.fields);
  const method = getMethodFromFields(action.fields);
  const body = getBodyFromFields(action.fields);
  const headerString = getHeaderFromFields(action.fields);
  const ignoreCertErrors = getIgnoreCertErrorsFromFields(action.fields);
  const authenString = getAuthenFromFields(action.fields);
  const authen: Authen = JSON.parse(authenString);
  const header: AdditionalHeaders = JSON.parse(headerString);
  return { host, method, body, ignoreCertErrors, authen, authenString, headerString, header };
}

export const isDocLink = (type?: string) => type === DOC_LINK_TYPE;
export const isScript = (type?: string) => type === SCRIPT_TYPE;
export const isWebhook = (type?: string) => type === WEBHOOK_TYPE;

export const DOC_LINK_TYPE = 'doc_link';
export const SCRIPT_TYPE = 'SCRIPT';
export const WEBHOOK_TYPE = 'HTTP';

export const HTTP_METHODS = Object.freeze(['GET', 'POST', 'PUT', 'DELETE']);
export const HTTP_METHODS_WITH_BODY = Object.freeze(['POST', 'PUT']);

export const NO_AUTH = 'noAuth';
export const BASIC_AUTH = 'basicAuth';
export const BEARER_TOKEN = 'bearerToken';
export const API_KEY = 'apiKey';

export const AUTH_TYPES = Object.freeze([
  { value: NO_AUTH, translation: t('in-settings:tabs.noAuth') },
  { value: BASIC_AUTH, translation: t('in-settings:tabs.basicAuth') },
  { value: BEARER_TOKEN, translation: t('in-settings:tabs.bearerToken') },
  { value: API_KEY, translation: t('in-settings:tabs.apiKey') }
]);
