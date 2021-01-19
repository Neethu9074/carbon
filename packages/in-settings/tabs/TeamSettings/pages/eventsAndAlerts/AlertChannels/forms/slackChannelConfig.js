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

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'SLACK';
const label = 'Slack';

const parameters = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'kind',
    label: 'Type'
  },
  {
    key: 'webhookUrl',
    label: 'Webhook URL'
  },
  {
    key: 'iconUrl',
    label: 'Icon URL'
  },
  {
    key: 'channel',
    label: 'Channel'
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.webhookUrl = '';
    alertChannel.iconUrl = '';
    alertChannel.channel = '';
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList>
        <DescriptionItem title="Webhook URL">{alertChannel.get('webhookUrl')}</DescriptionItem>
        <DescriptionItem title="Icon URL">{alertChannel.get('iconUrl')}</DescriptionItem>
        <DescriptionItem title="Channel">{alertChannel.get('channel')}</DescriptionItem>
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
        'webhookUrl',
        createField({
          value: alertChannel ? alertChannel.get('webhookUrl') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'iconUrl',
        createField({
          value: alertChannel ? alertChannel.get('iconUrl') : ''
        })
      )
      .put(
        'channel',
        createField({
          value: alertChannel ? alertChannel.get('channel') : ''
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrl: form.get('webhookUrl').value,
      iconUrl: form.get('iconUrl').value,
      channel: form.get('channel').value
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
            Name
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder="Slack Alert Channel"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('webhookUrl').map(field => (
        <FormGroup>
          <Label htmlFor="webhookUrl" hasError={!field.valid && field.touched}>
            Webhook URL
          </Label>
          <Input
            className={`${block}__input`}
            id="webhookUrl"
            type="url"
            placeholder="https://hooks.slack.com/services/A1B2C3D4E/A1B2C3D4E/abcDEFabcDEFabcDEFabcDEF"
            value={field.value}
            onChange={e => onChange('webhookUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('iconUrl').map(field => (
        <FormGroup>
          <Label htmlFor="iconUrl" hasError={!field.valid && field.touched}>
            Icon URL
          </Label>
          <Input
            className={`${block}__input`}
            id="iconUrl"
            type="url"
            placeholder="https://www.example.com/media/instana.png"
            value={field.value}
            onChange={e => onChange('iconUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('channel').map(field => (
        <FormGroup>
          <Label htmlFor="channel" hasError={!field.valid && field.touched}>
            Channel Name
          </Label>
          <Input
            className={`${block}__input`}
            id="channel"
            type="text"
            placeholder="Channel Name"
            value={field.value}
            onChange={e => onChange('channel', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
