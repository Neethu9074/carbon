/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField, notBlankValidator, Field, MapForm, MapFormItems } from 'formalistic';
import { List } from 'immutable';
import React from 'react';

import { Link, DescriptionItem, DescriptionList } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { Trans, t } from '@instana/i18n-react';

import ShowHideInputField from 'in-settings/components/ShowHideInputField/ShowHideInputField';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { OnEntityChange } from 'in-settings/hooks/useEntityForm';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Label from 'in-components/form/Label/Label';
import Input from 'in-components/form/Input/Input';

const block = 'in-alert-channel-config-form';

const name = 'Z_CHATOPS';
const label = t('in-settings:tabs.zChatOps');

interface zChatOpsAlertChannel {
  name: string;
  kind: string;
  zchatOpsIncidentsUrl: string;
  bearerAuthToken: string;
  channels: string[];
}

interface zChatOpsAlertChannelMapForm extends MapFormItems {
  name: Field<string>;
  kind: Field<string>;
  zchatOpsIncidentsUrl: Field<string>;
  bearerAuthToken: Field<string>;
  channels: Field<List<string>>;
}

interface FormProps {
  form: MapForm<zChatOpsAlertChannelMapForm>;
  onChange: OnEntityChange<any>;
}

export default {
  name,
  label,
  isBeta: true,
  feedbackLink: 'https://forms.gle/jRc9ZMECYus5E95o8',

  getParameters() {
    return [
      {
        key: 'name',
        label: t('in-settings:tabs.name')
      },
      {
        key: 'zchatOpsIncidentsUrl',
        label: t('in-settings:tabs.webhookUrl')
      },
      {
        key: 'bearerAuthToken',
        label: t('in-settings:tabs.token')
      },
      {
        key: 'channels',
        label: t('in-settings:tabs.channel')
      }
    ];
  },

  enrichAlertChannelObject(alertChannel: zChatOpsAlertChannel) {
    alertChannel.zchatOpsIncidentsUrl = '';
    alertChannel.bearerAuthToken = '';
    alertChannel.channels = [];
  },

  createDetails(alertChannel: Map<string, string | string[]>) {
    const channelsField = alertChannel.get('channels') || [];
    const alertingChannels = Array.isArray(channelsField) ? channelsField : [];
    return (
      <DescriptionList inComponents>
        <DescriptionItem inComponents title={t('in-settings:tabs.webhookUrlToZChatOps')}>
          {alertChannel.get('zchatOpsIncidentsUrl')}
        </DescriptionItem>
        {alertingChannels.map((channel: string, i: number) => {
          <DescriptionItem inComponents key={i} title={t('in-settings:tabs.channel')}>
            {channel}
          </DescriptionItem>;
        })}
        <DescriptionItem inComponents title={t('in-settings:tabs.token')}>
          {alertChannel.get('bearerAuthToken')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(alertChannel: Map<string, string | string[]>) {
    const alertChannelName = (alertChannel?.get('name') as string) ?? '';
    const zchatOpsIncidentsUrl = (alertChannel?.get('zchatOpsIncidentsUrl') as string) ?? '';
    const bearerAuthToken = (alertChannel?.get('bearerAuthToken') as string) ?? '';
    const channels = (alertChannel?.get('channels') as string[]) ?? [];
    return createMapForm()
      .put(
        'kind',
        createField({
          value: name,
          validator: notBlankValidator
        })
      )
      .put(
        'name',
        createField({
          value: alertChannelName,
          validator: notBlankValidator
        })
      )
      .put(
        'zchatOpsIncidentsUrl',
        createField({
          value: zchatOpsIncidentsUrl,
          validator: notBlankValidator
        })
      )
      .put(
        'bearerAuthToken',
        createField({
          value: bearerAuthToken,
          validator: notBlankValidator
        })
      )
      .put(
        'channels',
        createField({
          value: channels
        })
      );
  },
  createEntity(alertChannel: Map<string, string | string[]>, form: MapForm<zChatOpsAlertChannelMapForm>) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      zchatOpsIncidentsUrl: form.get('zchatOpsIncidentsUrl').value,
      bearerAuthToken: form.get('bearerAuthToken').value,
      channels: form.get('channels').value
    };
  },
  Form
};

function Form({ form, onChange }: FormProps) {
  return (
    <fieldset>
      {form.get('name').map((field: Field<string>) => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={t('in-settings:tabs.zChatOpsAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('zchatOpsIncidentsUrl').map((field: Field<string>) => (
        <FormGroup>
          <Label htmlFor="zchatOpsIncidentsUrl" hasError={!field.valid && field.touched}>
            <Trans
              i18nKey="in-settings:tabs.webhookUrlToZChatOps"
              components={{
                incomingWebhookLink: (
                  // @ts-expect-error TS2741: Property 'children' is missing - it will get injected by Trans
                  <Link
                    size="sm"
                    href="https://www.ibm.com/docs/en/z-chatops/1.1.0?topic=integrating-z-chatops"
                    external
                  />
                )
              }}
            />
          </Label>
          <Input
            id="zchatOpsIncidentsUrl"
            type="url"
            placeholder="https://www.website-hook.com"
            value={field.value}
            onChange={e => onChange('zchatOpsIncidentsUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('bearerAuthToken').map((field: Field<string>) => (
        <FormGroup>
          <ShowHideInputField
            placeholder="*******************"
            value={field.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('bearerAuthToken', e.target.value)}
            id="token"
            labelText={t('in-settings:tabs.token')}
            invalid={!field.valid && field.touched}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('channels').map((field: Field<List<string>>) => (
        <FormGroup>
          <Label htmlFor="channels" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.channel')}
          </Label>
          <Input
            id="channels"
            type="text"
            value={field.value.get(0) || ''}
            placeholder={t('in-settings:tabs.channelName')}
            onChange={e => onChange('channels', List().set(0, e.target.value))}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
