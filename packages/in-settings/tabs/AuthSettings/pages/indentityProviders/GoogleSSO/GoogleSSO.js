import { createField } from 'formalistic';
import React from 'react';

import { getConfigAsResultObservable, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';

import indentityProvidersLocals from '../indentityProviders.mless';

export default function GoogleSSO() {
  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable()
      })}
      enrichForm={enrichForm}
      onCancelClick={refresh}
      saveItem={saveItem}
      render={render}
    />
  );
}

function render({ form, setForm }) {
  return (
    <>
      <Title title="Google SSO Configuration" />
      <SubViewHeader>Google SSO Configuration</SubViewHeader>
      <h2>Configure allowed email domains</h2>
      <div className={indentityProvidersLocals.space} />

      <form>
        <p>
          Only users with email addresses at the following domains will be allowed to sign in to your Instana tenant:
        </p>

        <Row className={indentityProvidersLocals.row}>
          <Col xs={12}>
            {form.get('filter').map(field => (
              <FormGroup>
                <Label htmlFor="google_sso_filter" hasError={!field.valid && field.touched}>
                  Domains
                </Label>

                <Input
                  id="google_sso_filter"
                  type="text"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['filter'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  placeholder="@example.com, @example.io"
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <DescriptionText>Separate multiple domains with a comma</DescriptionText>
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>

        <div className={indentityProvidersLocals.space} />
        <h2>On-premise configuration</h2>
        <Row className={indentityProvidersLocals.row}>
          <Col xs={6}>
            {form.get('clientId').map(field => (
              <FormGroup>
                <Label htmlFor="google_sso_client_id" hasError={!field.valid && field.touched}>
                  Client ID
                </Label>

                <Input
                  type="text"
                  id="google_sso_client_id"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['clientId'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>

          <Col xs={6}>
            {form.get('clientSecret').map(field => (
              <FormGroup>
                <Label htmlFor="google_sso_client_secret" hasError={!field.valid && field.touched}>
                  Client Secret
                </Label>

                <Input
                  type="text"
                  id="google_sso_client_secret"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['clientSecret'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>
      </form>
    </>
  );
}

function saveItem(form) {
  return setConfig({
    filter: form.get('filter').value,
    clientId: form.get('clientId').value,
    clientSecret: form.get('clientSecret').value
  });
}

function enrichForm(form, { result: { config } }) {
  return form
    .put(
      'filter',
      createField({
        value: config.filter
      })
    )
    .put(
      'clientId',
      createField({
        value: config.clientId
      })
    )
    .put(
      'clientSecret',
      createField({
        value: config.clientSecret
      })
    );
}
