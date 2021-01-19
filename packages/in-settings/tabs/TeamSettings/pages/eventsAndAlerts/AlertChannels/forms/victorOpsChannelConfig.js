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

const name = 'VICTOR_OPS';
const label = 'VictorOps';

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
    key: 'apiKey',
    label: 'API Key'
  },
  {
    key: 'routingKey',
    label: 'Routing Key'
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.routingKey = '';
    alertChannel.apiKey = '';
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList>
        <DescriptionItem title="API Key">{alertChannel.get('apiKey')}</DescriptionItem>
        <DescriptionItem title="Routing Key">{alertChannel.get('routingKey')}</DescriptionItem>
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
        'apiKey',
        createField({
          value: alertChannel ? alertChannel.get('apiKey') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'routingKey',
        createField({
          value: alertChannel ? alertChannel.get('routingKey') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      apiKey: form.get('apiKey').value,
      routingKey: form.get('routingKey').value
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
            placeholder="VictorOps Alert Channel"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('apiKey').map(field => (
        <FormGroup>
          <Label htmlFor="apiKey" hasError={!field.valid && field.touched}>
            API Key
          </Label>
          <Input
            className={`${block}__input`}
            id="apiKey"
            type="text"
            placeholder="API Key"
            value={field.value}
            onChange={e => onChange('apiKey', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('routingKey').map(field => (
        <FormGroup>
          <Label htmlFor="routingKey" hasError={!field.valid && field.touched}>
            Routing Key
          </Label>
          <Input
            className={`${block}__input`}
            id="routingKey"
            type="text"
            placeholder="Routing Key"
            value={field.value}
            onChange={e => onChange('routingKey', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
