/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { getConfigAsResultObservable, deleteConfig, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
import { isAnotherIdpActivated } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
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

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './OIDC.mless';

export default function OIDC() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(),
        samlConfig: getSamlConfig(),
        ldapConfig: getLdapConfig()
      })}
      enrichForm={enrichForm}
      deleteItem={deleteItem}
      input={input}
      file={file}
      onCancelClick={() => {
        setFile(null);
        refresh();
      }}
      saveItem={({ setMessage, form, result }) => {
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = function(evt) {
            saveItem({
              result,
              setMessage,
              idpMetadata: evt.target.result,
              spEntityId: form.get('spEntityId').value,
              ownerEmail: form.get('ownerEmail').value,
              discoveryUri: form.get('discoveryUri').value,
              secret: form.get('secret').value
            });
          };
        } else {
          saveItem({
            result,
            setMessage,
            idpMetadata: '',
            spEntityId: form.get('spEntityId').value,
            ownerEmail: form.get('ownerEmail').value,
            discoveryUri: form.get('discoveryUri').value,
            secret: form.get('secret').value
          });
        }
      }}
      Content={Content}
    />
  );
}

function Content({ file, form, setForm, input, setCanSaveItem, result }) {
  useEffect(
    // allow only saving when either idP metadata has been uploaded or discovery and secret field are defined
    () => setCanSaveItem(!!file || (form.get('discoveryUri').value && form.get('secret').value)),
    [file, form, setCanSaveItem]
  );

  return (
    <>
      <Title title="Configure OpenID Connect" />
      <SubViewHeader>OIDC Configuration</SubViewHeader>
      {isAnotherIdpActivated([result.ldapConfig?.base, result.samlConfig?.activated]) ? (
        <h2>OIDC is not configurable as long as you have another active identity provider configuration.</h2>
      ) : (
        <>
          <h2>Activating OIDC enables Instana to authenticate a user against your Identity Provider (IdP).</h2>
          <form method="post" encType="multipart/form-data">
            <Section restrictWidth="50rem">
              <Row>
                <Col xs={12}>
                  {form.get('spEntityId').map(field => (
                    <FormGroup>
                      <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                        ClientID
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
                        type="email"
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
              <h2>Upload IdP Metadata</h2>
              <p>
                You can either upload your IdP Metadata via a file upload or use a discovery URL and secret of your OIDC
                configuration and Instana will fetch it automatically.
              </p>
              <div>
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

                <p>Alternatively, define a discovery URL and secret here:</p>

                {form.get('discoveryUri').map(field => (
                  <FormGroup>
                    <Label htmlFor="url" hasError={!field.valid && field.touched}>
                      Discovery URL
                    </Label>
                    <Input
                      className={locals.input}
                      type="text"
                      id="discoveryUri"
                      value={field.value}
                      onChange={e => {
                        setForm(form.updateIn(['discoveryUri'], f => f.setValue(e.target.value).setTouched(true)));
                      }}
                      disabled={!!file} // this input is disabled when a metadata file has been upload
                      autoComplete="off"
                    />
                  </FormGroup>
                ))}

                {form.get('secret').map(field => (
                  <FormGroup>
                    <Label htmlFor="secret" hasError={!field.valid && field.touched}>
                      Secret
                    </Label>
                    <Input
                      className={locals.input}
                      type="text"
                      id="secret"
                      value={field.value}
                      onChange={e => {
                        setForm(form.updateIn(['secret'], f => f.setValue(e.target.value).setTouched(true)));
                      }}
                      disabled={!!file} // this input is disabled when a metadata file has been upload
                      autoComplete="off"
                    />
                  </FormGroup>
                ))}
              </div>
            </Section>

            <Section restrictWidth="50rem">
              <h2>Client setup</h2>
              <p className={locals.descriptionText}>
                {`This option covers the case where your IdP doesn't allow the upload of our metadata. Your IdP will require the
              creation of an OIDC client and manually entering the required values. The values required to connect to Instana
              are as follows:`}
              </p>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <CopyableText title="Redirect URL" form={form} fieldName="oidcSignInCallbackUrl" />
                </Col>
                <Col xs={12}>
                  <CopyableText title="End Session URL" form={form} fieldName="oidcSignOutCallbackUrl" />
                </Col>
                <Col xs={12}>
                  <CopyableText title="Name ID Format" form={form} fieldName="nameIdFormat" />
                </Col>
              </Row>

              <ul className={locals.list}>
                <li>
                  There will be an option to download the IdP-metadata. Store that file in a known location on your
                  local machine.
                </li>
                <li>{`Use 'Upload IdP Metadata' below to deliver the file to Instana`}</li>
              </ul>
            </Section>
          </form>
        </>
      )}
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

function saveItem({ result, setMessage, idpMetadata, spEntityId, ownerEmail, discoveryUri, secret }) {
  if (result.samlConfig?.activated) {
    setMessage({ text: 'SAML configuration is already active. Please deactivate SAML first.', type: errorType });
  } else {
    setMessage({ message: 'Saving config', type: neutral, isSaving: true });
    const setConfigResult$ = setConfig({ idpMetadata, spEntityId, ownerEmail, discoveryUri, secret });
    setConfigResult$.once(
      () => setMessage({ text: 'Config successfully saved.', type: success }),
      error => setMessage({ text: `Failed to save config: ${error.message}`, type: errorType })
    );
  }
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  setCanDeleteItem(!!config.activated);
  return form
    .put('oidcSignInCallbackUrl', createField({ value: config.oidcSignInCallbackUrl || '' }))
    .put('oidcSignOutCallbackUrl', createField({ value: config.oidcSignOutCallbackUrl || '' }))
    .put('spEntityId', createField({ value: config.spEntityId || '' }))
    .put('ownerEmail', createField({ value: '' }))
    .put('nameIdFormat', createField({ value: config.nameIdFormat || '' }))
    .put('discoveryUri', createField({ value: config.discoveryUri || '' }))
    .put('secret', createField({ value: config.secret || '' }));
}
