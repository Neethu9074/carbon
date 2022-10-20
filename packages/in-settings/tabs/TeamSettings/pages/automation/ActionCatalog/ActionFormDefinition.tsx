/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';
import { List, Map } from 'immutable';
import mime from 'mime/lite';

import { generateUniqueShortId } from '@instana/utils';

import { isDocLink, isScript, isWebhook } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { notBlankValidator } from 'in-services/validators/string';
import { ImmutableNewAction } from 'in-api/automation';
import { isNotBlank } from 'in-services/util/string';
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

export function createActionFormDefinition(action: ImmutableNewAction, _isCreate: boolean) {
  const tags = (action.get('tags') as List<string>) ?? List();
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: action.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: action.get('description'),
        validator: notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: action.get('type'),
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
  if (isDocLink(action.get('type') as string)) form = putDocLinkField(form, action);
  else if (isScript(action.get('type') as string)) form = putScriptField(form, action);
  else if (isWebhook(action.get('type') as string)) form = putWebhookFields(form, action);
  return form;
}

export function putDocLinkField(form: MapForm, action: ImmutableNewAction) {
  const fields = action.get('fields') as List<Map<string, unknown>>;
  const value = isDocLink(action.get('type') as string) ? fields?.get(0)?.get('value') : '';

  return form.put(
    'docLink',
    createField({
      value,
      validator: notBlankValidator
    })
  );
}

export function removeDocLinkField(form: MapForm) {
  return form.remove('docLink');
}

export function putScriptField(form: MapForm, action: ImmutableNewAction) {
  let value = '';
  if (isScript(action.get('type') as string)) {
    const fields = action.get('fields') as List<Map<string, unknown>>;
    const field = fields.get(1);
    value = atob(field.get('value') as string);
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

export function putWebhookFields(form: MapForm, action: ImmutableNewAction) {
  if (!isWebhook(action.get('type') as string)) {
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
      .put('additionalHeaders', createField({ value: List(), validator: notBlankValidator }));
  } else {
    const fields = (action.get('fields') as List<Map<string, unknown>>)
      .toMap()
      .mapKeys((_, val: Map<string, unknown> | undefined) => val?.get('name'));
    const method = fields.get('method');
    const host = fields.get('host');
    const body = fields.get('body');
    const headers = fields.get('header');
    const headersValue = JSON.parse(headers.get('value') as string);
    const ignoreCertErrors = fields.get('ignoreCertErrors');
    const authen = fields.get('authen');
    const authenValue = JSON.parse((authen?.get('value') as string) ?? '{}');
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
          value: method?.get('value') ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'host',
        createField({
          value: host?.get('value') ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'body',
        createField({
          value: body?.get('value') ?? ''
        })
      )
      .put(
        'ignoreCertErrors',
        createField({
          value: ignoreCertErrors?.get('value') ?? true
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
          value: List(
            Object.entries(additionalHeaders).map(header => ({
              value: header as [string, string],
              id: generateUniqueShortId()
            }))
          ),
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
