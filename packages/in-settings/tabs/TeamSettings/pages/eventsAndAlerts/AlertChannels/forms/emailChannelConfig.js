/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-settings/components/FormGroup';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

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
        <DescriptionItem title={t('in-settings:tabs.eMails')}>
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
        message: t('in-settings:tabs.pleaseDefineAtLeastOneEmail')
      }
    ];
  }
  const errors = [];
  for (let i = 0, length = emails.size; i < length; i++) {
    const email = emails.get(i);
    const error = notBlankValidator(email);
    if (error?.length > 0) {
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
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
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
        <FormGroup>
          <Label htmlFor="email" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.emails')}
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
                {t('in-settings:tabs.remove')}
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
          {t('in-settings:tabs.addEmail')}
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
