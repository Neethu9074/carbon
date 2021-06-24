/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from '@instana/utils';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'OFFICE_365';
const label = t('in-settings:tabs.office365MicrosoftTeams');

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
    key: 'webhookUrl',
    label: t('in-settings:tabs.webhookUrl')
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.webhookUrl = '';
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList>
        <DescriptionItem title={t('in-settings:tabs.webhookUrl')}>{alertChannel.get('webhookUrl')}</DescriptionItem>
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
        'webhookUrl',
        createField({
          value: alertChannel ? alertChannel.get('webhookUrl') : '',
          validator: notBlankValidator
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrl: form.get('webhookUrl').value
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
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder={t('in-settings:tabs.office365MicrosoftTeamsAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('webhookUrl').map(field => (
        <FormGroup>
          <Label htmlFor="webhookUrl" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.webhookUrl')}
          </Label>
          <Input
            className={`${block}__input`}
            id="webhookUrl"
            type="url"
            placeholder="https://outlook.office.com/connectors/Connect?state=<myAppsState>&app_id=<appId>&callback_url=<callbackUrl>"
            value={field.value}
            onChange={e => onChange('webhookUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
