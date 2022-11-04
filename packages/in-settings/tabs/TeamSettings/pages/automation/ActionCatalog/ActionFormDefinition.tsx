/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';
import { keyBy } from 'lodash';
import mime from 'mime/lite';

import { generateUniqueShortId } from '@instana/utils';

import { isDocLink, isScript, isWebhook } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import { notBlankValidator } from 'in-services/validators/string';
import { isNotBlank } from 'in-services/util/string';
import { Field } from 'in-types';
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

export function createActionFormDefinition(action: ActionFormEntity, _isCreate: boolean) {
  const tags = action.tags ?? [];
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));

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
    );
  if (isDocLink(action.type)) form = putDocLinkField(form, action);
  else if (isScript(action.type)) form = putScriptField(form, action);
  else if (isWebhook(action.type)) form = putWebhookFields(form, action);
  return form;
}

export function putDocLinkField(form: MapForm, action: ActionFormEntity) {
  const fields = action.fields;
  const value = isDocLink(action.type) ? fields?.[0].value ?? '' : '';

  return form.put(
    'docLink',
    createField({
      value: value ?? '',
      validator: notBlankValidator
    })
  );
}

export function removeDocLinkField(form: MapForm) {
  return form.remove('docLink');
}

export function putScriptField(form: MapForm, action: ActionFormEntity) {
  let value = '';
  if (isScript(action.type)) {
    const fields = action.fields;
    const field = fields?.[1];
    value = atob(field?.value ?? '');
  }

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
  if (!isWebhook(action.type)) {
    return form
      .put('method', createField({ value: '', validator: notBlankValidator }))
      .put('host', createField({ value: '', validator: notBlankValidator }))
      .put('body', createField({ value: '', validator: notBlankValidator }))
      .put('ignoreCertErrors', createField({ value: false, validator: notBlankValidator }))
      .put('authType', createField({ value: 'none', validator: notBlankValidator }))
      .put('username', createField({ value: '', validator: notBlankValidator }))
      .put('password', createField({ value: '', validator: notBlankValidator }))
      .put('contentType', createField({ value: '', validator: notBlankValidator }))
      .put('accept', createField({ value: '', validator: notBlankValidator }))
      .put('acceptLanguage', createField({ value: '', validator: notBlankValidator }))
      .put('additionalHeaders', createField({ value: [], validator: notBlankValidator }));
  } else {
    const fields = keyBy(action.fields, 'name') as Record<string, Field | null>;
    const method = fields.method;
    const host = fields.host;
    const body = fields.body;
    const headers = fields.header;
    const headersValue = JSON.parse(headers?.value ?? '{}') as { [k: string]: string };
    const ignoreCertErrors = fields.ignoreCertErrors;
    const authen = fields.authen;
    const authenValue = JSON.parse(authen?.value ?? '{}') as { type: string };
    const {
      'Content-Type': contentType,
      Accept: accept,
      'Accept-Language': acceptLanguage,
      ...additionalHeaders
    } = headersValue;

    let form = createMapForm()
      .put(
        'method',
        createField({
          value: method?.value ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'host',
        createField({
          value: host?.value ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'body',
        createField({
          value: body?.value ?? ''
        })
      )
      .put(
        'ignoreCertErrors',
        createField({
          value: ignoreCertErrors?.value ?? false
        })
      )
      .put(
        'authType',
        createField({
          value: authenValue.type ?? 'none'
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
          validator: additionalHeaders => {
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
        })
      );
    if (authenValue.type == 'basicAuth') form = putBasicFields(form, action);
    else if (authenValue.type == 'bearerToken') form = putBearerField(form, action);
    else if (authenValue.type == 'apiKey') form = putApiKeyFields(form, action);
    return form;
  }
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
  const fields = keyBy(action.fields, 'name') as Record<string, Field | null>;
  const authen = fields.authen;
  const authenValue = JSON.parse(authen?.value ?? '{}') as { username?: string; password?: string };
  form = removeApiKeyFields(form);
  form = removeBearerField(form);
  return form
    .put(
      'username',
      createField({
        value: authenValue.username ?? ''
      })
    )
    .put(
      'password',
      createField({
        value: authenValue.password ?? ''
      })
    );
}
export function putBearerField(form: MapForm, action: ActionFormEntity) {
  const fields = keyBy(action.fields, 'name') as Record<string, Field | null>;
  const authen = fields.authen;
  const authenValue = JSON.parse(authen?.value ?? '{}') as { bearerToken?: string };
  form = removeBasicFields(form);
  form = removeApiKeyFields(form);
  return form.put(
    'bearerToken',
    createField({
      value: authenValue.bearerToken ?? ''
    })
  );
}
export function putApiKeyFields(form: MapForm, action: ActionFormEntity) {
  const fields = keyBy(action.fields, 'name') as Record<string, Field | null>;
  const authen = fields.authen;
  const authenValue = JSON.parse(authen?.value ?? '{}') as {
    apiKey?: string;
    apiKeyValue?: string;
    apiKeyAddTo?: string;
  };
  form = removeBasicFields(form);
  form = removeBearerField(form);
  return form
    .put(
      'apiKey',
      createField({
        value: authenValue.apiKey ?? ''
      })
    )
    .put(
      'apiKeyValue',
      createField({
        value: authenValue.apiKeyValue ?? ''
      })
    )
    .put(
      'apiKeyAddTo',
      createField({
        value: authenValue.apiKeyAddTo ?? 'header'
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
