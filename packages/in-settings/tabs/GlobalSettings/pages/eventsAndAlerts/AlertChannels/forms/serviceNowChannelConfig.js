/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import { SvgIcon, DescriptionList, DescriptionItem, Checkbox } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { serviceNowAutoCloseAndCustomPayloadsEnabled } from 'in-services/featureFlags';
import FormGroup from 'in-settings/components/FormGroup/FormGroup';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import './Forms.less';

const block = 'in-alert-channel-config-form';
const tooltip_class = 'in-helpify-wrapper';

const name = 'SERVICE_NOW_WEBHOOK';
const label = t('in-settings:tabs.serviceNow');

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
    key: 'autoCloseIncidents',
    label: t('in-settings:tabs.autoCloseIncidents')
  }
];

export default {
  name,
  label,

  getParameters() {
    return parameters;
  },

  enrichAlertChannelObject(alertChannel) {
    alertChannel.serviceNowUrl = '';
    alertChannel.username = '';
    alertChannel.password = '';
    alertChannel.autoCloseIncidents = false;
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
        'autoCloseIncidents',
        createField({
          value: alertChannel ? alertChannel.get('autoCloseIncidents') : false
        })
      );
    return mapForm;
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      serviceNowUrl: form.get('serviceNowUrl').value,
      username: form.get('username').value,
      password: form.get('password').value,
      autoCloseIncidents: form.get('autoCloseIncidents').value
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
          <div className={tooltip_class}>
            <div className={`${tooltip_class}__content`}>
              <Label className="username_label" htmlFor="username" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.username')}
              </Label>
            </div>
            <div className={`${tooltip_class}__help-icon`}>
              <Tooltip content={t('in-settings:tabs.serviceNowUsernameTooltip')} align="rightTop">
                <SvgIcon type="lib_help_error_info_outline" color="#2D4048" size="xs" />
              </Tooltip>
            </div>
          </div>
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
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get('password').map(field => (
        <FormGroup className={block}>
          <Label htmlFor="password" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.password')}
          </Label>
          <div className={`${block}__input_with_icon`}>
            <Input
              id="password"
              type="password"
              placeholder={'*******************'}
              value={field.value}
              onChange={e => onChange('password', e.target.value)}
              hasError={!field.valid && field.touched}
              maxLength={256}
            />
          </div>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {serviceNowAutoCloseAndCustomPayloadsEnabled &&
        form.get('autoCloseIncidents').map(field => (
          <FormGroup className={block}>
            <Checkbox
              label={t('in-settings:tabs.autoCloseIncidents')}
              id="autoCloseIncidents"
              checked={field.value}
              onChange={e => onChange('autoCloseIncidents', e.target.checked)}
              size="larger"
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
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
