/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, Field, MapForm, MapFormItems } from 'formalistic';
import React, { useState, useEffect, useRef } from 'react';

import { LdapConfig, OidcApiResponseConfig, SamlApiConfig, SamlConfig } from '@instana/types';
import { Link, Button } from '@instana/components';

import {
  getConfigAsResultObservable,
  deleteConfig,
  refresh,
  setConfig
} from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable as getOidcConfigAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';
import { deleteItem, isAnyInvitationsPending } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/configuredIdPCheck';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
// @ts-expect-error needs TS migration
import ApiItemView from 'in-settings/components/ApiItemView';
import CopyableText from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/CopyableText';
import { SETTINGS_IDENTITY_PROVIDER_SAML_UPDATE } from 'in-services/tracking/eventNames';
import { ApiItemMessage, EnrichFormProps, SaveItemProps } from 'in-settings/types';
import { securityAndAccessIdentityProviders } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { Row, Col } from 'in-components/layout/Grid';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import { shorten } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import identityProvidersLocals from '../identityProviders.mless';
import locals from './Saml.mless';

type SamlMapFormItems = {
  nameIdFormat: Field<string>;
  ownerEmail: Field<string>;
  samlSignInCallbackUrl: Field<string>;
  samlSignOutCallbackUrl: Field<string>;
  spEntityId: Field<string>;
};
type SamlMapForm = MapForm<SamlMapFormItems>;

interface SaveItemCallbackProps {
  form: SamlMapForm;
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage>>;
}

interface SamlProps extends Pick<Parameters<typeof isAnyInvitationsPending>[0], 'invitations'> {}

export default function Saml({ invitations }: SamlProps) {
  const [file, setFile] = useState<File | undefined>();
  const { unstable_trackEvent } = useSegmentTracking();

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(undefined),
        oidcConfig: getOidcConfigAsResultObservable(undefined),
        ldapConfig: getLdapConfig(undefined)
      })}
      enrichForm={enrichForm}
      // ...props, setMessage, form, setForm, setCanSaveItem
      deleteItem={({ setMessage }: Pick<Parameters<typeof deleteItem>[0], 'setMessage'>) =>
        deleteItem({ setMessage, deleteConfig })
      }
      setFile={setFile}
      file={file}
      onCancelClick={() => {
        setFile(undefined);
        refresh();
      }}
      saveItem={({ setMessage, form }: SaveItemCallbackProps) => {
        if (file == null) {
          setMessage({
            text: t('in-settings:tabs.failedToSaveConfig', { err: t('in-settings:tabs.IdPMetadataRequired') }),
            type: 'error'
          });
          return;
        }
        if (isAnyInvitationsPending({ invitations })) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.confirmRemove')}
              description={
                <span>
                  <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
                </span>
              }
              onSubmit={() => {
                save(setMessage, form, file, unstable_trackEvent);
                close();
              }}
              confirmButtonKind="create"
              confirmButtonLabel={t('forms.actions.save')}
            />
          );
        } else {
          save(setMessage, form, file, unstable_trackEvent);
        }
      }}
      Content={Content}
      {...(idpConfigV2Enabled
        ? { parentViewName: t('in-settings:tabs.identityProviders'), parentPath: securityAndAccessIdentityProviders }
        : {})}
    />
  );
}

function save(
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage>>,
  form: SamlMapForm,
  file: File,
  unstable_trackEvent: ReturnType<typeof useSegmentTracking>['unstable_trackEvent']
) {
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = function (evt) {
    const targetResult = evt.target?.result?.toString() ?? '';
    if (targetResult.length > 2000000) {
      setMessage({
        text: t('in-settings:tabs.failedToSaveConfig', {
          err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
        }),
        type: 'error'
      });
      return;
    }
    saveItem({
      idpMetadata: targetResult,
      setMessage,
      ownerEmail: form.get('ownerEmail').value,
      spEntityId: form.get('spEntityId').value,
      unstable_trackEvent
    });
  };
}

interface ContentProps {
  file?: File;
  form: SamlMapForm;
  result: {
    ldapConfig?: LdapConfig;
    oidcConfig?: OidcApiResponseConfig;
  };
  setCanSaveItem: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setForm: React.Dispatch<React.SetStateAction<SamlMapForm>>;
}

function Content({ file, form, setForm, setFile, setCanSaveItem, result }: ContentProps) {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  useEffect(
    // allow only saving when idP metadata has been uploaded
    () => setCanSaveItem(!!file),
    [file, form, setCanSaveItem]
  );

  const onInputFileChange = () =>
    setFile(inputFileRef.current?.files?.length ? inputFileRef.current?.files[0] : undefined);

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
                // @ts-expect-error Link component expects children to be defined but children get passed down from Trans component
                activeDirectoryLink: <Link size="sm" external href="https://ibm.biz/configuring-active-directory" />,
                // @ts-expect-error Link component expects children to be defined but children get passed down from Trans component
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

              <Row className={identityProvidersLocals.row}>
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

              <Row className={identityProvidersLocals.row}>
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
                <Button kind="secondary" icon="lib_views_file" onClick={() => inputFileRef.current?.click()}>
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

function saveItem({
  setMessage,
  ownerEmail,
  idpMetadata,
  spEntityId,
  unstable_trackEvent
}: SamlApiConfig & SaveItemProps) {
  const samlConfig: SamlApiConfig = { ownerEmail, idpMetadata, spEntityId };
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(samlConfig);
  setConfigResult$.once(
    () => {
      addMessage({
        title: t('in-settings:tabs.changesSaved'),
        content: t('in-settings:tabs.configSuccessfullySaved'),
        type: 'success',
        timeout: 4000
      });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_SAML_UPDATE });
    },
    error => {
      setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: 'error' });
    }
  );
}

function enrichForm<FORM_ITEMS extends MapFormItems>(
  form: MapForm<FORM_ITEMS>,
  { setCanDeleteItem, result: { config } }: EnrichFormProps<SamlConfig>
): SamlMapForm {
  setCanDeleteItem(!!config.activated);
  return form
    .put('samlSignInCallbackUrl', createField({ value: config.samlSignInCallbackUrl || '' }))
    .put('samlSignOutCallbackUrl', createField({ value: config.samlSignOutCallbackUrl || '' }))
    .put('spEntityId', createField({ value: config.spEntityId || '' }))
    .put('ownerEmail', createField({ value: '' }))
    .put('nameIdFormat', createField({ value: config.nameIdFormat || '' })) as unknown as SamlMapForm;
}
