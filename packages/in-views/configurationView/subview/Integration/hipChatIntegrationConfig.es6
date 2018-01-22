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

const name = 'HIPCHAT';
const label = 'HipChat';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.baseUrl = '';
    integration.authToken = '';
    integration.roomId = '';
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Base URL">{integration.get('baseUrl')}</DescriptionItem>
        <DescriptionItem title="Auth Token">{integration.get('authToken')}</DescriptionItem>
        <DescriptionItem title="Room ID/Name">{integration.get('roomId')}</DescriptionItem>
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
        'baseUrl',
        createField({
          value: integration ? integration.get('baseUrl') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'authToken',
        createField({
          value: integration ? integration.get('authToken') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'roomId',
        createField({
          value: integration ? integration.get('roomId') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      baseUrl: form.get('baseUrl').value,
      authToken: form.get('authToken').value,
      roomId: form.get('roomId').value
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
              placeholder="HipChat Integration"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('baseUrl').map(field => (
          <FormGroup>
            <Label htmlFor="baseUrl" hasError={!field.valid && field.touched}>
              Base URL
            </Label>
            <Input
              className={`${block}__input`}
              id="baseUrl"
              type="url"
              placeholder="Base URL"
              value={field.value}
              onChange={e => onChange('baseUrl', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('authToken').map(field => (
          <FormGroup>
            <Label htmlFor="authToken" hasError={!field.valid && field.touched}>
              Auth Token
            </Label>
            <Input
              className={`${block}__input`}
              id="authToken"
              type="text"
              placeholder="Auth Token"
              value={field.value}
              onChange={e => onChange('authToken', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('roomId').map(field => (
          <FormGroup>
            <Label htmlFor="roomId" hasError={!field.valid && field.touched}>
              Room ID
            </Label>
            <Input
              className={`${block}__input`}
              id="roomId"
              type="text"
              placeholder="Room ID/Name"
              value={field.value}
              onChange={e => onChange('roomId', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>
    </fieldset>
  );
}
