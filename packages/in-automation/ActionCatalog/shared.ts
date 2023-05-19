/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { keyBy } from 'lodash';

import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import { AdditionalHeaders, Authen } from 'in-automation/api';
import { Field, Nullish } from 'in-types';
import { t } from 'in-i18n';

export const getType = (action: ActionFormEntity | Nullish) => {
  if (isDocLink(action?.type)) {
    return t('in-automation:ActionCatalog.docLink');
  } else if (isScript(action?.type)) {
    return t('in-automation:ActionCatalog.script');
  } else if (isWebhook(action?.type)) {
    return t('in-automation:ActionCatalog.http');
  } else if (isAnsible(action?.type)) {
    return t('in-automation:ActionCatalog.ansible');
  } else {
    return action?.type;
  }
};

const getFieldsByNames = (fields: Field[] | undefined): Record<string, Field | null> => keyBy(fields, 'name');
export const getScriptFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.script_content ??
  getFieldsByNames(fields)?.script_ssh ?? { value: '', encoding: 'base64', name: 'script_ssh' };
export const getInterpreterFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.interpreter ??
  getFieldsByNames(fields)?.subtype ?? { value: '', encoding: 'base64', name: 'subtype' };
export const getDocLinkFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.URL ?? { value: '', encoding: 'UTF8', name: 'URL' };
export const getBodyFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getHeaderFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.header ?? { value: '{}', encoding: 'ascii', name: 'header' };
export const getMethodFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.method ?? { value: 'GET', encoding: 'ascii', name: 'method' };
export const getHostFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.host ?? { value: '', encoding: 'ascii', name: 'host' };
export const getIgnoreCertErrorsFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ignoreCertErrors ?? { value: 'false', encoding: 'ascii', name: 'ignoreCertErrors' };
export const getAuthenFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.authen ?? { value: `{"type":"${NO_AUTH}"}`, encoding: 'ascii', name: 'authen' };

interface WebhookFields {
  host: Field;
  method: Field;
  body: Field;
  ignoreCertErrors: Field;
  authenParsed: Authen;
  authen: Field;
  headerParsed: AdditionalHeaders;
  header: Field;
}
export function getWebhookFields(action: ActionFormEntity): WebhookFields {
  const host = getHostFromFields(action.fields);
  const method = getMethodFromFields(action.fields);
  const body = getBodyFromFields(action.fields);
  const header = getHeaderFromFields(action.fields);
  const ignoreCertErrors = getIgnoreCertErrorsFromFields(action.fields);
  const authen = getAuthenFromFields(action.fields);
  const authenParsed: Authen = JSON.parse(authen.value);
  const headerParsed: AdditionalHeaders = JSON.parse(header.value);
  return { host, method, body, ignoreCertErrors, authen, authenParsed, header, headerParsed };
}

export const isDocLink = (type?: string) => type === DOC_LINK_TYPE;
export const isScript = (type?: string) => type === SCRIPT_TYPE;
export const isWebhook = (type?: string) => type === WEBHOOK_TYPE;
export const isAnsible = (type?: string) => type === ANSIBLE_TYPE;

export const DOC_LINK_TYPE = 'doc_link';
export const SCRIPT_TYPE = 'SCRIPT';
export const WEBHOOK_TYPE = 'HTTP';
export const ANSIBLE_TYPE = 'ANSIBLE';

export const HTTP_METHODS = Object.freeze(['GET', 'POST', 'PUT', 'DELETE']);
export const HTTP_METHODS_WITH_BODY = Object.freeze(['POST', 'PUT']);

export const NO_AUTH = 'noAuth';
export const BASIC_AUTH = 'basicAuth';
export const BEARER_TOKEN = 'bearerToken';
export const API_KEY = 'apiKey';

export const AUTH_TYPES = Object.freeze([
  { value: NO_AUTH, translation: t('in-automation:ActionCatalog.noAuth') },
  { value: BASIC_AUTH, translation: t('in-automation:ActionCatalog.basicAuth') },
  { value: BEARER_TOKEN, translation: t('in-automation:ActionCatalog.bearerToken') },
  { value: API_KEY, translation: t('in-automation:ActionCatalog.apiKey') }
]);

function safeParseJSON<T>(str: string = '{}') {
  try {
    return JSON.parse(str) as T;
  } catch {
    return {};
  }
}

type VaultParameter = { secretKey: string; secretPath: string };
const isVaultParameter = (param: VaultParameter | {}): param is VaultParameter => {
  return 'secretKey' in param && 'secretPath' in param;
};
export const parseVaultParameter = (str?: string) => {
  const vaultParameter = safeParseJSON<VaultParameter>(str);
  if (!isVaultParameter(vaultParameter)) {
    return { secretKey: '', secretPath: '' };
  }
  return vaultParameter;
};

type DynamicParameter = { key?: string; tagName: string };
const isDynamicParameter = (param: DynamicParameter | {}): param is DynamicParameter => {
  return 'tagName' in param;
};
export const parseDynamicParameter = (str?: string) => {
  const dynamicParameter = safeParseJSON<DynamicParameter>(str);
  if (!isDynamicParameter(dynamicParameter)) {
    return { key: '', tagName: '' };
  }
  return dynamicParameter;
};
