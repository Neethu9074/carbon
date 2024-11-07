/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, Field, MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Stack } from '@instana/components';

import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'SALESFORCE';
const label = t('in-settings:tabs.salesforceChannel');

interface SalesforceAlertChannel {
  id: string;
  name: string;
  kind: string;
  clientId: string;
  clientSecret: string;
  salesforceUrl: string;
}

interface SalesforceAlertChannelMapFormItems extends MapFormItems {
  id: Field<string>;
  name: Field<string>;
  kind: Field<string>;
  clientId: Field<string>;
  clientSecret: Field<string>;
  salesforceUrl: Field<string>;
}

interface FormProps {
  form: MapForm<SalesforceAlertChannelMapFormItems>;
  onChange: OnEntityChange<any>;
}

interface AlertChannelParameterValue {
  key: string;
  label: string;
}

const parameters: Array<AlertChannelParameterValue> = [
  {
    key: 'name',
    label: t('in-settings:tabs.name')
  },
  {
    key: 'clientId',
    label: t('in-settings:tabs.consumerKey')
  },
  {
    key: 'clientSecret',
    label: t('in-settings:tabs.consumerSecret')
  },
  {
    key: 'salesforceUrl',
    label: t('in-settings:tabs.webhookUrLs')
  }
];

export default {
  name,
  label,
  isBeta: true,
  feedbackLink: 'https://forms.gle/upGyAkgaxZyHbYt9A',
  referencesDocumentation: true,
  documentationLink: 'https://www.ibm.com/docs/en/instana-observability/current?topic=alerting-salesforce-open-beta',

  getParameters(): Array<AlertChannelParameterValue> {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel: SalesforceAlertChannel): void {
    alertChannel.salesforceUrl = '';
    alertChannel.clientId = '';
    alertChannel.clientSecret = '';
  },

  createForm(alertChannel: Map<string, string>): MapForm<any> {
    return createMapForm()
      .put('id', createField({ value: alertChannel.get('id') || '' }))
      .put(
        'kind',
        createField({
          value: name
        })
      )
      .put(
        'name',
        createField({
          value: alertChannel.get('name') || '',
          validator: notBlankValidator
        })
      )
      .put(
        'salesforceUrl',
        createField({
          value: alertChannel.get('salesforceUrl') || '',
          validator: notBlankValidator
        })
      )
      .put(
        'clientId',
        createField({
          value: alertChannel.get('clientId') || ''
        })
      )
      .put(
        'clientSecret',
        createField({
          value: alertChannel.get('clientSecret') || ''
        })
      );
  },

  createEntity(
    alertChannel: Map<string, string>,
    form: MapForm<SalesforceAlertChannelMapFormItems>
  ): SalesforceAlertChannel {
    return {
      id: alertChannel.get('id') || generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      salesforceUrl: form.get('salesforceUrl').value,
      clientId: form.get('clientId').value,
      clientSecret: form.get('clientSecret').value
    };
  },

  Form
};

function Form({ form, onChange }: FormProps): JSX.Element {
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
            placeholder={t('in-settings:tabs.salesforceChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('salesforceUrl').map(field => (
        <FormGroup>
          <Label htmlFor="salesforceUrl" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.salesforceUrl')}
          </Label>
          <Input
            className={`${block}__input`}
            id="salesforceUrl"
            type="url"
            placeholder="https://<salesforce_env>.my.salesforce.com"
            value={field.value}
            onChange={e => onChange('salesforceUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('clientId').map(field => (
        <FormGroup>
          <Label htmlFor="clientId" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.consumerKey')}
          </Label>
          <Input
            className={`${block}__input`}
            id="clientId"
            type="text"
            placeholder={t('in-settings:tabs.consumerKey')}
            value={field.value}
            onChange={e => onChange('clientId', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('clientSecret').map((field: Field<string>) => (
        <FormGroup>
          <Label htmlFor="clientSecret" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.consumerSecret')}
          </Label>
          <Stack direction="horizontal" gap="small" align="center">
            <Input
              id="clientSecret"
              type="password"
              placeholder="*******************"
              value={field.value}
              onChange={e => onChange('clientSecret', e.target.value)}
            />
          </Stack>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
