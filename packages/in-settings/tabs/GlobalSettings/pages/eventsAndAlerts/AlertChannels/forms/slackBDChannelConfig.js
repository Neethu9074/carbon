/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import {
  DescriptionList,
  DescriptionItem,
  Stack,
  Toggle,
  Typography,
  CarbonButton,
  InfoIcon
} from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { SETTINGS_ALERT_CHANNEL_CREATE } from 'in-services/tracking/eventNames';
import { alertChannelCTATrackerSegment } from 'in-settings/tracker';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SectionHelp from 'in-settings/components/SectionHelp';
import FormGroup from 'in-settings/components/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'BIDIRECTIONAL_SLACK';
const label = t('in-settings:tabs.slackBD');

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
    key: 'emojiRendering',
    label: t('in-settings:tabs.displayEmojis')
  },
  {
    key: 'generatedLinkClicked',
    label: t('in-settings:tabs.type')
  }
];

export default {
  name,
  label,
  testAPI: null,
  customSubmit: {
    noCreateAPI: true,
    submitSaveLabel: t('in-settings:tabs.doneButton'),
    submitCreateLabel: t('in-settings:tabs.doneButton')
  },
  noTeams: true, //TODO: review behavior when teams tagging is present and enable when design is finalized
  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.emojiRendering = false;
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList inComponents>
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
        'emojiRendering',
        createField({
          value: alertChannel ? alertChannel.get('emojiRendering') : false
        })
      )
      .put(
        'generatedLinkClicked',
        createField({
          value: alertChannel ? alertChannel.get('generatedLinkClicked') : false,
          validator: val => {
            if (val == null || val == false) {
              return [
                {
                  severity: 'error',
                  message: t('in-settings:tabs.setupError')
                }
              ];
            }
          }
        })
      );
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      channel: form.get('name').value,
      emojiRendering: form.get('emojiRendering').value
    };
  },

  Form
};

function Form({ form, onChange }) {
  const [disableButton, setDisableButton] = useState(true);
  const [newName, setNewName] = useState(false);

  // If a new name is typed in AFTER the authorization button was clicked
  // for a previous entered name we want to trigger the error alerting them
  // they still need to reauthorize and click the button a second time.
  if (newName && form.get('generatedLinkClicked').touched) {
    onChange('generatedLinkClicked', undefined);
    setNewName(false);
  }
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
            placeholder={t('in-settings:tabs.slackBDAlertChannel')}
            value={field.value}
            onChange={e => {
              onChange('name', e.target.value);
              setDisableButton(false);
              setNewName(true);
            }}
            hasError={!field.valid && field.touched}
            maxLength={256}
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
              <Stack direction="horizontal" gap="xsmall">
                <Typography variant="body-regular">{t('in-settings:tabs.displayEmojis')}</Typography>
                <InfoIcon description={t('in-settings:tabs.displayEmojisInfo')} align={'right'} />
              </Stack>
            }
            checked={field.value}
            onToggle={() => {
              onChange('emojiRendering', !field.value);
              setDisableButton(false);
            }}
          />
        </FormGroup>
      ))}

      {form.get('generatedLinkClicked').map(field => (
        <FormGroup>
          <Label htmlFor="generatedLinkClicked" hasError={!field.valid && field.touched}>
            <Stack direction="horizontal" gap="xsmall">
              {t('in-settings:tabs.setup')}
            </Stack>
            <SectionHelp>{t('in-settings:tabs.slackBDHelp')}</SectionHelp>
          </Label>
          <CarbonButton
            disabled={disableButton}
            onClick={() => {
              onChange('generatedLinkClicked', true);
              setNewName(false);
              alertChannelCTATrackerSegment({
                EVENT_NAME: SETTINGS_ALERT_CHANNEL_CREATE,
                path: '',
                channel: form.get('kind').value
              });
              const id = form.get('id') ? form.get('id').value : generateUniqueShortId();
              const integrationBaseUrl = window.instana.config.integrationBaseUrl;
              const params = new URLSearchParams({
                endpoint: integrationBaseUrl,
                tenant: window.instana.config.tenant,
                unit: window.instana.config.tenantUnit,
                id: id,
                name: form.get('name').value
              });

              const url = `${integrationBaseUrl}/integration/slack/bidirectional/install?${params.toString()}`;

              window.open(url, '_blank');
            }}
          >
            {t('in-settings:tabs.slackBDAuth')}
          </CarbonButton>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </fieldset>
  );
}
