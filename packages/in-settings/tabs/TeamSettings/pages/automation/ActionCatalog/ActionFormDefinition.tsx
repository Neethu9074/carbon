/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';
import mime from 'mime/lite';

import { generateUniqueShortId } from '@instana/utils';

import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  getAuthenFromFields,
  getDocLinkFromFields,
  getScriptFromFields,
  getWebhookFields,
  isDocLink,
  isScript,
  isWebhook
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { Header } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/AdditionalHeadersTable';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import { ApiKeyAuth, BasicAuth, BearerAuth } from 'in-api/automation';
import { notBlankValidator } from 'in-services/validators/string';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

function mimeValidator(str: string): ValidationResult {
  if (isNotBlank(str) && mime.getExtension(str) == null) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.theValueMustBeValidMime')
      }
    ];
  }

  return null;
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
        message: t('in-services:validators.theValueMustNotBeBlank')
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
  let form = createMapForm()
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
        validator: notBlankValidator
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
                message: t('in-services:validators.theValueMustNotBeBlank')
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
    );
  if (isDocLink(action.type)) form = putDocLinkField(form, action);
  else if (isScript(action.type)) form = putScriptField(form, action);
  else if (isWebhook(action.type)) form = putWebhookFields(form, action);
  return form;
}

export function putDocLinkField(form: MapForm, action: ActionFormEntity) {
  const value = getDocLinkFromFields(action.fields);

  // TODO: add validator for URL???
  return form.put(
    'docLink',
    createField({
      value: value,
      validator: notBlankValidator
    })
  );
}

export function removeDocLinkField(form: MapForm) {
  return form.remove('docLink');
}

export function putScriptField(form: MapForm, action: ActionFormEntity) {
  const value = atob(getScriptFromFields(action.fields));

  return form.put(
    'script',
    createField({
      value,
      validator: notBlankValidator
    })
  );
}

export function removeScriptField(form: MapForm) {
  return form.remove('script');
}

export function putWebhookFields(form: MapForm, action: ActionFormEntity) {
  const { method, host, body, header, ignoreCertErrors, authen } = getWebhookFields(action);
  const {
    'Content-Type': contentType,
    Accept: accept,
    'Accept-Language': acceptLanguage,
    ...additionalHeaders
  } = header;
  form = form
    .put(
      'method',
      createField({
        value: method,
        validator: notBlankValidator
      })
    )
    // TODO: add validator for URL???
    .put(
      'host',
      createField({
        value: host,
        validator: notBlankValidator
      })
    )
    .put(
      'body',
      createField({
        value: body
      })
    )
    .put(
      'ignoreCertErrors',
      createField({
        value: ignoreCertErrors === 'true'
      })
    )
    .put(
      'authType',
      createField({
        value: authen.type,
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
  if (authen.type == BASIC_AUTH) form = putBasicFields(form, action);
  else if (authen.type == BEARER_TOKEN) form = putBearerField(form, action);
  else if (authen.type == API_KEY) form = putApiKeyFields(form, action);
  return form;
}

export function removeWebhookFields(form: MapForm) {
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
    .remove('additionalHeaders');
}

export function putBasicFields(form: MapForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: BasicAuth = JSON.parse(authenString);
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
export function putBearerField(form: MapForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: BearerAuth = JSON.parse(authenString);
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
export function putApiKeyFields(form: MapForm, action: ActionFormEntity) {
  const authenString = getAuthenFromFields(action.fields);
  const authen: ApiKeyAuth = JSON.parse(authenString);
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

export function removeBasicFields(form: MapForm) {
  return form.remove('username').remove('password');
}
export function removeBearerField(form: MapForm) {
  return form.remove('bearerToken');
}
export function removeApiKeyFields(form: MapForm) {
  return form
    .remove('apiKey')
    .remove('apiKeyValue')
    .remove('apiKeyAddTo');
}
