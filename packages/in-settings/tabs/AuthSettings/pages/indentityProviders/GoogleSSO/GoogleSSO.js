import { createField } from 'formalistic';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ApiItemView from 'in-settings/components/ApiItemView';
import { neutral } from 'in-new-components/Message/types';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';

import indentityProvidersLocals from '../indentityProviders.mless';

export default function GoogleSSO() {
  return (
    <ApiItemView
      getObservables={() => ({})}
      enrichForm={enrichForm}
      saveItem={saveItem}
      render={render}
      renderLoadingState={renderLoadingState}
    />
  );
}

function renderLoadingState() {
  return <div>Loading</div>;
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
            {form.get('emails').map(field => (
              <FormGroup>
                <Label htmlFor="google_sso_emails" hasError={!field.valid && field.touched}>
                  Domains
                </Label>

                <Input
                  type="text"
                  id="google_sso_emails"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['emails'], f => f.setValue(e.target.value).setTouched(true)));
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

        <h2>Configure allowed email domains.</h2>
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

function saveItem({ setMessage }) {
  // const emails = form.get('emails').value;

  setMessage({ text: 'Saving SSO config', type: neutral });
  // const setRoleResult$ = setRole(userId, roleId);
  // setRoleResult$.once(
  //   () => {
  //     setMessage({ text: 'Role change successfully saved.', type: success });
  //   },
  //   error => setMessage({ text: `Failed to set user role: ${error.message}`, type: errorType })
  // );
}

function enrichForm(form) {
  return form
    .put(
      'emails',
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
