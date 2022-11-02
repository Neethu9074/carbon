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
import { notBlankValidator } from 'in-services/validators/string';
import { isNotBlank } from 'in-services/util/string';
import { NewAction } from 'in-api/automation';
import { t } from 'in-i18n';

function mimeValidator(str?: any): ValidationResult {
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

export function createActionFormDefinition(action: NewAction, _isCreate: boolean) {
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
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag?.value === '', false);
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

export function putDocLinkField(form: MapForm, action: NewAction) {
  const fields = action.fields;
  const value = isDocLink(action.type) ? fields?.[0].value : '';

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

export function putScriptField(form: MapForm, action: NewAction) {
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

export function putWebhookFields(form: MapForm, action: NewAction) {
  if (!isWebhook(action.type)) {
    return form
      .put('method', createField({ value: '', validator: notBlankValidator }))
      .put('host', createField({ value: '', validator: notBlankValidator }))
      .put('body', createField({ value: '', validator: notBlankValidator }))
      .put('ignoreCertErrors', createField({ value: false, validator: notBlankValidator }))
      .put('username', createField({ value: '', validator: notBlankValidator }))
      .put('password', createField({ value: '', validator: notBlankValidator }))
      .put('contentType', createField({ value: '', validator: notBlankValidator }))
      .put('accept', createField({ value: '', validator: notBlankValidator }))
      .put('acceptLanguage', createField({ value: '', validator: notBlankValidator }))
      .put('additionalHeaders', createField({ value: [], validator: notBlankValidator }));
  } else {
    const fields = keyBy(action.fields, 'name');
    const method = fields.method;
    const host = fields.host;
    const body = fields.body;
    const headers = fields.header;
    const headersValue = JSON.parse(headers.value);
    const ignoreCertErrors = fields.ignoreCertErrors;
    const authen = fields.authen;
    const authenValue = JSON.parse(authen.value ?? '{}');
    const {
      'Content-Type': contentType,
      Accept: accept,
      'Accept-Language': acceptLanguage,
      ...additionalHeaders
    } = headersValue;

    return form
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
          value: ignoreCertErrors.value
        })
      )
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
            value: header as [string, string],
            id: generateUniqueShortId()
          })),
          validator: tags => {
            const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || (tag?.value?.includes('') ?? false), false);
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
