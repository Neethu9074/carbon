/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, MapFormItems, Field, MapForm, ValidationMessage } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Button } from '@instana/legacy';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ChannelForm.mless';

interface EmailAlertChannel {
  emails: string[];
  name: string;
  kind: string;
}

interface EmailAlertChannelMapForm extends MapFormItems {
  name: Field<string>;
  kind: Field<string>;
  emails: Field<List<string>>;
}

interface EmailValidationResult extends ValidationMessage {
  mailIndex?: string | number;
  type?: string;
}

interface ComponentProps {
  form: MapForm<EmailAlertChannelMapForm>;
  onChange: OnEntityChange<EmailAlertChannelMapForm>;
}

const name = 'EMAIL';
const label = t('in-settings:tabs.email');

const parameters = [
  {
    key: 'name',
    label: t('in-settings:tabs.name')
  },
  {
    key: 'kind',
    label: t('in-settings:tabs.type')
  },
  {
    key: 'emails',
    label: t('in-settings:tabs.emails')
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel: EmailAlertChannel) {
    alertChannel.emails = [''];
  },

  createDetails(alertChannel: Map<string, string | List<string> | List<string[]>>): JSX.Element | null {
    const emails = alertChannel.get('emails') as List<string>;
    if (!emails || emails.size === 0) {
      return null;
    }

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-settings:tabs.eMails')}>
          {emails.toArray().map(email => (
            <div key={email}>{email}</div>
          ))}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  // Return type here should be MapForm<EmailAlertChannelMapForm> However due to the way put works we cannot do this
  createForm(alertChannel: Map<string, string | List<string> | List<string[]>>) {
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
          value: alertChannel && alertChannel.has('emails') ? (alertChannel.get('emails') as List<string>) : List(['']),
          validator: emails
        })
      );
  },

  createEntity(
    alertChannel: Map<string, string | List<string> | List<string[]>>,
    form: MapForm<EmailAlertChannelMapForm>
  ) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      emails: form.get('emails').value
    };
  },

  Form
};

function emails(emails: List<string>): EmailValidationResult[] {
  if (emails.size === 0) {
    return [
      {
        type: 'no_mail',
        severity: 'error',
        message: t('in-settings:tabs.pleaseDefineAtLeastOneEmail')
      }
    ];
  }
  const errors = [] as EmailValidationResult[];
  for (let i = 0, length = emails.size; i < length; i++) {
    const email = emails.get(i);
    const error = notBlankValidator(email);
    if (error && error.length > 0) {
      errors.push({
        mailIndex: i,
        severity: 'error',
        message: error[0].message
      });
    }
  }
  return errors;
}

function Form({ form, onChange }: ComponentProps): JSX.Element {
  return (
    <fieldset>
      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={locals.input}
            type="text"
            placeholder={t('in-settings:tabs.emailAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('emails').map(field => (
        <>
          <Label htmlFor="email" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.emails')}
          </Label>
          {field.touched
            ? field.messages.map((message: EmailValidationResult, i: number) => {
                if (message.type !== 'no_mail') {
                  return null;
                }
                return <ValidationBlock key={i}>{message.message}</ValidationBlock>;
              })
            : null}
        </>
      ))}
      {form.get('emails').map(field => {
        const emails = field.value;
        return emails.map((email, i) => (
          <div key={i}>
            <div className={locals.inputDeleteWrapper}>
              <Input
                className={locals.input}
                id={`email_${email}`}
                type="email"
                placeholder="ops@company.org"
                value={email}
                onChange={e => onChangeEmail(e, form, onChange, i)}
              />
              <Button className={locals.deleteButton} kind="danger" onClick={() => removeEmail(form, onChange, i)}>
                {t('in-settings:tabs.remove')}
              </Button>
            </div>
            {field.touched
              ? field.messages
                  .filter((msg: EmailValidationResult) => msg.mailIndex === i)
                  .map((message, i) => <ValidationBlock key={i}>{message.message}</ValidationBlock>)
              : null}
          </div>
        ));
      })}
      <div className={locals.addButtonWrapper}>
        <span className={locals.addLink} onClick={() => addEmail(form, onChange)}>
          {t('in-settings:tabs.addEmail')}
        </span>
      </div>
    </fieldset>
  );
}

function onChangeEmail(
  e: React.ChangeEvent<HTMLInputElement>,
  form: MapForm<EmailAlertChannelMapForm>,
  onChange: OnEntityChange<EmailAlertChannelMapForm>,
  index: number | undefined
) {
  const emails = form.get('emails').value.setIn([index], e.target.value);
  onChange('emails', emails);
}

function addEmail(form: MapForm<EmailAlertChannelMapForm>, onChange: OnEntityChange<EmailAlertChannelMapForm>) {
  let emails = form.get('emails').value;
  emails = emails.push('');
  onChange('emails', emails);
}

function removeEmail(
  form: MapForm<EmailAlertChannelMapForm>,
  onChange: OnEntityChange<EmailAlertChannelMapForm>,
  index: number | undefined
) {
  const emails = form.get('emails').value.deleteIn([index]);
  onChange('emails', emails);
}
