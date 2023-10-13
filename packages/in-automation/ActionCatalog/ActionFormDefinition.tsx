/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';
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
  getGithubFields,
  isDocLink,
  isScript,
  isWebhook,
  isAnsible
} from 'in-automation/ActionCatalog/shared';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
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

export function removeGitlabField(form: MapForm<any>) {
  return form.remove('github').remove('subtype');
}

export function removeGithubField(form: MapForm<any>) {
  return form.remove('gitlab').remove('subtype');
}

export function putGithubFields(form: MapForm<any>, action: ActionFormEntity) {
  const { title, body, labels } = getGithubFields(action);
  form = form
    .put(
      'title',
      createField({
        value: title.value,
        validator: notBlankValidator
      })
    )
    // TODO: add validator for URL???
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
        value: labels.value
      })
    );
  return form;
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
