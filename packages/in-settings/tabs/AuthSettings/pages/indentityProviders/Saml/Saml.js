import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { getConfigAsResultObservable, deleteConfig, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-new-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { shorten } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './Saml.mless';

export default function Saml() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable()
      })}
      enrichForm={enrichForm}
      deleteItem={deleteItem}
      input={input}
      file={file}
      onCancelClick={() => {
        setFile(null);
        refresh();
      }}
      saveItem={({ setMessage }) => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt) {
          saveItem({ idpMetadata: evt.target.result, setMessage });
        };
      }}
      render={props => render({ ...props, input })}
    />
  );
}

function render({ file, form, setForm, input, setCanSaveItem }) {
  useEffect(() => {
    setCanSaveItem(!!file);
  }, [file]);

  return (
    <>
      <Title title="Configure SAML" />
      <SubViewHeader>SAML Configuration</SubViewHeader>
      <h2>Activating SAML enables Instana to authenticate a user against your Identity Provider (IdP).</h2>

      <p>
        Quick start guides are available in our documentation pages for{' '}
        <Link external href="https://instana.com/docs/admin/active-directory/">
          Active Directory
        </Link>{' '}
        and{' '}
        <Link external href="https://instana.com/docs/admin/okta/">
          Okta
        </Link>
        .
      </p>

      <form method="post" encType="multipart/form-data">
        <Section restrictWidth="50rem">
          <Row>
            <Col xs={12}>
              {form.get('spEntityId').map(field => (
                <FormGroup>
                  <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                    Audience/SP Entity ID
                  </Label>

                  <Input
                    className={locals.input}
                    type="text"
                    id="spEntityId"
                    value={field.value}
                    onChange={e => {
                      setForm(form.updateIn(['spEntityId'], f => f.setValue(e.target.value).setTouched(true)));
                    }}
                    autoComplete="off"
                  />
                </FormGroup>
              ))}
            </Col>
          </Row>

          <Row className={indentityProvidersLocals.row}>
            <Col xs={12}>
              {form.get('ownerEmail').map(field => (
                <FormGroup>
                  <Label htmlFor="ownerEmail" hasError={!field.valid && field.touched}>
                    This account is automatically assigned an admin role.
                  </Label>

                  <Input
                    className={locals.input}
                    type="text"
                    id="ownerEmail"
                    value={field.value}
                    onChange={e => {
                      setForm(form.updateIn(['ownerEmail'], f => f.setValue(e.target.value).setTouched(true)));
                    }}
                    autoComplete="off"
                  />
                </FormGroup>
              ))}
            </Col>
          </Row>
        </Section>

        <Section restrictWidth="50rem">
          <h2>Automatic setup</h2>
          {form.get('spEntityId').map(field => (
            <Button
              kind="secondary"
              icon="lib_actions_download"
              href={`/api/settings/authentication/saml/metadata?spEntityId=${encodeURIComponent(field.value)}`}
            >
              Configuration Metadata
            </Button>
          ))}

          <ul className={locals.list}>
            <li>Download the Configuration Metadata via the link above.</li>
            <li>Upload the Instana metadata file to your IdP.</li>
            <li>Download the IdP-metadata issued from your IdP.</li>
            <li>{`Use 'Upload IdP Metadata' below to deliver the file to Instana.`}</li>
          </ul>
        </Section>
        <Section restrictWidth="50rem">
          <h2>Manual setup</h2>
          <p className={locals.descriptionText}>
            {`This option covers the case where your IdP doesn't allow the upload of our metadata. Your IdP will require the
          creation of a SAML-app and manually entering the required values. The values required to connect to Instana
          are as follows:`}
          </p>

          <Row className={indentityProvidersLocals.row}>
            <Col xs={12}>
              <CopyableText title="ACS URL" form={form} fieldName="samlSignInCallbackUrl" />
            </Col>
            <Col xs={12}>
              <CopyableText title="Logout URL" form={form} fieldName="samlSignOutCallbackUrl" />
            </Col>
            <Col xs={12}>
              <CopyableText title="Audience/SP Entity ID" form={form} fieldName="spEntityId" />
            </Col>
            <Col xs={12}>
              <CopyableText title="Name ID Format" form={form} fieldName="nameIdFormat" />
            </Col>
          </Row>

          <ul className={locals.list}>
            <li>
              There will be an option to download the IdP-metadata. Store that file in a known location on your local
              machine.
            </li>
            <li>{`Use 'Upload IdP Metadata' below to deliver the file to Instana`}</li>
          </ul>
        </Section>

        <Section restrictWidth="50rem">
          <h2>Upload IdP Metadata</h2>
          <div className={locals.flexWrapper}>
            <Button
              kind="secondary"
              icon="lib_views_file"
              onClick={() => {
                input.type = 'file';
                input.accept = 'text/xml';
                input.click();
              }}
            >
              {file ? shorten(file.name, 32) : 'Choose file…'}
            </Button>
          </div>
        </Section>
      </form>
    </>
  );
}

function CopyableText({ title, form, fieldName }) {
  return form.get(fieldName).map(field => (
    <FormGroup>
      <Label htmlFor={fieldName} hasError={!field.valid && field.touched}>
        {title}
      </Label>

      <div className={locals.flexWrapper}>
        <Input className={locals.input} readOnly type="text" id={fieldName} value={field.value} autoComplete="off" />
        <CopyToClipboardButton getText={() => field.value} />
      </div>
    </FormGroup>
  ));
}

function deleteItem({ setMessage }) {
  setMessage({ message: 'Deleting config', type: neutral, isSaving: true });
  const setConfigResult$ = deleteConfig();
  setConfigResult$.once(
    () => {
      setMessage({ text: 'Config successfully deleted.', type: success });
    },
    error => setMessage({ text: `Failed to delete config: ${error.message}`, type: errorType })
  );
}

function saveItem({ setMessage, setLoading, idpMetadata }) {
  setMessage({ message: 'Saving config', type: neutral, isSaving: true });
  setLoading(true);
  const setConfigResult$ = setConfig({ idpMetadata });
  setConfigResult$.once(
    () => {
      setMessage({ text: 'Config successfully saved.', type: success });
      setLoading(false);
    },
    error => {
      setLoading(false);
      setMessage({ text: `Failed to save config: ${error.message}`, type: errorType });
    }
  );
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  setCanDeleteItem(!!config.activated);
  return form
    .put('samlSignInCallbackUrl', createField({ value: config.samlSignInCallbackUrl || '' }))
    .put('samlSignOutCallbackUrl', createField({ value: config.samlSignOutCallbackUrl || '' }))
    .put('spEntityId', createField({ value: config.spEntityId || '' }))
    .put('ownerEmail', createField({ value: config.spEntityId || '' }))
    .put('nameIdFormat', createField({ value: config.nameIdFormat || '' }));
}
