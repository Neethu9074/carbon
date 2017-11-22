import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'WEB_HOOK';

export default {
  name,

  enrichIntegrationObject(integration) {
    integration.webhookUrls = [''];
  },

  createDetails(integration) {
    const webhookUrls = integration.get('webhookUrls');
    if (!webhookUrls || webhookUrls.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title="EMails">{webhookUrls.toArray().map(url => <div key={url}>{url}</div>)}</DescriptionItem>
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
        'webhookUrls',
        createField({
          value: integration ? integration.get('webhookUrls') : List(['']),
          validator: webhooks
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrls: form.get('webhookUrls').value
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
        message: `Please define at least one webhook URL`
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
        {form.get('webhookUrls').map(field => (
          <FormGroup>
            <Label hasError={!field.valid}>Webhook URLs</Label>
            {field.messages.map((message, i) => {
              if (message.type !== 'no_webhook') {
                return null;
              }
              return (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              );
            })}
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
                  type="text"
                  placeholder="your webhook URL"
                  value={webhookUrl}
                  onChange={e => onChangewebHookUrl(e, form, onChange, i)}
                />
                <Button
                  className={`${block}__delete-button`}
                  kind="danger"
                  onClick={() => removewebHookUrl(form, onChange, i)}
                >
                  Remove
                </Button>
              </div>
              {field.messages.filter(msg => msg.urlIndex === i).map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
            </FormGroup>
          ));
        })}
      </Section>
      <Section>
        <Button kind="success" onClick={() => addwebHookUrl(form, onChange)}>
          Add webhook URL
        </Button>
      </Section>
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
