/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { getConfigAsResultObservable as getOidcConfigAsResultObservable } from 'in-settings/tabs/AuthSettings/api/oidc';
import { getConfigAsResultObservable, deleteConfig, refresh, setConfig } from 'in-settings/tabs/AuthSettings/api/saml';
import { isAnotherIdpActivated } from 'in-settings/tabs/AuthSettings/pages/indentityProviders/configuredIdPCheck';
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
import Link from 'in-components/Link';
import { t, Trans } from 'in-i18n';

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
        config: getConfigAsResultObservable(),
        oidcConfig: getOidcConfigAsResultObservable(),
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
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function(evt) {
          saveItem({
            result,
            idpMetadata: evt.target.result,
            setMessage,
            ownerEmail: form.get('ownerEmail').value,
            spEntityId: form.get('spEntityId').value
          });
        };
      }}
      Content={Content}
    />
  );
}

function Content({ file, form, setForm, input, setCanSaveItem, result }) {
  useEffect(() => setCanSaveItem(!!file), [file, setCanSaveItem]);

  return (
    <>
      <Title title={t('in-settings:tabs.configureSaml')} />
      <SubViewHeader>{t('in-settings:tabs.samlConfiguration')}</SubViewHeader>

      {isAnotherIdpActivated([result.ldapConfig?.base, result.oidcConfig?.activated]) ? (
        <h2>{t('in-settings:tabs.cannotConfigureSamlIfAnotherOneIsAlreadyActive')}</h2>
      ) : (
        <>
          <h2>{t('in-settings:tabs.activatingSamlEnablesInstanaToAuthenticateAUserAgainstYourIdentityProviderIdP')}</h2>
          <p>
            <Trans
              i18nKey="in-settings:tabs.samlHelpDoc"
              components={{
                activeDirectoryLink: <Link external href="https://instana.com/docs/admin/active-directory/" />,
                oktaLink: <Link external href="https://instana.com/docs/admin/okta/" />
              }}
            />
          </p>

          <form method="post" encType="multipart/form-data">
            <Section restrictWidth="50rem">
              <Row>
                <Col xs={12}>
                  {form.get('spEntityId').map(field => (
                    <FormGroup>
                      <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                        {t('in-settings:tabs.audienceSpEntityId')}
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
                        {t('in-settings:tabs.thisAccountIsAutomaticallyAssignedAnAdminRole')}
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
              <h2>{t('in-settings:tabs.automaticSetup')}</h2>
              {form.get('spEntityId').map(field => (
                <Button
                  kind="secondary"
                  icon="lib_actions_download"
                  href={`/api/settings/authentication/saml/metadata?spEntityId=${encodeURIComponent(field.value)}`}
                >
                  {t('in-settings:tabs.configurationMetadata')}
                </Button>
              ))}

              <ul className={locals.list}>
                <li>{t('in-settings:tabs.downloadTheConfigurationMetadataViaTheLinkAbove')}</li>
                <li>{t('in-settings:tabs.uploadTheInstanaMetadataFileToYourIdP')}</li>
                <li>{t('in-settings:tabs.downloadTheIdPMetadataIssuedFromYourIdP')}</li>
                <li>{t('in-settings:tabs.useUploadIdPMetadataBelowToDeliverTheFileToInstana')}</li>
              </ul>
            </Section>
            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.manualSetup')}</h2>
              <p className={locals.descriptionText}>
                {t('in-settings:tabs.theValuesRequiredToConnectToInstanaAreAsFollows')}
              </p>

              <Row className={indentityProvidersLocals.row}>
                <Col xs={12}>
                  <CopyableText title={t('in-settings:tabs.acsUrl')} form={form} fieldName="samlSignInCallbackUrl" />
                </Col>
                <Col xs={12}>
                  <CopyableText
                    title={t('in-settings:tabs.logoutUrl')}
                    form={form}
                    fieldName="samlSignOutCallbackUrl"
                  />
                </Col>
                <Col xs={12}>
                  <CopyableText title={t('in-settings:tabs.audienceSpEntityId')} form={form} fieldName="spEntityId" />
                </Col>
                <Col xs={12}>
                  <CopyableText title={t('in-settings:tabs.nameIdFormat')} form={form} fieldName="nameIdFormat" />
                </Col>
              </Row>

              <ul className={locals.list}>
                <li>
                  {t(
                    'in-settings:tabs.thereWillBeAnOptionToDownloadTheIdPMetadataStoreThatFileInAKnownLocationOnYourLocalMachine'
                  )}
                </li>
                <li>{t('in-settings:tabs.useUploadIdPMetadataBelowToDeliverTheFileToInstana')}</li>
              </ul>
            </Section>

            <Section restrictWidth="50rem">
              <h2>{t('in-settings:tabs.uploadIdPMetadata')}</h2>
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
                  {file ? shorten(file.name, 32) : t('in-settings:tabs.chooseFile')}
                </Button>
              </div>
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
      setMessage({
        text: t('in-settings:tabs.configSuccessfullyDeleted'),
        type: success
      });
    },
    error => setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: errorType })
  );
}

function saveItem({ setMessage, ownerEmail, idpMetadata, spEntityId }) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: neutral, isSaving: true });
  const setConfigResult$ = setConfig({ ownerEmail, idpMetadata, spEntityId });
  setConfigResult$.once(
    () => setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: success }),
    error => setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: errorType })
  );
}

function enrichForm(form, { setCanDeleteItem, result: { config } }) {
  setCanDeleteItem(!!config.activated);
  return form
    .put('samlSignInCallbackUrl', createField({ value: config.samlSignInCallbackUrl || '' }))
    .put('samlSignOutCallbackUrl', createField({ value: config.samlSignOutCallbackUrl || '' }))
    .put('spEntityId', createField({ value: config.spEntityId || '' }))
    .put('ownerEmail', createField({ value: '' }))
    .put('nameIdFormat', createField({ value: config.nameIdFormat || '' }));
}
