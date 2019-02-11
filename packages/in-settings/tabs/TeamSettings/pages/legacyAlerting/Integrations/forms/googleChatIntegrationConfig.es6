import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'GOOGLE_CHAT';
const label = 'Google Chat';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.webhookUrl = '';
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Webhook URL">{integration.get('webhookUrl')}</DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(integration) {
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
          value: integration ? integration.get('name') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'webhookUrl',
        createField({
          value: integration ? integration.get('webhookUrl') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrl: form.get('webhookUrl').value
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
            placeholder="Google Chat Integration"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
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
            placeholder="https://chat.googleapis.com/v1/spaces/<id>/messages?key=<key>&token=<token>"
            value={field.value}
            onChange={e => onChange('webhookUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
