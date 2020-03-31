import { createField } from 'formalistic';
import React from 'react';

import { getConfigAsResultObservable, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './Saml.mless';

export default function Saml() {
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
      <Title title="SAML Configuration" />
      <SubViewHeader>SAML Configuration</SubViewHeader>
      <h2>Activating SAML enables Instana to authenticate a user against your Identity Provider (IdP)</h2>

      <form>
        <p>
          Quick start guides are available in our documentation pages for{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.instana.io/quick_start/authentication/activedirectory/"
          >
            Active Directory
          </Link>{' '}
          and{' '}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.instana.io/quick_start/authentication/okta/"
          >
            Okta
          </Link>
          .
        </p>

        <div className={indentityProvidersLocals.space} />

        <h2>Automatic setup</h2>
        <Button kind="secondary" icon="lib_actions_download">
          Configuration Metadata
        </Button>
        <ul className={locals.list}>
          <li>Download the Configuration Metadata via the link above</li>
          <li>Upload the Instana metadata file to your IdP</li>
          <li>Download the IdP-metadata issued from your IdP</li>
          <li>{`Use 'Upload IdP Metadata' below to deliver the file to Instana`}</li>
        </ul>

        <div className={indentityProvidersLocals.space} />

        <h2>Manual setup</h2>
        <p>
          {`This option covers the case where your IdP doesn't allow the upload of our metadata. Your IdP will require the
          creation of a SAML-app and manually entering the required values. The values required to connect to Instana
          are as follows:`}
        </p>

        <Row className={indentityProvidersLocals.row}>
          <Col xs={12}>
            {form.get('acsUrl').map(field => (
              <FormGroup>
                <Label htmlFor="saml_acs_url" hasError={!field.valid && field.touched}>
                  ACS URL
                </Label>

                <Input
                  type="text"
                  id="saml_acs_url"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['acsUrl'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col xs={12}>
            {form.get('logoutUrl').map(field => (
              <FormGroup>
                <Label htmlFor="saml_logout_url" hasError={!field.valid && field.touched}>
                  Logout URL
                </Label>

                <Input
                  type="text"
                  id="saml_logout_url"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['logoutUrl'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col xs={12}>
            {form.get('entityId').map(field => (
              <FormGroup>
                <Label htmlFor="saml_sp_entity_id" hasError={!field.valid && field.touched}>
                  Audience/SP Entity ID
                </Label>

                <Input
                  type="text"
                  id="saml_sp_entity_id"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['entityId'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
          <Col xs={12}>
            {form.get('nameFormatId').map(field => (
              <FormGroup>
                <Label htmlFor="saml_name_format_id" hasError={!field.valid && field.touched}>
                  Name ID Format
                </Label>

                <Input
                  type="text"
                  id="saml_name_format_id"
                  value={field.value}
                  onChange={e => {
                    setForm(form.updateIn(['nameFormatId'], f => f.setValue(e.target.value).setTouched(true)));
                  }}
                  autoComplete="off"
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </Col>
        </Row>

        <ul className={locals.list}>
          <li>
            There will be an option to download the IdP-metadata. Store that file in a known location on your local
            machine
          </li>
          <li>{`Use 'Upload IdP Metadata' below to deliver the file to Instana`}</li>
        </ul>

        <div className={indentityProvidersLocals.space} />

        <h2>Upload IdP Metadata</h2>
        <Button kind="secondary" icon="lib_views_file">
          Choose file…
        </Button>
        <Button icon="lib_actions_upload">Upload & Activate</Button>
      </form>
    </>
  );
}

function saveItem(form) {
  const acsUrl = form.get('acsUrl').value;
  return setConfig({
    acsUrl
  });
}

function enrichForm(form) {
  return form
    .put(
      'acsUrl',
      createField({
        value: ''
      })
    )
    .put(
      'logoutUrl',
      createField({
        value: ''
      })
    )
    .put(
      'entityId',
      createField({
        value: ''
      })
    )
    .put(
      'nameFormatId',
      createField({
        value: ''
      })
    );
}
