/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, Field, MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { TextInput } from '@instana/carbon';

import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'BIDIRECTIONAL_MS_TEAMS';
const label = t('in-settings:tabs.teamsBD');

const extractChannelInfo = (url: string) => {
  const regex = /https:\/\/teams\.microsoft\.com\/l\/channel\/([^/]+)\/([^?]+)\?groupId=([^&]+)&tenantId=([^&]+)/;
  const match = url.match(regex);
  if (match) {
    const [, channelId, channelName, teamId, tenantId] = match;
    return {
      channelId: decodeURIComponent(channelId),
      channelName: decodeURIComponent(channelName),
      teamId,
      tenantId
    };
  }
  return null;
};

interface TeamsAlertChannel {
  id: string;
  kind: string;
  name: string;
  teamId: string;
  channelId: string;
  teamName: string;
  tenantId: string;
  tenantName: string;
  channelName: string;
  channelLink?: string;
  serviceUrl: string;
}

interface TeamsAlertChannelMapFormItems extends MapFormItems {
  id: Field<string>;
  kind: Field<string>;
  name: Field<string>;
  teamId: Field<string>;
  channelId: Field<string>;
  teamName: Field<string>;
  tenantId: Field<string>;
  tenantName: Field<string>;
  channelName: Field<string>;
  channelLink: Field<string>;
  serviceUrl: Field<string>;
}

interface FormProps {
  form: MapForm<TeamsAlertChannelMapFormItems>;
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
    key: 'channelLink',
    label: t('in-settings:tabs.teamsChannelLink')
  },
  {
    key: 'channelName',
    label: t('in-settings:tabs.teamsChannelName')
  }
];

const createTeamsBDForm = (alertChannel: Map<string, string>): MapForm<any> => {
  return createMapForm()
    .put(
      'id',
      createField({
        value: alertChannel ? alertChannel.get('id') : generateUniqueShortId()
      })
    )
    .put(
      'kind',
      createField({
        value: 'BIDIRECTIONAL_MS_TEAMS'
      })
    )
    .put(
      'name',
      createField({
        value: alertChannel.get('name') ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'channelLink',
      createField({
        value: alertChannel.get('channelLink') ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'teamId',
      createField({
        value: alertChannel.get('teamId') ?? ''
      })
    )
    .put(
      'channelId',
      createField({
        value: alertChannel.get('channelId') ?? ''
      })
    )
    .put(
      'teamName',
      createField({
        value: 'MSTEAMS Team name'
      })
    )
    .put(
      'tenantId',
      createField({
        value: alertChannel.get('tenantId') ?? ''
      })
    )
    .put(
      'tenantName',
      createField({
        value: 'MS TEAMS TENANT'
      })
    )
    .put(
      'channelName',
      createField({
        value: alertChannel.get('channelName') ?? ''
      })
    )
    .put(
      'serviceUrl',
      createField({
        value: 'https://smba.trafficmanager.net/emea/'
      })
    );
};

function Form({ form, onChange }: FormProps): JSX.Element {
  const handleChannelLinkChange = (value: string) => {
    const channelInfo = extractChannelInfo(value);

    const updater = (currentForm: MapForm<TeamsAlertChannelMapFormItems>) => {
      let updatedForm = currentForm.updateIn(['channelLink'], field =>
        (field as Field<string>).setValue(value).setTouched(true)
      );

      if (channelInfo) {
        updatedForm = updatedForm
          .updateIn(['channelName'], field => (field as Field<string>).setValue(channelInfo.channelName))
          .updateIn(['teamId'], field => (field as Field<string>).setValue(channelInfo.teamId))
          .updateIn(['channelId'], field => (field as Field<string>).setValue(channelInfo.channelId))
          .updateIn(['tenantId'], field => (field as Field<string>).setValue(channelInfo.tenantId));
      } else {
        updatedForm = updatedForm
          .updateIn(['channelName'], field => (field as Field<string>).setValue(''))
          .updateIn(['teamId'], field => (field as Field<string>).setValue(''))
          .updateIn(['channelId'], field => (field as Field<string>).setValue(''))
          .updateIn(['tenantId'], field => (field as Field<string>).setValue(''));
      }

      return updatedForm;
    };

    onChange(updater, undefined);
  };

  return (
    <fieldset>
      {form.get('name').map(field => (
        <FormGroup className={block} key="name">
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder={t('in-settings:tabs.teamsAlertChannelName')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('channelLink').map(field => (
        <FormGroup key="channelLink">
          <Label htmlFor="channelLink" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.teamsChannelLink')}
          </Label>
          <Input
            id="channelLinkInput"
            className={`${block}__input`}
            type="url"
            placeholder={t('in-settings:tabs.teamsChannelLinkPlaceholder')}
            value={field.value}
            onChange={e => handleChannelLinkChange(e.target.value)}
            hasError={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('channelName').map(field => (
        <FormGroup key="channelName">
          <TextInput
            id="channelName"
            className={`${block}__input`}
            type="text"
            value={field.value}
            readOnly
            helperText={field.value ? t('in-settings:tabs.teamsLinkMsg') : ''}
            labelText={t('in-settings:tabs.teamsChannelName')}
          />
        </FormGroup>
      ))}
    </fieldset>
  );
}

export default {
  name,
  label,
  isBeta: true,
  testAPI: null,

  getParameters(): Array<AlertChannelParameterValue> {
    return parameters;
  },

  createForm: createTeamsBDForm,

  enrichAlertChannelObject(): void {},

  createEntity(alertChannel: Map<string, string>, form: MapForm<TeamsAlertChannelMapFormItems>): TeamsAlertChannel {
    return {
      id: alertChannel.get('id') || generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      teamId: form.get('teamId').value,
      channelId: form.get('channelId').value,
      teamName: form.get('teamName').value,
      tenantId: form.get('tenantId').value,
      tenantName: form.get('tenantName').value,
      channelName: form.get('channelName').value,
      serviceUrl: form.get('serviceUrl').value
    };
  },

  Form
};
