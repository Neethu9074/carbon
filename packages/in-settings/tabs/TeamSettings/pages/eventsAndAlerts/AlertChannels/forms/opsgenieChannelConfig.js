import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-settings/components/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'OPS_GENIE';
const label = 'Opsgenie';

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
    key: 'apiKey',
    label: 'Api Key'
  },
  {
    key: 'tags',
    label: 'Tags'
  },
  {
    key: 'region',
    label: 'Region'
  },
  {
    key: 'alias',
    label: 'Alias'
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.apiKey = '';
    alertChannel.tags = '';
    alertChannel.region = '';
    alertChannel.alias = '';
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList>
        <DescriptionItem title="Api Key">{alertChannel.get('apiKey')}</DescriptionItem>
        <DescriptionItem title="Tags">{alertChannel.get('tags')}</DescriptionItem>
        <DescriptionItem title="Region">{alertChannel.get('region')}</DescriptionItem>
        <DescriptionItem title="Alias">{alertChannel.get('alias')}</DescriptionItem>
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
        'apiKey',
        createField({
          value: alertChannel ? alertChannel.get('apiKey') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'tags',
        createField({
          value: alertChannel ? alertChannel.get('tags') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'region',
        createField({
          value: alertChannel ? alertChannel.get('region') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'alias',
        createField({
          value: alertChannel ? alertChannel.get('alias') : ''
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      apiKey: form.get('apiKey').value,
      tags: form.get('tags').value,
      region: form.get('region').value,
      alias: form.get('alias').value
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
            placeholder="Opsgenie Alert Channel"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('apiKey').map(field => (
        <FormGroup>
          <Label htmlFor="apiKey" hasError={!field.valid && field.touched}>
            API Key
          </Label>
          <Input
            className={`${block}__input`}
            id="apiKey"
            type="text"
            placeholder="API Key"
            value={field.value}
            onChange={e => onChange('apiKey', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('tags').map(field => (
        <FormGroup>
          <Label htmlFor="tags" hasError={!field.valid && field.touched}>
            Tags
          </Label>
          <Input
            className={`${block}__input`}
            id="tags"
            type="text"
            placeholder="Tags (comma separated)"
            value={field.value}
            onChange={e => onChange('tags', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('region').map(field => (
        <FormGroup>
          <Label htmlFor="region" hasError={!field.valid && field.touched}>
            Region
          </Label>
          <Select
            className={`${block}__input`}
            id="region"
            value={field.value}
            onChange={e => onChange('region', e.target.value)}
          >
            <option value="">Please Select</option>
            <option value="US">US</option>
            <option value="EU">EU</option>
          </Select>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('alias').map(field => (
        <FormGroup>
          <Label htmlFor="alias" hasError={!field.valid && field.touched}>
            Alias
          </Label>
          <Input
            className={`${block}__input`}
            id="alias"
            type="text"
            placeholder="Alias"
            value={field.value}
            onChange={e => onChange('alias', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
