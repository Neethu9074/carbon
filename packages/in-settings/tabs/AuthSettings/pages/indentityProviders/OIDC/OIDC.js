/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { Button } from '@instana/components';

import { getConfigAsResultObservable, deleteConfig, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/oidc';
import { isAnotherIdpActivated } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/configuredIdPCheck';
import { defaultIdpType, idpTypes } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/OIDC/idpTypes';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/AuthSettings/api/ldap';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import { notBlankValidator } from 'in-services/validators/string';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { Row, Col } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { shorten } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './OIDC.mless';

const secretPlaceholder = 'HIDDEN';

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
              secret: form.get('secret').value,
              idpType: form.get('idpType').value
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
            secret: form.get('secret').value,
            idpType: form.get('idpType').value
          });
        }
      }}
      Content={Content}
    />
  );
}

function Content({ file, form, setForm, input, setCanSaveItem, result }) {
  useEffect(
    // allow only saving when secret field is set and either idP metadata has been uploaded or discovery url has been set
    () => setCanSaveItem(form.get('secret').value && (!!file || form.get('discoveryUri').value)),
    [file, form, setCanSaveItem]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configureOpenIDConnect')} />
      <SubViewHeader>{t('in-settings:tabs.oidcConfiguration')}</SubViewHeader>
      {isAnotherIdpActivated([result.ldapConfig?.base, result.samlConfig?.activated]) ? (
        <h2>{t('in-settings:tabs.cannotConfigureOidcIfAnotherOneIsAlreadyActive')}</h2>
      ) : (
        <>
          <h2>{t('in-settings:tabs.activatingOidcEnablesInstanaToAuthenticateAUserAgainstYourIdentityProviderIdP')}</h2>
          <form method="post" encType="multipart/form-data">
            <Section restrictWidth="50rem">
              <Row>
                <Col xs={12}>
                  {form.get('idpType').map(field => (
                    <FormGroup>
                      <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                        {t('in-settings:tabs.identityProviderType')}
                      </Label>

                      <Select
                        value={field.value.key}
                        id="idpType"
                        onChange={e => {
                          setForm(form.updateIn(['idpType'], f => f.setValue(e.target.value).setTouched(true)));
                        }}
                      >
                        {idpTypes.map(({ key, label }) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                  ))}
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  {form.get('spEntityId').map(field => (
                    <FormGroup>
                      <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                        {t('in-settings:tabs.clientID')}
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

              <Row>
                <Col xs={12}>
                  {form.get('secret').map(secretField => (
                    <FormGroup>
                      <Label htmlFor="secret" hasError={!secretField.valid && secretField.touched}>
                        {t('in-settings:tabs.secret')}
                      </Label>
                      <Input
                        className={locals.input}
                        type="password"
                        id="secret"
                        value={secretField.value}
                        onChange={e => {
                          setForm(form.updateIn(['secret'], f => f.setValue(e.target.value).setTouched(true)));
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
                        {t('in-settings:tabs.thisAccountIsAutomaticallyAssignedAnAdminRole')}
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
              <h2>{t('in-settings:tabs.uploadIdPMetadata')}</h2>
              <p>{t('in-settings:tabs.youCanEitherUploadYourIdPMetadataViaFileOrUseADiscoveryUrlAndSecret')}</p>
              <div>
                <Button
                  kind="secondary"
                  icon="lib_views_file"
                  onClick={() => {
                    input.type = 'file';
                    input.accept = 'application/json';
                    input.click();
                  }}
                >
                  {file ? shorten(file.name, 32) : t('in-settings:tabs.chooseFile')}
                </Button>

                <p>{t('in-settings:tabs.alternativelyDefineADiscoveryUrlAndSecretHere')}</p>

                {form.get('discoveryUri').map(field => (
                  <FormGroup>
                    <Label htmlFor="url" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.discoveryURL')}
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
              </div>
            </Section>

            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.clientSetup')}</h2>
              <p className={locals.descriptionText}>{t('in-settings:tabs.clientSetupDescription')}</p>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <CopyableText
                    title={t('in-settings:tabs.redirectUrl')}
                    form={form}
                    fieldName="oidcSignInCallbackUrl"
                  />
                </Col>
                <Col xs={12}>
                  <CopyableText
                    title={t('in-settings:tabs.endSessionUrl')}
                    form={form}
                    fieldName="oidcSignOutCallbackUrl"
                  />
                </Col>
              </Row>

              <ul className={locals.list}>
                <li>
                  {t(
                    'in-settings:tabs.thereWillBeAnOptionToDownloadTheIdPMetadataStoreThatFileInAKnownLocationOnYourLocalMachine'
                  )}
                </li>
                <li>{t('in-settings:tabs.useUploadIdpMetaDataBelow')}</li>
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
  setMessage({ message: t('in-settings:tabs.deletingConfig'), type: neutral, isSaving: true });
  const setConfigResult$ = deleteConfig();
  setConfigResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.configSuccessfullyDeleted'), type: success });
    },
    error => setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: errorType })
  );
}

function saveItem({ setMessage, idpMetadata, spEntityId, ownerEmail, discoveryUri, secret, idpType }) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: neutral, isSaving: true });
  const setConfigResult$ = setConfig({ idpMetadata, spEntityId, ownerEmail, discoveryUri, secret, idpType });
  setConfigResult$.once(
    () => setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: success }),
    error => setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: errorType })
  );
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  const { oidcSignInCallbackUrl, oidcSignOutCallbackUrl, spEntityId, discoveryUri, activated, idpType } = config;
  const mappedIdpType = idpTypes.filter(({ key }) => key === idpType)[0] ?? defaultIdpType.key;

  setCanDeleteItem(!!activated);
  return form
    .put('oidcSignInCallbackUrl', createField({ value: oidcSignInCallbackUrl ?? '' }))
    .put('oidcSignOutCallbackUrl', createField({ value: oidcSignOutCallbackUrl ?? '' }))
    .put('spEntityId', createField({ value: spEntityId ?? '' }))
    .put('ownerEmail', createField({ value: '', validator: notBlankValidator }))
    .put('discoveryUri', createField({ value: discoveryUri ?? '' }))
    .put('activated', createField({ value: !!activated }))
    .put('idpType', createField({ value: mappedIdpType }))
    .put(
      'secret',
      createField({
        value: activated ? secretPlaceholder : '',
        validator: str => {
          if (!str || str.trim().length === 0 || str === secretPlaceholder) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.smartAlertFormNoEntitiesSelected')
              }
            ];
          }

          return null;
        }
      })
    );
}
