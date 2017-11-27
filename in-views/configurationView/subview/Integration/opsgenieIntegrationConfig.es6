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

const name = 'OPS_GENIE';
const label = 'OpsGenie';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.apiKey = '';
    integration.tags = '';
    integration.email = '';
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Api Key">{integration.get('apiKey')}</DescriptionItem>
        <DescriptionItem title="Email">{integration.get('email')}</DescriptionItem>
        <DescriptionItem title="Tags">{integration.get('tags')}</DescriptionItem>
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
        'apiKey',
        createField({
          value: integration ? integration.get('apiKey') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'tags',
        createField({
          value: integration ? integration.get('tags') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'email',
        createField({
          value: integration ? integration.get('email') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      apiKey: form.get('apiKey').value,
      tags: form.get('tags').value,
      email: form.get('email').value
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
              Name
            </Label>
            <Input
              id="name"
              className={`${block}__input`}
              type="text"
              placeholder="OpsGenie Integration"
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
        {form.get('apiKey').map(field => (
          <FormGroup>
            <Label htmlFor="apiKey" hasError={!field.valid}>
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
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        {form.get('email').map(field => (
          <FormGroup>
            <Label htmlFor="email" hasError={!field.valid}>
              Email
            </Label>
            <Input
              className={`${block}__input`}
              id="email"
              type="email"
              placeholder="ops@company.org"
              value={field.value}
              onChange={e => onChange('email', e.target.value)}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}

        {form.get('tags').map(field => (
          <FormGroup>
            <Label htmlFor="tags" hasError={!field.valid}>
              Tags
            </Label>
            <Input
              className={`${block}__input`}
              id="tags"
              type="text"
              placeholder="Tags (comma separated)"
              value={field.value}
              onChange={e => onChange('tags', e.target.value)}
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
