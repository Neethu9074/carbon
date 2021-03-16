/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';
import React from 'react';

import {
  getTwoFactorCredentials,
  toggleTwoFactor,
  verifyTwoFactorToken
} from 'in-settings/tabs/AuthSettings/api/twoFactorAuth';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import Message from 'in-new-components/Message';
import Title from 'in-components/Title/Title';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './Settings.mless';

export default function Settings() {
  return (
    <ApiItemView
      getObservables={() => ({
        twoFactorCredentials: getTwoFactorCredentials()
      })}
      render={render}
      enrichForm={enrichForm}
      deleteLabel={t('in-settings:tabs.disableTwoFactor')}
      saveLabel={t('in-settings:tabs.saveToken')}
      deleteItem={deleteItem}
      onSubmit={onSubmit}
    />
  );
}

function render(props) {
  const { form, setForm } = props;

  const twoFactorCredentials = form.get('twoFactorCredentials').value;
  const twoFactorEnabled = !!twoFactorCredentials;

  return (
    <>
      <Title title={t('in-settings:tabs.twoFactorAuthentication')} />
      <SubViewHeader>{t('in-settings:tabs.twoFactorAuthentication')}</SubViewHeader>

      <Section restrictWidth="50rem">
        {twoFactorEnabled ? (
          <TwoFactorEnabled form={form} setForm={setForm} twoFactorCredentials={twoFactorCredentials} />
        ) : (
          <TwoFactorDisabled />
        )}
      </Section>
    </>
  );
}
function TwoFactorDisabled() {
  return (
    <Message withIcon type={neutral}>
      {t('in-settings:tabs.twoFactorAuthenticationIsCurrentlyDisabledForThisUser')}
    </Message>
  );
}

function TwoFactorEnabled(props) {
  return props.twoFactorCredentials.verified ? <TwoFactorVerified {...props} /> : <TwoFactorUnverified {...props} />;
}

function TwoFactorUnverified({ form, setForm, twoFactorCredentials }) {
  const { secret, base64EncodedQrCode } = twoFactorCredentials;

  return (
    <>
      <p>
        {t('in-settings:tabs.scanTheQrCodeBelow')}
        <strong>{secret}</strong>
      </p>
      <canvas
        style={{
          background: `url('data:image/png;base64,${base64EncodedQrCode}')`
        }}
        className={locals.qrCanvas}
      />
      <p>{t('in-settings:tabs.enterThe2FaTokenFromYourAuthenticatorAppToCompleteConfiguration')}</p>
      {form.get('2faToken').map(field => (
        <Input
          className={locals.input}
          type="number"
          id="2faToken_input"
          value={field.value || ''}
          onChange={e =>
            setForm(form.updateIn(['2faToken'], field => field.setValue(e.target.valueAsNumber).setTouched(true)))
          }
          autoComplete="off"
        />
      ))}
    </>
  );
}

function TwoFactorVerified({ twoFactorCredentials }) {
  return (
    <>
      <Message withIcon type={success}>
        {t('in-settings:tabs.twoFactorAuthenticationIsEnabledAndVerified')}
      </Message>
      <Section className={locals.scratchCodesSection}>
        <h2>{t('in-settings:tabs.scratchCodes')}</h2>
        <p>{t('in-settings:tabs.scratchCodesAreYourBackupInCaseYouEverLoseAccessToYourDevice')}</p>
        <ul className={locals.scratchCodes}>
          {twoFactorCredentials.scratchCodes.map(scratchCode => (
            <li className={locals.scratchCode} key={scratchCode}>
              {scratchCode}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function onSubmit(e, { form, setForm, setMessage }) {
  e.preventDefault();

  const twoFactorEnabled = !!form.get('twoFactorCredentials').value;
  if (!twoFactorEnabled) {
    return toggle2Fa({ form, setMessage });
  }

  if (!form.hierarchyValid) {
    return setForm(form.setTouched(true, { recurse: true }));
  }

  const token = form.get('2faToken').value;
  setMessage({
    message: t('in-settings:tabs.savingTwoFactorToken'),
    type: neutral,
    isSaving: true
  });

  const result$ = verifyTwoFactorToken(token);
  result$.once(
    () =>
      setMessage({
        text: t('in-settings:tabs.twoFactorTokenSuccessfullyVerified'),
        type: success
      }),
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToSaveTwoFactorToken') + error.message,
        type: errorType
      })
  );
}

function deleteItem(params) {
  toggle2Fa(params);
}

function toggle2Fa({ form, setMessage }) {
  const twoFactorEnabled = !!form.get('twoFactorCredentials').value;

  setMessage({
    message: twoFactorEnabled ? t('in-settings:tabs.disableTwoFactorAuth') : t('in-settings:tabs.enableTwoFactorAuth'),
    type: neutral,
    isSaving: true
  });
  const result$ = toggleTwoFactor();
  result$.once(
    () => {},
    error =>
      setMessage({
        text: twoFactorEnabled
          ? t('in-settings:tabs.failedToDisableTwoFactorAuth')
          : t('in-settings:tabs.failedToEnableTwoFactorAuth') + error.message,
        type: errorType
      })
  );
}

function enrichForm(form, { setCanSaveItem, setCanDeleteItem, setSaveLabel, result: { twoFactorCredentials } }) {
  if (!twoFactorCredentials) {
    setCanSaveItem(true);
    setSaveLabel(t('in-settings:tabs.enableTwoFactor'));
  } else {
    setCanDeleteItem(true);
  }

  return form
    .put(
      'twoFactorCredentials',
      createField({
        value: twoFactorCredentials
      })
    )
    .put(
      '2faToken',
      createField({
        value: NaN,
        validator: tokenValidator
      })
    );
}

function tokenValidator(token) {
  if (isNaN(token)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSpecifyAValidToken')
      }
    ];
  }
}
