/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, Field, MapForm, MapFormItems } from 'formalistic';
import React, { useState, useEffect } from 'react';

import { LdapConfig, OidcApiRequestConfig, OidcApiResponseConfig, SamlConfig } from '@instana/types';
import { Select, Button } from '@instana/components';

import {
  getConfigAsResultObservable,
  deleteConfig,
  refresh,
  setConfig
} from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';
import { deleteItem, isAnyInvitationsPending } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/configuredIdPCheck';
import { defaultIdpType, idpTypes } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/idpTypes';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
// @ts-expect-error needs TS migration
import ApiItemView from 'in-settings/components/ApiItemView';
import CopyableText from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/CopyableText';
import { SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE } from 'in-services/tracking/eventNames';
import { ApiItemMessage, EnrichFormProps, SaveItemProps } from 'in-settings/types';
import { securityAndAccessIdentityProviders } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { notBlankValidator } from 'in-services/validators/string';
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
import locals from './OIDC.mless';

const secretPlaceholder = 'HIDDEN';

type OidcMapFormItems = {
  oidcSignInCallbackUrl: Field<string>;
  oidcSignOutCallbackUrl: Field<string>;
  spEntityId: Field<string>;
  ownerEmail: Field<string>;
  discoveryUri: Field<string>;
  activated: Field<string>;
  idpType: Field<string>;
  secret: Field<string>;
};
type OidcMapForm = MapForm<OidcMapFormItems>;

interface OidcProps extends Pick<Parameters<typeof isAnyInvitationsPending>[0], 'invitations'> {}

export default function OIDC(props: OidcProps) {
  const { unstable_trackEvent } = useSegmentTracking();
  const inputDOMNode = document.createElement('input');
  const [input] = useState<HTMLInputElement>(inputDOMNode);
  const [file, setFile] = useState<File | undefined>();
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  return (
    <ApiItemView
      getObservables={() => ({
        config: getConfigAsResultObservable(undefined),
        samlConfig: getSamlConfig(undefined),
        ldapConfig: getLdapConfig(undefined)
      })}
      enrichForm={enrichForm}
      deleteItem={({ setMessage }: Pick<Parameters<typeof deleteItem>[0], 'setMessage'>) =>
        deleteItem({ setMessage, deleteConfig: deleteConfig })
      }
      input={input}
      file={file}
      onCancelClick={() => {
        setFile(undefined);
        refresh();
      }}
      saveItem={(data: Omit<SaveProps, 'file' | 'unstable_trackEvent'>) => {
        if (isAnyInvitationsPending(props)) {
          addActiveDialog(
            <ConfirmationDialog
              header={t('in-settings:components.confirmRemove')}
              description={
                <span>
                  <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
                </span>
              }
              onSubmit={() => {
                save({ ...data, file, unstable_trackEvent });
                close();
              }}
              confirmButtonKind="create"
              confirmButtonLabel={t('forms.actions.save')}
            />
          );
        } else {
          save({ ...data, file: file, unstable_trackEvent });
        }
      }}
      Content={Content}
      {...(idpConfigV2Enabled
        ? { parentViewName: t('in-settings:tabs.identityProviders'), parentPath: securityAndAccessIdentityProviders }
        : {})}
    />
  );
}

interface SaveProps {
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage>>;
  form: OidcMapForm;
  file?: File;
  unstable_trackEvent: ReturnType<typeof useSegmentTracking>['unstable_trackEvent'];
}

function save({ setMessage, form, file, unstable_trackEvent }: SaveProps) {
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (evt) {
      const eventTarget = evt.target?.result?.toString() ?? '';
      if (eventTarget.length > 2000000) {
        setMessage({
          text: t('in-settings:tabs.failedToSaveConfig', {
            err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
          }),
          type: 'error'
        });
        return;
      }
      saveItem({
        setMessage,
        idpMetadata: eventTarget,
        spEntityId: form.get('spEntityId').value,
        ownerEmail: form.get('ownerEmail').value,
        discoveryUri: form.get('discoveryUri').value,
        secret: form.get('secret').value,
        idpType: form.get('idpType').value,
        unstable_trackEvent
      });
    };
  } else {
    saveItem({
      setMessage,
      idpMetadata: '',
      spEntityId: form.get('spEntityId').value,
      ownerEmail: form.get('ownerEmail').value,
      discoveryUri: form.get('discoveryUri').value,
      secret: form.get('secret').value,
      idpType: form.get('idpType').value,
      unstable_trackEvent
    });
  }
}

interface ContentProps {
  file?: File;
  form: OidcMapForm;
  result: {
    config: OidcApiResponseConfig;
    ldapConfig?: LdapConfig;
    samlConfig?: SamlConfig;
  };
  input: HTMLInputElement;
  setCanSaveItem: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<OidcMapForm>>;
}

function Content({ file, form, setForm, input, setCanSaveItem, result }: ContentProps) {
  useEffect(
    // allow only saving when secret field is set and either idP metadata has been uploaded or discovery url has been set
    () =>
      setCanSaveItem(
        Boolean(form.get('secret').value) &&
          (!!file || Boolean(form.get('discoveryUri').value)) &&
          !result.config.activated
      ),
    [file, form, setCanSaveItem, result]
  );

  const editable = (
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
                    value={field.value}
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

          <Row className={identityProvidersLocals.row}>
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

          <Row className={identityProvidersLocals.row}>
            <Col xs={12}>
              <CopyableText title={t('in-settings:tabs.redirectUrl')} form={form} fieldName="oidcSignInCallbackUrl" />
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
  );

  const readOnly = (
    <>
      <h2>{t('in-settings:tabs.oidcActive')}</h2>
      <>
        <Section restrictWidth="50rem">
          <Row>
            <Col xs={12}>
              {form.get('idpType').map(field => (
                <FormGroup>
                  <Label htmlFor="spEntityId" hasError={!field.valid && field.touched}>
                    {t('in-settings:tabs.identityProviderType')}
                  </Label>
                  <Input className={locals.input} type="text" id="idpType" value={field.value} disabled />
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

                  <Input className={locals.input} type="text" id="spEntityId" value={field.value} disabled />
                </FormGroup>
              ))}
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              {form.get('discoveryUri').map(field => (
                <FormGroup>
                  <Label htmlFor="url" hasError={!field.valid && field.touched}>
                    {t('in-settings:tabs.discoveryURL')}
                  </Label>

                  <Input className={locals.input} type="text" id="discoveryUri" value={field.value} disabled />
                </FormGroup>
              ))}
            </Col>
          </Row>
        </Section>
      </>
    </>
  );

  const cantBeActivated = <h2>{t('in-settings:tabs.cannotConfigureOidcIfAnotherOneIsAlreadyActive')}</h2>;

  const renderIdPContent = () => {
    if (isAnotherIdpActivated([result.ldapConfig?.base, result.samlConfig?.activated])) {
      // Another IdP is already activated => show message that IdP cannot be configured
      return cantBeActivated;
    } else {
      return result?.config.activated ? readOnly : editable;
    }
  };

  return (
    <>
      <Title title={t('in-settings:tabs.configureOpenIDConnect')} />
      <SubViewHeader>{t('in-settings:tabs.oidcConfiguration')}</SubViewHeader>
      <ConfigureIdPInfoMessage />
      {renderIdPContent()}
    </>
  );
}

function saveItem({
  setMessage,
  idpMetadata,
  spEntityId,
  ownerEmail,
  discoveryUri,
  secret,
  idpType,
  unstable_trackEvent
}: OidcApiRequestConfig & SaveItemProps) {
  const oidcConfig = { idpMetadata, spEntityId, ownerEmail, discoveryUri, secret, idpType };
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = setConfig(oidcConfig);
  setConfigResult$.once(
    () => {
      addMessage({
        title: t('in-settings:tabs.changesSaved'),
        content: t('in-settings:tabs.configSuccessfullySaved'),
        type: 'success',
        timeout: 4000
      });
      unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE });
    },
    error => setMessage({ text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }), type: 'error' })
  );
}

function enrichForm<FORM_ITEMS extends MapFormItems>(
  form: MapForm<FORM_ITEMS>,
  { setCanDeleteItem, result: { config } }: EnrichFormProps<OidcApiResponseConfig>
): OidcMapForm {
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
    .put('idpType', createField({ value: mappedIdpType.key }))
    .put(
      'secret',
      createField({
        value: activated ? secretPlaceholder : '',
        validator: str => {
          if (!str || str.trim().length === 0 || str === secretPlaceholder) {
            return [
              {
                severity: 'error'
              }
            ];
          }

          return null;
        }
      })
    ) as unknown as OidcMapForm;
}
