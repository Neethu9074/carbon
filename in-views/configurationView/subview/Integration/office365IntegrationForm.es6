import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import { generateUniqueShortId } from 'in-services/util/id';

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

  createEntitiy(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      webhookUrl: form.get('webhookUrl').value
    };
  },

  Form
};

function Form(/*{ form, onChange }*/) {
  return (
    <fieldset>
      <Section>office365 form</Section>
    </fieldset>
  );
}
