import { createField } from 'formalistic';
import React from 'react';

import { getConfigAsResultObservable, setConfig } from 'in-settings/tabs/AuthSettings/api/googleSSO';
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
            {form.get('domains').map(field => (
              <FormGroup>
                <Label htmlFor="google_sso_domains" hasError={!field.valid && field.touched}>
                  Domains
                </Label>

                <Input
                  id="google_sso_domains"
                  type="text"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['domains'], f => f.setValue(e.target.value).setTouched(true)));
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
  const domains = form.get('domains').value;
  return setConfig({
    domains
  });
}

function enrichForm(form) {
  return form
    .put(
      'domains',
      createField({
        value: ''
      })
    )
    .put(
      'clientId',
      createField({
        value: ''
      })
    )
    .put(
      'clientSecret',
      createField({
        value: ''
      })
    );
}
