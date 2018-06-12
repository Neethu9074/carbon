import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { Map } from 'immutable';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Section from 'in-views/configurationView/components/Section';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { generateUniqueShortId } from 'in-services/util/id';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Button from 'in-components/Button';

import './Forms.less';

const block = 'in-integrations-config-form';

const name = 'SPLUNK';
const label = 'Splunk';

export default {
  name,
  label,

  enrichIntegrationObject(integration) {
    integration.baseUrl = '';
    integration.authToken = '';
    integration.headers = [''];
    integration.queryParameters = [''];
    integration.bodyTemplate = [''];
  },

  createDetails(integration) {
    return (
      <DescriptionList>
        <DescriptionItem title="Base URL">{integration.get('baseUrl')}</DescriptionItem>
        <DescriptionItem title="Auth token">{integration.get('authToken')}</DescriptionItem>
        <DescriptionItem title="Headers">
          {integration
            .get('headers')
            .toArray()
            .map(header => <div key={header}>{header}</div>)}
        </DescriptionItem>
        <DescriptionItem title="Query parameters">
          {integration
            .get('queryParameters')
            .toArray()
            .map(param => <div key={param}>{param}</div>)}
        </DescriptionItem>
        <DescriptionItem title="Body template">
          {integration
            .get('bodyTemplate')
            .toArray()
            .map(field => <div key={field}>{field}</div>)}
        </DescriptionItem>
      </DescriptionList>
    );
  },

  createForm(integration) {
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
          value: integration ? integration.get('name') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'baseUrl',
        createField({
          value: integration ? integration.get('baseUrl') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'authToken',
        createField({
          value: integration ? integration.get('authToken') : '',
          validator: notBlankValidator
        })
      )
      .put(
        'headers',
        createField({
          value: integration ? integration.get('headers') : Map([''])
        })
      )
      .put(
        'queryParameters',
        createField({
          value: integration ? integration.get('queryParameters') : Map([''])
        })
      )
      .put(
        'bodyTemplate',
        createField({
          value: integration ? integration.get('bodyTemplate') : Map([''])
        })
      );
  },

  createEntity(integration, form) {
    return {
      id: integration ? integration.get('id') : generateUniqueShortId(),
      kind: form.get('kind').value,
      name: form.get('name').value,
      baseUrl: form.get('baseUrl').value,
      authToken: form.get('authToken').value,
      headers: form.get('headers').value,
      queryParameters: form.get('queryParameters').value,
      bodyTemplate: form.get('bodyTemplate').value
    };
  },

  Form
};

function Form({ form, onChange }) {
  return (
    <fieldset>
      <Section>
        {form.get('name').map(field => (
          <FormGroup className={block}>
            <Label htmlFor="name" hasError={!field.valid && field.touched}>
              Name
            </Label>
            <Input
              id="name"
              className={`${block}__input`}
              type="text"
              placeholder="Splunk Integration"
              value={field.value}
              onChange={e => onChange('name', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        {form.get('baseUrl').map(field => (
          <FormGroup>
            <Label htmlFor="baseUrl" hasError={!field.valid && field.touched}>
              Base URL
            </Label>
            <Input
              className={`${block}__input`}
              id="baseUrl"
              type="url"
              placeholder="Base URL"
              value={field.value}
              onChange={e => onChange('baseUrl', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('authToken').map(field => (
          <FormGroup>
            <Label htmlFor="authToken" hasError={!field.valid && field.touched}>
              Auth Token
            </Label>
            <Input
              className={`${block}__input`}
              id="authToken"
              type="text"
              placeholder="Auth Token"
              value={field.value}
              onChange={e => onChange('authToken', e.target.value)}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Section>

      <Section>
        <FormGroup>
          <Label htmlFor="headers">Headers</Label>
        </FormGroup>
        {form.get('headers').map(field => {
          const headers = field.value;
          return headers.map((header, i) => (
            <FormGroup key={i}>
              <div className={`${block}__input-delete-wrapper`}>
                <Input
                  className={`${block}__input`}
                  id={`header_${header}`}
                  type="header"
                  placeholder="New key"
                  value={header}
                  onChange={e => onChangeHeader(e, form, onChange, i)}
                />
                <Input
                  className={`${block}__input`}
                  id={`header_${header}`}
                  type="header"
                  placeholder="Value"
                  value={header}
                  onChange={e => onChangeHeader(e, form, onChange, i)}
                />
                <Button
                  className={`${block}__delete-button`}
                  kind="danger"
                  onClick={() => removeHeader(form, onChange, i)}
                >
                  Remove
                </Button>
              </div>
            </FormGroup>
          ));
        })}
        <div className={`${block}__add-button-wrapper`}>
          <span className={`${block}__add-link`} onClick={() => addHeader(form, onChange)}>
            Add Field
          </span>
        </div>
      </Section>

      <Section>
        <FormGroup>
          <Label htmlFor="queryParameters">Query Parameters</Label>
        </FormGroup>
        {form.get('queryParameters').map(field => {
          const params = field.value;
          return params.map((param, i) => (
            <FormGroup key={i}>
              <div className={`${block}__input-delete-wrapper`}>
                <Input
                  className={`${block}__input`}
                  id={`queryParameterKey_${param}`}
                  type="param"
                  placeholder="New key"
                  value={param}
                  onChange={e => onChangeQueryParameter(e, form, onChange, i)}
                />
                <Input
                  className={`${block}__input`}
                  id={`queryParameterValue_${param}`}
                  type="param"
                  placeholder="Value"
                  value={param}
                  onChange={e => onChangeQueryParameter(e, form, onChange, i)}
                />
                <Button
                  className={`${block}__delete-button`}
                  kind="danger"
                  onClick={() => removeQueryParameter(form, onChange, i)}
                >
                  Remove
                </Button>
              </div>
            </FormGroup>
          ));
        })}
        <div className={`${block}__add-button-wrapper`}>
          <span className={`${block}__add-link`} onClick={() => addQueryParameter(form, onChange)}>
            Add Field
          </span>
        </div>
      </Section>

      <Section>
        <FormGroup>
          <Label htmlFor="bodyTemplate">Body Template</Label>
        </FormGroup>
        {form.get('bodyTemplate').map(field => {
          const bodyTemplateFields = field.value;
          return bodyTemplateFields.map((field, i) => (
            <FormGroup key={i}>
              <div className={`${block}__input-delete-wrapper`}>
                <Input
                  className={`${block}__input`}
                  id={`bodyTemplateKey_${field}`}
                  type="bodyTemplate"
                  placeholder="New key"
                  value={field}
                  onChange={e => onChangeBodyField(e, form, onChange, i)}
                />
                <Input
                  className={`${block}__input`}
                  id={`bodyTemplateValue_${field}`}
                  type="bodyTemplate"
                  placeholder="Value"
                  value={field}
                  onChange={e => onChangeBodyField(e, form, onChange, i)}
                />
                <Button
                  className={`${block}__delete-button`}
                  kind="danger"
                  onClick={() => removeBodyField(form, onChange, i)}
                >
                  Remove
                </Button>
              </div>
            </FormGroup>
          ));
        })}
        <div className={`${block}__add-button-wrapper`}>
          <span className={`${block}__add-link`} onClick={() => addBodyField(form, onChange)}>
            Add Field
          </span>
        </div>
      </Section>
    </fieldset>
  );
}

function onChangeHeader(e, form, onChange, index) {
  const headers = form.get('headers').value.setIn([index], e.target.value);
  onChange('headers', headers);
}

function addHeader(form, onChange) {
  let headers = form.get('headers').value;
  headers = headers.push('');
  onChange('headers', headers);
}

function removeHeader(form, onChange, index) {
  const headers = form.get('headers').value.deleteIn([index]);
  onChange('headers', headers);
}

function onChangeQueryParameter(e, form, onChange, index) {
  const queryParameters = form.get('queryParameters').value.setIn([index], e.target.value);
  onChange('queryParameters', queryParameters);
}

function addQueryParameter(form, onChange) {
  let queryParameters = form.get('queryParameters').value;
  queryParameters = queryParameters.push('');
  onChange('queryParameters', queryParameters);
}

function removeQueryParameter(form, onChange, index) {
  const queryParameters = form.get('queryParameters').value.deleteIn([index]);
  onChange('queryParameters', queryParameters);
}

function onChangeBodyField(e, form, onChange, index) {
  const bodyTemplate = form.get('bodyTemplate').value.setIn([index], e.target.value);
  onChange('bodyTemplate', bodyTemplate);
}

function addBodyField(form, onChange) {
  let bodyTemplate = form.get('bodyTemplate').value;
  bodyTemplate = bodyTemplate.push('');
  onChange('bodyTemplate', bodyTemplate);
}

function removeBodyField(form, onChange, index) {
  const bodyTemplate = form.get('bodyTemplate').value.deleteIn([index]);
  onChange('bodyTemplate', bodyTemplate);
}
