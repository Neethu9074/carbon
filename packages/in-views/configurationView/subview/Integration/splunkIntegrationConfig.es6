import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'SPLUNK';
const label = 'Splunk';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.url = '';
    integration.token = '';
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="URL">{integration.get('url')}</DescriptionItem>
        <DescriptionItem title="Token">{integration.get('token')}</DescriptionItem>
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
        'url',
        createField({
          value: integration ? integration.get('url') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'token',
        createField({
          value: integration ? integration.get('token') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
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
      <Section>
        {form.get('name').map(field => (
          <FormGroup className={block}>
            <Label htmlFor="name" hasError={!field.valid && field.touched}>
              Name
            </Label>
            <Input
              id="name"
              className={`${block}__input`}
              type="text"
              placeholder="Splunk Integration"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('url').map(field => (
          <FormGroup>
            <Label htmlFor="url" hasError={!field.valid && field.touched}>
              URL
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
              Token
            </Label>
            <Input
              className={`${block}__input`}
              id="token"
              type="text"
              placeholder="Token"
              value={field.value}
              onChange={e => onChange('token', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>
    </fieldset>
  );
}
