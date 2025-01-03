/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React from 'react';

import { DescriptionList, DescriptionItem, Stack, SvgIcon, Toggle, Tooltip, Typography } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'SLACK';
const label = t('in-settings:tabs.slack');

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
  },
  {
    key: 'iconUrl',
    label: t('in-settings:tabs.iconUrl')
  },
  {
    key: 'channel',
    label: t('in-settings:tabs.channel')
  },
  {
    key: 'emojiRendering',
    label: t('in-settings:tabs.displayEmojis')
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
    alertChannel.iconUrl = '';
    alertChannel.channel = '';
    alertChannel.emojiRendering = false;
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList inComponents>
        <DescriptionItem inComponents title={t('in-settings:tabs.webhookUrl')}>
          {alertChannel.get('webhookUrl')}
        </DescriptionItem>
        <DescriptionItem inComponents title={t('in-settings:tabs.iconUrl')}>
          {alertChannel.get('iconUrl')}
        </DescriptionItem>
        <DescriptionItem inComponents title={t('in-settings:tabs.channel')}>
          {alertChannel.get('channel')}
        </DescriptionItem>
        <DescriptionItem inComponents title={t('in-settings:tabs.displayEmojis')}>
          {alertChannel.get('emojiRendering')}
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
        'webhookUrl',
        createField({
          value: alertChannel ? alertChannel.get('webhookUrl') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'iconUrl',
        createField({
          value: alertChannel ? alertChannel.get('iconUrl') : ''
        })
      )
      .put(
        'channel',
        createField({
          value: alertChannel ? alertChannel.get('channel') : ''
        })
      )
      .put(
        'emojiRendering',
        createField({
          value: alertChannel ? alertChannel.get('emojiRendering') : false
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrl: form.get('webhookUrl').value,
      iconUrl: form.get('iconUrl').value,
      channel: form.get('channel').value,
      emojiRendering: form.get('emojiRendering').value
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
            placeholder={t('in-settings:tabs.slackAlertChannel')}
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
            placeholder="https://hooks.slack.com/services/A1B2C3D4E/A1B2C3D4E/abcDEFabcDEFabcDEFabcDEF"
            value={field.value}
            onChange={e => onChange('webhookUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('iconUrl').map(field => (
        <FormGroup>
          <Label htmlFor="iconUrl" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.iconUrl')}
          </Label>
          <Input
            className={`${block}__input`}
            id="iconUrl"
            type="url"
            placeholder="https://www.example.com/media/instana.png"
            value={field.value}
            onChange={e => onChange('iconUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('channel').map(field => (
        <FormGroup>
          <Label htmlFor="channel" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.channelName')}
          </Label>
          <Input
            className={`${block}__input`}
            id="channel"
            type="text"
            placeholder={t('in-settings:tabs.alertChannelName')}
            value={field.value}
            onChange={e => onChange('channel', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {form.get('emojiRendering').map(field => (
        <FormGroup>
          <Toggle
            id="global-alert-slack-emoji"
            labelA={t('in-services:formatters.no')}
            labelB={t('in-services:formatters.yes')}
            labelText={
              <Tooltip align={'rightMiddle'} delay={'500'} content={t('in-settings:tabs.displayEmojisInfo')}>
                <Stack direction="horizontal" gap="xsmall">
                  <Typography variant="body-regular">{t('in-settings:tabs.displayEmojis')}</Typography>
                  <SvgIcon onClick={() => false} type="lib_help_error_info_outline" />
                </Stack>
              </Tooltip>
            }
            checked={field.value}
            onToggle={() => onChange('emojiRendering', !field.value)}
          />
        </FormGroup>
      ))}
    </fieldset>
  );
}
