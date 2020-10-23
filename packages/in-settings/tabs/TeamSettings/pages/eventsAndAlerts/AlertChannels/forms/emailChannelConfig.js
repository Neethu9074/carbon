import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Button from 'in-new-components/Button';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'EMAIL';
const label = 'Email';

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
    key: 'emails',
    label: 'Emails'
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.emails = [''];
  },

  createDetails(alertChannel) {
    const emails = alertChannel.get('emails');
    if (!emails || emails.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title="EMails">
          {emails.toArray().map(email => (
            <div key={email}>{email}</div>
          ))}
        </DescriptionItem>
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
        'emails',
        createField({
          value: alertChannel ? alertChannel.get('emails') : List(['']),
          validator: emails
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
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
      {form.get('name').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            Name
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder="Email Alert Channel"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('emails').map(field => (
        <FormGroup>
          <Label htmlFor="email" hasError={!field.valid && field.touched}>
            Emails
          </Label>
          {field.touched
            ? field.messages.map((message, i) => {
                if (message.type !== 'no_mail') {
                  return null;
                }
                return (
                  <ValidationBlock hasError key={i}>
                    {message.message}
                  </ValidationBlock>
                );
              })
            : null}
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
            {field.touched
              ? field.messages
                  .filter(msg => msg.mailIndex === i)
                  .map((message, i) => (
                    <ValidationBlock hasError key={i}>
                      {message.message}
                    </ValidationBlock>
                  ))
              : null}
          </FormGroup>
        ));
      })}
      <div className={`${block}__add-button-wrapper`}>
        <span className={`${block}__add-link`} onClick={() => addEmail(form, onChange)}>
          Add Email
        </span>
      </div>
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
