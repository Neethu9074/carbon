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

const name = 'EMAIL';
const label = 'Email';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.emails = [''];
  },

  createDetails(integration) {
    const emails = integration.get('emails');
    if (!emails || emails.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title="EMails">
          {emails.toArray().map(email => <div key={email}>{email}</div>)}
        </DescriptionItem>
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
        'emails',
        createField({
          value: integration ? integration.get('emails') : List(['']),
          validator: emails
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      emails: form.get('emails').value
    };
  },

  Form
};

function emails(emails) {
  if (emails.size === 0) {
    return [
      {
        type: 'no_mail',
        severity: 'error',
        message: `Please define at least one email`
      }
    ];
  }
  const errors = [];
  for (let i = 0, length = emails.size; i < length; i++) {
    const email = emails.get(i);
    const error = notBlankValidator(email);
    if (error.length > 0) {
      errors.push({
        mailIndex: i,
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
              Name
            </Label>
            <Input
              id="name"
              className={`${block}__input`}
              type="text"
              placeholder="Email Integration"
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
        {form.get('emails').map(field => (
          <FormGroup>
            <Label htmlFor="email" hasError={!field.valid}>
              Emails
            </Label>
            {field.messages.map((message, i) => {
              if (message.type !== 'no_mail') {
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
        {form.get('emails').map(field => {
          const emails = field.value;
          return emails.map((email, i) => (
            <FormGroup key={i}>
              <div className={`${block}__input-delete-wrapper`}>
                <Input
                  className={`${block}__input`}
                  id={`email_${email}`}
                  type="email"
                  placeholder="ops@company.org"
                  value={email}
                  onChange={e => onChangeEmail(e, form, onChange, i)}
                />
                <Button
                  className={`${block}__delete-button`}
                  kind="danger"
                  onClick={() => removeEmail(form, onChange, i)}
                >
                  Remove
                </Button>
              </div>
              {field.messages.filter(msg => msg.mailIndex === i).map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
              <div>
                <Button className={`${block}__add-button`} kind="success" onClick={() => addEmail(form, onChange)}>
                  Add Email
                </Button>
              </div>
            </FormGroup>
          ));
        })}
      </Section>
    </fieldset>
  );
}

function onChangeEmail(e, form, onChange, index) {
  const emails = form.get('emails').value.setIn([index], e.target.value);
  onChange('emails', emails);
}

function addEmail(form, onChange) {
  let emails = form.get('emails').value;
  emails = emails.push('');
  onChange('emails', emails);
}

function removeEmail(form, onChange, index) {
  const emails = form.get('emails').value.deleteIn([index]);
  onChange('emails', emails);
}
