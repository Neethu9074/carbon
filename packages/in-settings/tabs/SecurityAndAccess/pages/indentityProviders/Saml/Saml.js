/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState, useEffect, useRef } from 'react';
import { createField } from 'formalistic';

import { Link, Button } from '@instana/components';

import {
  getConfigAsResultObservable,
  deleteConfig,
  refresh,
  setConfig
} from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable as getOidcConfigAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/ConfigureIdPInfoMessage';
import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { disableInvitesWithIdpEnabled, carbonButtonEnabled } from 'in-services/featureFlags';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { Row, Col } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { shorten } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import indentityProvidersLocals from '../indentityProviders.mless';
import locals from './Saml.mless';

export default function Saml(props) {
  const [file, setFile] = useState(null);
  const { unstable_trackEvent } = useSegmentTracking();

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(),
        oidcConfig: getOidcConfigAsResultObservable(),
        ldapConfig: getLdapConfig()
      })}
      enrichForm={enrichForm}
      deleteItem={deleteItem}
      setFile={setFile}
      file={file}
      onCancelClick={() => {
        setFile(null);
        refresh();
      }}
      saveItem={({ setMessage, form, result }) => {
        if (file == null) {
          setMessage({
            text: t('in-settings:tabs.failedToSaveConfig', { err: t('in-settings:tabs.IdPMetadataRequired') }),
            type: 'error'
          });
          return;
        }
        if (isAnyInvitationsPending(props)) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.pleaseConfirm')}
              description={
                <span>
                  <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
                </span>
              }
              onSubmit={() => {
                save(setMessage, form, result, file, unstable_trackEvent);
                close();
              }}
              confirmButtonKind="create"
              confirmButtonLabel={t('forms.actions.save')}
            />
          );
        } else {
          save(setMessage, form, result, file, unstable_trackEvent);
        }
      }}
      Content={Content}
    />
  );
}

function isAnyInvitationsPending(props) {
  return disableInvitesWithIdpEnabled && props.invitations?.data?.length > 0;
}

function save(setMessage, form, result, file, unstable_trackEvent) {
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = function (evt) {
    if (evt.target.result.length > 2000000) {
      setMessage({
        text: t('in-settings:tabs.failedToSaveConfig', {
          err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
        }),
        type: 'error'
      });
      return;
    }
    saveItem({
      result,
      idpMetadata: evt.target.result,
      setMessage,
      ownerEmail: form.get('ownerEmail').value,
      spEntityId: form.get('spEntityId').value,
      unstable_trackEvent
    });
  };
}

function Content({ file, form, setForm, setFile, setCanSaveItem, result }) {
  const inputFileRef = useRef(null);
  useEffect(
    // allow only saving when idP metadata has been uploaded
    () => setCanSaveItem(!!file),
    [file, form, setCanSaveItem]
  );

  const onInputFileChange = () =>
    setFile((inputFileRef.current?.files?.length ?? 0) > 0 ? inputFileRef.current.files[0] : undefined);

  return (
    <>
      <Title title={t('in-settings:tabs.configureSaml')} />
      <SubViewHeader>{t('in-settings:tabs.samlConfiguration')}</SubViewHeader>
      <ConfigureIdPInfoMessage />

      {isAnotherIdpActivated([result.ldapConfig?.base, result.oidcConfig?.activated]) ? (
        <h2>{t('in-settings:tabs.cannotConfigureSamlIfAnotherOneIsAlreadyActive')}</h2>
      ) : (
        <>
          <h2>{t('in-settings:tabs.activatingSamlEnablesInstanaToAuthenticateAUserAgainstYourIdentityProviderIdP')}</h2>
          <p>
            <Trans
              i18nKey="in-settings:tabs.samlHelpDoc"
              components={{
                activeDirectoryLink: <Link size="sm" external href="https://ibm.biz/configuring-active-directory" />,
                oktaLink: <Link size="sm" external href="https://ibm.biz/integrating-okta" />
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
                <input
                  id="idpMetadataFile"
                  type="file"
                  accept="text/xml"
                  multiple={false}
                  ref={r => (inputFileRef.current = r)}
                  onChange={onInputFileChange}
                  hidden
                />
                <Button kind="secondary" icon="lib_views_file" onClick={() => inputFileRef.current.click()}>
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
        <CopyToClipboardButton size={carbonButtonEnabled ? 'compact' : 'normal'} getText={() => field.value} />
      </div>
    </FormGroup>
  ));
}

function deleteItem({ setMessage }) {
  setMessage({ message: t('in-settings:tabs.deletingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = deleteConfig();
  setConfigResult$.once(
    () => {
      setMessage({
        text: t('in-settings:tabs.configSuccessfullyDeleted'),
        type: 'success'
      });
    },
    error => setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: 'error' })
  );
}

function saveItem({ setMessage, ownerEmail, idpMetadata, spEntityId, unstable_trackEvent }) {
  const samlConfig = { ownerEmail, idpMetadata, spEntityId };
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(samlConfig);
  setConfigResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: 'success' });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: 'settings.identityProvider.saml' });
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: 'error' });
    }
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
