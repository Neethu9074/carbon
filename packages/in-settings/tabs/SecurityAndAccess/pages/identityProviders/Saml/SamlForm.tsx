/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import {
  CarbonForm,
  CarbonStack,
  CarbonTextInput,
  Typography,
  CarbonRadioButtonGroup,
  CarbonRadioButton,
  Button,
  Code,
  FileUploader,
  CarbonFileUploaderItem
} from '@instana/components';

import {
  idpSetupTypes,
  SamlFormProps
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Saml/Saml.types';
import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';
import DeleteConfigurationView from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/DeleteConfigurationView';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { formatPathWithTU } from 'in-services/formatters/url';
import { t } from 'in-i18n';

import locals from './Saml.mless';

const SamlForm = (props: SamlFormProps) => {
  const { form, setForm } = props;

  const isActive = form.get('activated').value;
  const ownerEmailField = form.get('ownerEmail');
  const samlSignInCallbackUrl = form.get('samlSignInCallbackUrl');
  const samlSignOutCallbackUrl = form.get('samlSignOutCallbackUrl');
  const idpMetadataFile = form.get('idpMetadataFile');
  const spEntityId = form.get('spEntityId');

  const [idpSetupType, setIdpSetupType] = useState(
    samlSignOutCallbackUrl && samlSignInCallbackUrl ? idpSetupTypes[0] : idpSetupTypes[1]
  );

  const getReadOnlyForm = () => (
    <CarbonStack gap={6}>
      <Typography variant="body-01">
        {t('in-settings:tabs.authenticationProviders.idpIsActive', { idpConfig: 'SAML' })}
      </Typography>
      <SpEntityIdSection form={form} setForm={setForm} />
      <DeleteConfigurationView form={form} setForm={setForm} />
    </CarbonStack>
  );

  if (isActive) {
    return getReadOnlyForm();
  }

  return (
    <CarbonForm>
      <CarbonStack gap={7}>
        <CarbonStack gap={4}>
          <ConfigureIdPInfoMessage />
          <CarbonTextInput
            labelText={t('in-settings:tabs.authenticationProviders.emailToRecieveAdminstrationAccess')}
            helperText={t('in-settings:tabs.authenticationProviders.emailFromIdentityProviderMustBeEntered', {
              idpConfig: 'SAML'
            })}
            type="email"
            id="ownerEmail"
            value={ownerEmailField.value}
            onChange={e => setForm(form.updateIn(['ownerEmail'], f => f.setValue(e.target.value).setTouched(true)))}
            autoComplete="off"
            invalid={!ownerEmailField.valid && ownerEmailField.touched}
            invalidText={ownerEmailField.messages[0]?.message}
          />
          <SpEntityIdSection form={form} setForm={setForm} />
          <CarbonRadioButtonGroup
            legendText={t('in-settings:tabs.samlForm.setupType')}
            onChange={e => {
              setIdpSetupType(idpSetupTypes.filter(setupType => setupType.key === e)[0]);
            }}
            name="setupType-radio-menu"
            valueSelected={idpSetupType.key}
            readOnly={isActive}
          >
            {idpSetupTypes.map(({ key, label }) => (
              <CarbonRadioButton key={key} id={key} value={key} labelText={label} />
            ))}
          </CarbonRadioButtonGroup>
          <Typography variant="body-01">
            {t('in-settings:tabs.samlForm.setupDescription', { context: idpSetupType.key.toLocaleLowerCase() })}
          </Typography>
        </CarbonStack>
        <CarbonStack gap={4}>
          <Typography variant="heading-02">{t('in-settings:tabs.toYourIdentityProvider')}</Typography>
          {idpSetupType.key === idpSetupTypes[0].key ? (
            <Button
              kind="secondary"
              icon="lib_actions_download"
              href={`${formatPathWithTU('/api/settings/authentication/saml/metadata')}?spEntityId=${encodeURIComponent(
                spEntityId.value
              )}`}
            >
              {t('in-settings:tabs.configurationMetadata')}
            </Button>
          ) : (
            <>
              <Typography variant="body-01">{t('in-settings:tabs.samlForm.instanaMetadataValues')}</Typography>
              <Typography variant="label-01">{t('in-settings:tabs.acsUrl')}</Typography>
              <Code code={form.get('samlSignInCallbackUrl').map(field => field.value)} lang="bash" softWrap />
              <Typography variant="label-01">{t('in-settings:tabs.logoutUrl')}</Typography>
              <Code code={form.get('samlSignOutCallbackUrl').map(field => field.value)} lang="bash" softWrap />
              <Typography variant="label-01">{t('in-settings:tabs.audienceSpEntityId')}</Typography>
              <Code code={form.get('spEntityId').map(field => field.value)} lang="bash" softWrap />
              <Typography variant="label-01">{t('in-settings:tabs.nameIdFormat')}</Typography>
              <Code code={form.get('nameIdFormat').map(field => field.value)} lang="bash" softWrap />
            </>
          )}
        </CarbonStack>
        <CarbonStack gap={4}>
          <Typography variant="heading-02">{t('in-settings:tabs.fromYourIdentityProvider')}</Typography>
          <Typography variant="body-regular">
            {t('in-settings:tabs.samlForm.downloadIdentityProviderMetadata')}
          </Typography>
          <FileUploader
            accept={['text/xml']}
            buttonKind="secondary"
            buttonLabel={t('in-settings:tabs.samlForm.chooseFileUploadingInstana')}
            filenameStatus="edit"
            className={locals.samlForm_fileContainer}
            onChange={e => {
              setForm(form.updateIn(['idpMetadataFile'], f => f.setValue(e.target.files[0]).setTouched(true)));
            }}
            labelDescription={t('in-settings:tabs.samlForm.maxFileSize')}
          />
          {!idpMetadataFile.value.name && <TouchedMessages field={idpMetadataFile} />}
          {idpMetadataFile.value.name && (
            <CarbonFileUploaderItem
              errorBody={idpMetadataFile.messages?.[0]?.message}
              errorSubject={idpMetadataFile.messages?.[0]?.severity}
              invalid={!idpMetadataFile.valid}
              name={idpMetadataFile.value.name}
              className={locals.samlForm_selectedFile}
              status="edit"
              onDelete={() =>
                setForm(form.updateIn(['idpMetadataFile'], f => f.setValue(new File([], '')).setTouched(true)))
              }
            />
          )}
        </CarbonStack>
      </CarbonStack>
    </CarbonForm>
  );
};

export default SamlForm;

const SpEntityIdSection = ({ form, setForm }: SamlFormProps) => {
  const spEntityId = form.get('spEntityId');
  const isActive = form.get('activated').value;
  return (
    <CarbonTextInput
      labelText={t('in-settings:tabs.audienceSpEntityId')}
      helperText={t('in-settings:tabs.samlForm.instanaUsesTenantNameToConnectIdP')}
      id="spEntityId"
      value={spEntityId.value}
      onChange={e => {
        setForm(form.updateIn(['spEntityId'], f => f.setValue(e.target.value).setTouched(true)));
      }}
      invalid={!spEntityId.valid && spEntityId.touched}
      invalidText={spEntityId.messages[0]?.message}
      readOnly={isActive}
    />
  );
};
