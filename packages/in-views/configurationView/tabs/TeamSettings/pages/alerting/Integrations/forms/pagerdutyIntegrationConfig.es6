import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'PAGER_DUTY';
const label = 'PagerDuty';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.serviceIntegrationKey = '';
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Service Integration Key">{integration.get('serviceIntegrationKey')}</DescriptionItem>
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
        'serviceIntegrationKey',
        createField({
          value: integration ? integration.get('serviceIntegrationKey') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      serviceIntegrationKey: form.get('serviceIntegrationKey').value
    };
  },

  Form
};

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
            placeholder="PagerDuty Integration"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('serviceIntegrationKey').map(field => (
        <FormGroup>
          <Label htmlFor="serviceIntegrationKey" hasError={!field.valid && field.touched}>
            Service Integration Key
          </Label>
          <Input
            className={`${block}__input`}
            id="serviceIntegrationKey"
            type="text"
            placeholder="Service Integration Key"
            value={field.value}
            onChange={e => onChange('serviceIntegrationKey', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
