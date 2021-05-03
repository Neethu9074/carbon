/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, notBlankValidator, createListForm } from 'formalistic';
import React, { Fragment } from 'react';
import { List } from 'immutable';

import { SvgIcon } from '@instana/components';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import SectionHelp from 'in-settings/components/SectionHelp';
import { generateUniqueShortId } from 'in-services/util/id';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import { emptyList } from 'in-services/fixedImmutables';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './webhookChannelConfig.mless';
import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'WEB_HOOK';
const label = t('in-settings:tabs.genericWebhook');

const parameters = [
  {
    key: 'name',
    label: t('in-settings:tabs.name')
  },
  {
    key: 'kind',
    label: t('in-settings:tabs.type')
  },
  {
    key: 'webhookUrls',
    label: t('in-settings:tabs.webhookUrLs')
  },
  {
    key: 'headers',
    label: t('in-settings:tabs.additionalHeaders')
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.webhookUrls = [''];
  },

  createDetails(alertChannel) {
    const webhookUrls = alertChannel.get('webhookUrls');
    if (!webhookUrls || webhookUrls.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-settings:tabs.webhooks')}>
          {webhookUrls.toArray().map(url => (
            <div key={url}>{url}</div>
          ))}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(alertChannel) {
    const headers = (alertChannel.get('headers') || emptyList)
      .toArray()
      .map(s => {
        const [key, value] = s.split(':', 2);
        if (isNotBlank(key) && isNotBlank(value)) {
          return createHeaderForm(key, value);
        }
        return null;
      })
      .filter(Boolean)
      .reduce((agg, subForm) => agg.push(subForm), createListForm());

    return createMapForm()
      .put(
        'kind',
        createField({
          value: name
        })
      )
      .put(
        'name',
        createField({
          value: alertChannel ? alertChannel.get('name') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'webhookUrls',
        createField({
          value: alertChannel ? alertChannel.get('webhookUrls') : List(['']),
          validator: webhooks
        })
      )
      .put('headers', headers);
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrls: form.get('webhookUrls').value,
      headers: form
        .get('headers')
        .toJS()
        .map(({ key, value }) => `${key}: ${value}`)
    };
  },

  Form
};

function webhooks(webhooks) {
  if (webhooks.size === 0) {
    return [
      {
        type: 'no_webhook',
        severity: 'error',
        message: t('in-settings:tabs.pleaseDefineAtLeastOneWebhookUrl')
      }
    ];
  }
  const errors = [];
  for (let i = 0, length = webhooks.size; i < length; i++) {
    const webhook = webhooks.get(i);
    const error = notBlankValidator(webhook);
    if (error.length > 0) {
      errors.push({
        urlIndex: i,
        severity: 'error',
        message: error[0].message
      });
    }
  }
  return errors;
}

function Form({ form, onChange }) {
  return (
    <fieldset>
      {form.get('name').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder={t('in-settings:tabs.genericWebhookAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('webhookUrls').map(field => (
        <FormGroup>
          <Label hasError={!field.valid && field.touched}>{t('in-settings:tabs.webhookUrLs')}</Label>
          {field.touched
            ? field.messages.map((message, i) => {
                if (message.type !== 'no_webhook') {
                  return null;
                }
                return (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                );
              })
            : null}
        </FormGroup>
      ))}
      {form.get('webhookUrls').map(field => {
        const webhookUrls = field.value;
        return webhookUrls.map((webhookUrl, i) => (
          <FormGroup key={i}>
            <div className={`${block}__input-delete-wrapper`}>
              <Input
                className={`${block}__input`}
                id={`webhookUrl_${webhookUrl}`}
                type="url"
                placeholder="https://hooks.example.com/services/A1B2C3D4E/A1B2C3D4E/abcDEFabcDEFabcDEFabcDEF"
                value={webhookUrl}
                onChange={e => onChangewebHookUrl(e, form, onChange, i)}
              />
              <Button
                className={`${block}__delete-button`}
                kind="danger"
                onClick={() => removewebHookUrl(form, onChange, i)}
              >
                {t('in-settings:tabs.remove')}
              </Button>
            </div>
            {field.touched
              ? field.messages
                  .filter(msg => msg.urlIndex === i)
                  .map((message, i) => (
                    <ValidationBlock hasError key={i}>
                      {message.message}
                    </ValidationBlock>
                  ))
              : null}
          </FormGroup>
        ));
      })}
      <div className={`${block}__add-button-wrapper`}>
        <span className={`${block}__add-link`} onClick={() => addwebHookUrl(form, onChange)}>
          {t('in-settings:tabs.addWebhookUrl')}
        </span>
      </div>

      <HttpHeaders form={form} onChange={onChange} addHeader={addHeader} removeHeader={removeHeader} />
    </fieldset>
  );
}

function onChangewebHookUrl(e, form, onChange, index) {
  const webhookUrls = form.get('webhookUrls').value.setIn([index], e.target.value);
  onChange('webhookUrls', webhookUrls);
}

function addwebHookUrl(form, onChange) {
  let webhookUrls = form.get('webhookUrls').value;
  webhookUrls = webhookUrls.push('');
  onChange('webhookUrls', webhookUrls);
}

function removewebHookUrl(form, onChange, index) {
  const webhookUrls = form.get('webhookUrls').value.deleteIn([index]);
  onChange('webhookUrls', webhookUrls);
}

function onChangeHeader(form, onChange, path, value) {
  const updatedHeaders = form.get('headers').updateIn(path, field => field.setValue(value).setTouched(true));
  onChange('headers', updatedHeaders, undefined, true);
}

function addHeader(form, onChange) {
  const headers = form
    .get('headers')
    .setTouched(true)
    .push(createHeaderForm());
  onChange('headers', headers, undefined, true);
}

function removeHeader(form, onChange, index) {
  const headers = form
    .get('headers')
    .setTouched(true)
    .remove(index);
  onChange('headers', headers, undefined, true);
}

function createHeaderForm(key, value) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: key || '',
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: value || '',
        validator: notBlankValidator
      })
    );
}

function HttpHeaders({ form, onChange, addHeader, removeHeader, disabled }) {
  return (
    <Fragment>
      <SectionHeading>{t('in-settings:tabs.customHttpRequestHeaders')}</SectionHeading>
      <SectionHelp>
        <p>{t('in-settings:tabs.customHttpHeadersAreUsefulToSupportAuthenticationMechanisms')}</p>
      </SectionHelp>

      {form.get('headers').map((header, i) => (
        <Fragment key={i}>
          <TouchedMessages field={header} />

          <div className={locals.removableRow}>
            <Row>
              <Col md={6}>
                {header.get('key').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-key`} hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.key')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-key`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChangeHeader(form, onChange, [i, 'key'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={6}>
                {header.get('value').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-value`} hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.value')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-value`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChangeHeader(form, onChange, [i, 'value'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
            </Row>

            <SvgIcon
              className={locals.removeButton}
              type="lib_actions_delete"
              onClick={() => !disabled && removeHeader(form, onChange, i)}
            />
          </div>
        </Fragment>
      ))}

      <div className={`${block}__add-button-wrapper`}>
        <span className={`${block}__add-link`} onClick={() => addHeader(form, onChange)}>
          {t('in-settings:tabs.addHeader')}
        </span>
      </div>
    </Fragment>
  );
}
