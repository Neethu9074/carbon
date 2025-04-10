/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { Collapsible, DescriptionList, DescriptionItem, RadioButton, Link } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { serviceNowAdvancedEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SectionHelp from 'in-settings/components/SectionHelp';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { config } from 'in-services/config';
import { t, Trans } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'SERVICE_NOW_APPLICATION';
const label = t('in-settings:tabs.serviceNowBD');

const parameters = [
  {
    key: 'name',
    label: t('in-settings:tabs.name')
  },
  {
    key: 'serviceNowUrl',
    label: t('in-settings:tabs.serviceNowUrl')
  },
  {
    key: 'username',
    label: t('in-settings:tabs.username')
  },
  {
    key: 'password',
    label: t('in-settings:tabs.password')
  },
  {
    key: 'intermediateTable',
    label: t('in-settings:tabs.intermediateTable')
  }
];

export default {
  name,
  label,
  isAlpha: false,
  isBeta: true,
  testAPI: null,
  active: serviceNowAdvancedEnabled,
  feedbackLink: 'https://your.feedback.ibm.com/jfe/form/SV_1X4s0aRWYgXE1Fk',

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.serviceNowUrl = '';
    alertChannel.username = '';
    alertChannel.password = '';
    alertChannel.intermediateTable = true;
  },

  createDetails(alertChannel) {
    return (
      <DescriptionList inComponents>
        <DescriptionItem inComponents title={t('in-settings:tabs.serviceNowUrl')}>
          {alertChannel.get('serviceNowUrl')}
        </DescriptionItem>
        <DescriptionItem inComponents title={t('in-settings:tabs.username')}>
          {alertChannel.get('username')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(alertChannel) {
    const mapForm = createMapForm()
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
          validator: value => notBlankCustomFieldValidation(value, t('in-settings:tabs.name'))
        })
      )
      .put(
        'tenant',
        createField({
          value: config.tenant
        })
      )
      .put(
        'unit',
        createField({
          value: config.tenantUnit
        })
      )
      .put(
        'serviceNowUrl',
        createField({
          value: alertChannel ? alertChannel.get('serviceNowUrl') : '',
          validator: value => notBlankCustomFieldValidation(value, t('in-settings:tabs.serviceNowUrl'))
        })
      )
      .put(
        'username',
        createField({
          value: alertChannel ? alertChannel.get('username') : '',
          validator: value => notBlankCustomFieldValidation(value, t('in-settings:tabs.username'))
        })
      )
      .put(
        'password',
        createField({
          value: alertChannel ? alertChannel.get('password') : '',
          validator: value => notBlankCustomFieldValidation(value, t('in-settings:tabs.password'))
        })
      )
      .put(
        'intermediateTable',
        createField({
          value: alertChannel ? true : false
        })
      );
    return mapForm;
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      tenant: form.get('tenant').value,
      unit: form.get('unit').value,
      serviceNowUrl: form.get('serviceNowUrl').value,
      username: form.get('username').value,
      password: form.get('password').value,
      autoCloseIncidents: form.get('intermediateTable').value,
      resolutionOfIncident: form.get('intermediateTable').value,
      enableSendInstanaNotes: form.get('intermediateTable').value,
      manuallyClosedIncidents: form.get('intermediateTable').value,
      enableSendServiceNowWorkNotes: form.get('intermediateTable').value,
      enableSendServiceNowActivities: form.get('intermediateTable').value
    };
  },

  Form
};

function Form({ form, onChange }) {
  const [propagate, setPropagate] = useState(form?.get('intermediateTable')?.value);

  return (
    <fieldset>
      <FormGroup>
        <SectionHelp>
          {
            <Trans
              i18nKey="in-settings:tabs.serviceNowDescription"
              components={{
                Link: (
                  <Link
                    external
                    href="https://store.servicenow.com/sn_appstore_store.do#!/store/application/e2b8d11fc3c202107ca67addd4013163/2.288.0"
                  />
                )
              }}
            />
          }
        </SectionHelp>
      </FormGroup>
      {form.get('name').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="name"
            className={`${block}__input`}
            type="text"
            placeholder={t('in-settings:tabs.serviceNowAlertChannel')}
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('serviceNowUrl').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="serviceNowUrl" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.url')}
          </Label>
          <Input
            className={`${block}__input`}
            id="serviceNowUrl"
            type="url"
            placeholder="https://www.website.com"
            value={field.value}
            onChange={e => onChange('serviceNowUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('username').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="username" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.username')}
          </Label>
          <Input
            id="username"
            className={`${block}__input`}
            type="text"
            placeholder={'name@email.com'}
            value={field.value}
            onChange={e => onChange('username', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />
          <div className={`${block}__field_help_text`}>{t('in-settings:tabs.serviceNowUsernameTooltip')}</div>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('password').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="password" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.password')}
          </Label>

          <Input
            id="password"
            type="password"
            placeholder={'*******************'}
            value={field.value}
            onChange={e => onChange('password', e.target.value)}
            hasError={!field.valid && field.touched}
            maxLength={256}
          />

          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {serviceNowAdvancedEnabled && (
        <Collapsible>
          <Collapsible.Header>{t('in-settings:tabs.advanced')}</Collapsible.Header>
          <Collapsible.Content>
            <div className={`${block}__advanced_content`}>
              <Trans i18nKey="in-settings:tabs.advancedIntro" />
              <section id="advanced">
                <Label htmlFor="advanced">{t('in-settings:tabs.eventProps')}</Label>
                {form.get('intermediateTable').map(field => (
                  <FormGroup className={block}>
                    <RadioButton
                      label={t('in-settings:tabs.propIncidentTable')}
                      id="intermediateTable"
                      checked={propagate}
                      onChange={() => {
                        setPropagate(!propagate);
                        onChange('intermediateTable', !propagate);
                      }}
                    />
                    <div style={{ marginLeft: '1.9rem' }} className={`${block}__field_help_text`}>
                      {t('in-settings:tabs.propIncidentTableDesc')}
                    </div>
                    <br />
                    <RadioButton
                      label={t('in-settings:tabs.restIncidentTable')}
                      id="intermediateTableRestrict"
                      checked={!propagate}
                      onChange={() => {
                        setPropagate(!propagate);
                        onChange('intermediateTable', !propagate);
                      }}
                    />
                    <div style={{ marginLeft: '1.9rem' }} className={`${block}__field_help_text`}>
                      <Trans
                        i18nKey="in-settings:tabs.restIncidentTableDesc"
                        components={{
                          documentationLink: (
                            <Link external href="https://ibm.biz/servicenow-app-alert" style={{ fontSize: '12px' }} />
                          )
                        }}
                      />
                    </div>
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </section>
            </div>
          </Collapsible.Content>
        </Collapsible>
      )}
    </fieldset>
  );
}

function notBlankCustomFieldValidation(fieldValue, fieldName) {
  const errors = [];
  const error = notBlankValidator(fieldValue);
  if (error?.length > 0) {
    errors.push({
      severity: 'error',
      message: `${fieldName} must not be blank`
    });
  }
  return errors;
}
