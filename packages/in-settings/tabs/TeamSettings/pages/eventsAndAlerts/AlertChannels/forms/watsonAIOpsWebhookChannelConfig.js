/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, createListForm } from 'formalistic';
import React, { Fragment } from 'react';

import { Link, DescriptionList, DescriptionItem, IconButton } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import SectionHeading from 'in-settings/components/SectionHeading';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SectionHelp from 'in-settings/components/SectionHelp';
import FormGroup from 'in-settings/components/FormGroup';
import { emptyList } from 'in-services/fixedImmutables';
import { isNotBlank } from 'in-services/util/string';
import { Col, Row } from 'in-components/layout/Grid';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t, Trans } from 'in-i18n';

import locals from './webhookChannelConfig.mless';
import './Forms.less';

const block = 'in-alert-channel-config-form';

const name = 'WATSON_AIOPS_WEBHOOK';
const label = t('in-settings:tabs.ibmWatsonAIOpsWebhook');

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
    key: 'headers',
    label: t('in-settings:tabs.additionalHeaders')
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
      <DescriptionList inComponents>
        <DescriptionItem inComponents title={t('in-settings:tabs.webhookUrl')}>
          {alertChannel.get('webhookUrl')}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(alertChannel) {
    const headers = (alertChannel.get('headers') || emptyList)
      .toArray()
      .map(s => {
        const [key, value] = s.split(':', 2);
        if (isNotBlank(key) && isNotBlank(value)) {
          return createHeaderForm(key, value);
        }
        return null;
      })
      .filter(Boolean)
      .reduce((agg, subForm) => agg.push(subForm), createListForm());

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
          value: alertChannel?.get('name') ?? '',
          validator: notBlankValidator
        })
      )
      .put(
        'webhookUrl',
        createField({
          value: alertChannel?.get('webhookUrl') ?? '',
          validator: notBlankValidator
        })
      )
      .put('headers', headers);
  },

  createEntity(alertChannel, form) {
    return {
      id: alertChannel ? alertChannel.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      webhookUrl: form.get('webhookUrl').value,
      headers: form
        .get('headers')
        .toJS()
        .map(({ key, value }) => `${key}: ${value}`)
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
            placeholder={t('in-settings:tabs.ibmWatsonAIOpsAlertChannel')}
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
            <Trans
              i18nKey="in-settings:tabs.webhookUrlToIbmWatsonAIOps"
              components={{
                incomingWebhookLink: (
                  <Link
                    size="sm"
                    href="https://www.ibm.com/support/knowledgecenter/en/SSTPTP_1.6.3/com.ibm.netcool_ops.doc/cem/em_incomingwebhook.html"
                    external
                  />
                )
              }}
            />
          </Label>
          <Input
            className={`${block}__input`}
            id="webhookUrl"
            type="url"
            value={field.value}
            onChange={e => onChange('webhookUrl', e.target.value)}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <HttpHeaders form={form} onChange={onChange} addHeader={addHeader} removeHeader={removeHeader} />
    </fieldset>
  );
}

function onChangeHeader(form, onChange, path, value) {
  const updatedHeaders = form.get('headers').updateIn(path, field => field.setValue(value).setTouched(true));
  onChange('headers', updatedHeaders, undefined, true);
}

function addHeader(form, onChange) {
  const headers = form.get('headers').setTouched(true).push(createHeaderForm());
  onChange('headers', headers, undefined, true);
}

function removeHeader(form, onChange, index) {
  const headers = form.get('headers').setTouched(true).remove(index);
  onChange('headers', headers, undefined, true);
}

function createHeaderForm(key, value) {
  return createMapForm()
    .put(
      'key',
      createField({
        value: key || '',
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: value || '',
        validator: notBlankValidator
      })
    );
}

function HttpHeaders({ form, onChange, addHeader, removeHeader, disabled }) {
  return (
    <Fragment>
      <SectionHeading>{t('in-settings:tabs.customHttpRequestHeaders')}</SectionHeading>
      <SectionHelp>
        <p>{t('in-settings:tabs.customHttpHeadersAreUsefulToSupportAuthenticationMechanisms')}</p>
      </SectionHelp>

      {form.get('headers').map((header, i) => (
        <Fragment key={i}>
          <TouchedMessages field={header} />

          <div className={locals.removableRow}>
            <Row>
              <Col md={6}>
                {header.get('key').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-key`} hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.key')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-key`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChangeHeader(form, onChange, [i, 'key'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col md={6}>
                {header.get('value').map(field => (
                  <FormGroup>
                    <Label htmlFor={`config-headers-${i}-value`} hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.value')}
                    </Label>
                    <Input
                      id={`config-headers-${i}-value`}
                      type="text"
                      value={field.value || ''}
                      onChange={e => onChangeHeader(form, onChange, [i, 'value'], e.target.value)}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
            </Row>
            <IconButton
              kind="primary"
              className={locals.removeButton}
              type="lib_actions_delete"
              onClick={() => !disabled && removeHeader(form, onChange, i)}
            />
          </div>
        </Fragment>
      ))}

      <div className={`${block}__add-button-wrapper`}>
        <span className={`${block}__add-link`} onClick={() => addHeader(form, onChange)}>
          {t('in-settings:tabs.addHeader')}
        </span>
      </div>
    </Fragment>
  );
}
