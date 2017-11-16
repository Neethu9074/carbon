import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import { generateUniqueShortId } from 'in-services/util/id';

export default {
  createForm(integration) {
    return createMapForm()
      .put(
        'kind',
        createField({
          value: 'email'
        })
      )
      .put(
        'emails',
        createField({
          value: integration ? integration.get('emails') : List(),
          validator: emails
        })
      );
  },

  createEntitiy(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      emails: form.get('emails').value
    };
  },

  Form
};

function emails(emails) {
  if (emails.size === 0) {
    return [
      {
        severity: 'error',
        message: `Please define at least one email`
      }
    ];
  }
  const error = notBlankValidator(emails.get(0));
  if (error.length > 0) {
    return [
      {
        severity: 'error',
        message: error[0].message
      }
    ];
  }
  return null;
}

function Form(/*{ form, onChange }*/) {
  return (
    <fieldset>
      <Section>email form</Section>
    </fieldset>
  );
}
