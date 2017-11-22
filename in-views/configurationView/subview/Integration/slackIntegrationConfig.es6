import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'SLACK';
export default {
  name,

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Webhook URL">{integration.get('webhookUrl')}</DescriptionItem>
        <DescriptionItem title="Icon URL">{integration.get('iconUrl')}</DescriptionItem>
        <DescriptionItem title="Channel">{integration.get('channel')}</DescriptionItem>
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
      )
      .put(
        'iconUrl',
        createField({
          value: integration ? integration.get('iconUrl') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'channel',
        createField({
          value: integration ? integration.get('channel') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
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
      <Section>
        {form.get('name').map(field => (
          <FormGroup className={block}>
            <Label htmlFor="name" hasError={!field.valid}>
              Config Name
            </Label>
            <Input
              id="name"
              className={`${block}__input`}
              type="text"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('webhookUrl').map(field => (
          <FormGroup>
            <Label htmlFor="webhookUrl" hasError={!field.valid}>
              Webhook URL
            </Label>
            <Input
              className={`${block}__input`}
              id="webhookUrl"
              type="text"
              placeholder="Webhook URL"
              value={field.value}
              onChange={e => onChange('webhookUrl', e.target.value)}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        {form.get('iconUrl').map(field => (
          <FormGroup>
            <Label htmlFor="iconUrl" hasError={!field.valid}>
              Icon URL
            </Label>
            <Input
              className={`${block}__input`}
              id="iconUrl"
              type="text"
              placeholder="Icon URL"
              value={field.value}
              onChange={e => onChange('iconUrl', e.target.value)}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        {form.get('channel').map(field => (
          <FormGroup>
            <Label htmlFor="channel" hasError={!field.valid}>
              Channel Name
            </Label>
            <Input
              className={`${block}__input`}
              id="channel"
              type="text"
              placeholder="e.g.: general"
              value={field.value}
              onChange={e => onChange('channel', e.target.value)}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}
      </Section>
    </fieldset>
  );
}
