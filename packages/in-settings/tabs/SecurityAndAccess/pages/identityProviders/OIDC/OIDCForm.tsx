/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonForm,
  CarbonStack,
  CarbonTextInput,
  Typography,
  CarbonRadioButtonGroup,
  CarbonRadioButton,
  Code,
  CarbonPasswordInput
} from '@instana/components';

import ConfigureIdPInfoMessage from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/ConfigureIdPInfoMessage';
import DeleteConfigurationView from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/DeleteConfigurationView';
import { idpTypes, OIDCFormProps } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDC.types';
import { t } from 'in-i18n';

const OIDCForm = (props: OIDCFormProps) => {
  const { form, setForm } = props;
  const isActive = form.get('activated').value;
  const ownerEmailField = form.get('ownerEmail');
  const secretField = form.get('secret');
  const isDeleteEnabled = form.get('isDeleteEnabled').value;
  const idpType = form.get('idpType');
  const clientId = form.get('spEntityId');
  const discoveryUri = form.get('discoveryUri');

  const onChangeDeleteEnabled = (isDeleteEnabled: boolean) => {
    setForm(form.updateIn(['isDeleteEnabled'], f => f.setValue(isDeleteEnabled).setTouched(true)));
  };

  const getSpecificConfigurationField = () => (
    <CarbonRadioButtonGroup
      legendText={
        isActive
          ? t('in-settings:tabs.oidcForm.configurationSelected')
          : t('in-settings:tabs.oidcForm.selectIfSpecificConfigurationRequired')
      }
      onChange={e => {
        setForm(form.updateIn(['idpType'], f => f.setValue(e as string).setTouched(true)));
      }}
      name="configuration-radio-menu"
      valueSelected={idpType.value}
      readOnly={isActive}
    >
      {idpTypes.map(({ key, label }) => (
        <CarbonRadioButton key={key} id={key} value={key} labelText={label} />
      ))}
    </CarbonRadioButtonGroup>
  );

  const getDiscoveryUriField = () => (
    <CarbonTextInput
      labelText={t('in-settings:tabs.discoveryURL')}
      id="discoveryUri"
      value={discoveryUri.value}
      onChange={e => {
        setForm(form.updateIn(['discoveryUri'], f => f.setValue(e.target.value).setTouched(true)));
      }}
      invalid={!discoveryUri.valid && discoveryUri.touched}
      readOnly={isActive}
    />
  );

  const getClientIdField = () => (
    <CarbonTextInput
      labelText={t('in-settings:tabs.oidcForm.clientId')}
      helperText={t('in-settings:tabs.oidcForm.identifierAssignedToOIDCApplication')}
      id="spEntityId"
      value={clientId.value}
      onChange={e => {
        setForm(form.updateIn(['spEntityId'], f => f.setValue(e.target.value).setTouched(true)));
      }}
      readOnly={isActive}
      invalid={!clientId.valid && clientId.touched}
      invalidText={clientId.messages[0]?.message}
    />
  );

  const getReadOnlyForm = () => (
    <CarbonStack gap={6}>
      <Typography variant="body-01">{t('in-settings:tabs.oidcForm.OIDCIsActive')}</Typography>
      <CarbonStack gap={4}>
        {getSpecificConfigurationField()}
        {getClientIdField()}
        {getDiscoveryUriField()}
      </CarbonStack>
      {DeleteConfigurationView({ isDeleteEnabled: isDeleteEnabled, setIsDeleteEnabled: onChangeDeleteEnabled })}
    </CarbonStack>
  );

  if (isActive) {
    return getReadOnlyForm();
  }

  return (
    <CarbonForm>
      <CarbonStack gap={6}>
        <CarbonStack gap={4}>
          <ConfigureIdPInfoMessage />
          <CarbonTextInput
            labelText={t('in-settings:tabs.authenticationProviders.emailToRecieveAdminstrationAccess')}
            helperText={t('in-settings:tabs.authenticationProviders.emailFromIdentityProviderMustBeEntered', {
              idpConfig: 'OIDC'
            })}
            type="email"
            id="ownerEmail"
            value={ownerEmailField.value}
            onChange={e => setForm(form.updateIn(['ownerEmail'], f => f.setValue(e.target.value).setTouched(true)))}
            autoComplete="off"
            invalid={!ownerEmailField.valid && ownerEmailField.touched}
          />
          <Typography variant="body-01">
            {t('in-settings:tabs.oidcForm.connectionIsSetupConsideringNecessarySpecifications')}
          </Typography>
          {getSpecificConfigurationField()}
        </CarbonStack>
        <CarbonStack gap={4}>
          <Typography variant="heading-02">{t('in-settings:tabs.toYourIdentityProvider')}</Typography>
          <Typography variant="body-01">
            {t('in-settings:tabs.oidcForm.createOIDCClientOnYourIdentityProvider')}
          </Typography>
          {getClientIdField()}
          <Typography variant="label-01">{t('in-settings:tabs.redirectUrl')}</Typography>
          <Code code={form.get('oidcSignInCallbackUrl').map(field => field.value)} lang="bash" softWrap />
          <Typography variant="label-01">{t('in-settings:tabs.endSessionUrl')}</Typography>
          <Code code={form.get('oidcSignOutCallbackUrl').map(field => field.value)} lang="bash" softWrap />
        </CarbonStack>
        <CarbonStack gap={4}>
          <Typography variant="heading-02">{t('in-settings:tabs.fromYourIdentityProvider')}</Typography>
          <Typography variant="body-01">{t('in-settings:tabs.oidcForm.useDiscoveryURLOfOIDCConfiguration')}</Typography>
          {getDiscoveryUriField()}
          <CarbonPasswordInput
            labelText={t('in-settings:tabs.secret')}
            helperText={t('in-settings:tabs.oidcForm.tokenToVerifyAuthenticity')}
            id="secret"
            value={secretField.value}
            onChange={e => {
              setForm(form.updateIn(['secret'], f => f.setValue(e.target.value).setTouched(true)));
            }}
            invalid={!secretField.valid && secretField.touched}
          />
        </CarbonStack>
      </CarbonStack>
    </CarbonForm>
  );
};

export default OIDCForm;
