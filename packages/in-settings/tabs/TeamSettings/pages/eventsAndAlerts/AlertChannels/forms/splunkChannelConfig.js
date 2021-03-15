/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'SPLUNK';
const label = t('in-settings:tabs.splunk');

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
    key: 'url',
    label: t('in-settings:tabs.url')
  },
  {
    key: 'token',
    label: t('in-settings:tabs.token')
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.url = '';
    alertChannel.token = '';
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList>
        <DescriptionItem title={t('in-settings:tabs.url')}>{alertChannel.get('url')}</DescriptionItem>
        <DescriptionItem title={t('in-settings:tabs.token')}>{alertChannel.get('token')}</DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(alertChannel) {
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
        'url',
        createField({
          value: alertChannel ? alertChannel.get('url') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'token',
        createField({
          value: alertChannel ? alertChannel.get('token') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      url: form.get('url').value,
      token: form.get('token').value
    };
  },

  Form
};

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
            placeholder={t('in-settings:tabs.splunkAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('url').map(field => (
        <FormGroup>
          <Label htmlFor="url" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.url')}
          </Label>
          <Input
            className={`${block}__input`}
            id="url"
            type="url"
            placeholder="https://your.splunk.server:8088/services/collector"
            value={field.value}
            onChange={e => onChange('url', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('token').map(field => (
        <FormGroup>
          <Label htmlFor="token" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.token')}
          </Label>
          <Input
            className={`${block}__input`}
            id="token"
            type="text"
            placeholder={t('in-settings:tabs.token')}
            value={field.value}
            onChange={e => onChange('token', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
