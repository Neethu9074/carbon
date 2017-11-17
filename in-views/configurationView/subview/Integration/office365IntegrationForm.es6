import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-integrations-config-form';

export default {
  createForm(integration) {
    return createMapForm()
      .put(
        'kind',
        createField({
          value: 'office365'
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
      webhookUrl: form.get('webhookUrl').value
    };
  },

  Form
};

function Form({ form, onChange }) {
  return (
    <fieldset>
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
      </Section>
    </fieldset>
  );
}
