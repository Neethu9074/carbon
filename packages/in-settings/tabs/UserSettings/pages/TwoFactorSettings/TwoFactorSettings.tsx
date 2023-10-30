/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm, createField } from 'formalistic';
import React, { FormEvent } from 'react';

import { Message } from '@instana/components';

import {
  getTwoFactorCredentials,
  toggleTwoFactor,
  verifyTwoFactorToken
} from 'in-settings/tabs/UserSettings/api/twoFactorAuth';
// @ts-expect-error TS migration
import ApiItemView from 'in-settings/components/ApiItemView';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title/Title';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './TwoFactorSettings.mless';

export interface TwoFactorSettingsProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  twoFactorCredentials: { verified: boolean; secret?: string; base64EncodedQrCode?: string; scratchCodes: [] };
}

interface MessageProps {
  message?: string;
  type?: string;
  isSaving?: boolean;
  text?: string;
}

export interface FormProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  setMessage: ({ message, type, isSaving }: MessageProps) => void;
  setCanSaveItem: (canSaveItem: boolean) => void;
  setCanDeleteItem: (canDeleteItem: boolean) => void;
  setSaveLabel: (savelabel: string) => void;
  result: { twoFactorCredentials: string };
}

export interface DeleteItemProps {
  form: MapForm<any>;
  setMessage: ({ message, type, isSaving }: MessageProps) => void;
}

export default function Settings() {
  return (
    <ApiItemView
      getObservables={() => ({
        // @ts-expect-error
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

function render(props: TwoFactorSettingsProps) {
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
    <Message withIcon type="neutral">
      {t('in-settings:tabs.twoFactorAuthenticationIsCurrentlyDisabledForThisUser')}
    </Message>
  );
}

function TwoFactorEnabled(props: TwoFactorSettingsProps) {
  return props.twoFactorCredentials.verified ? <TwoFactorVerified {...props} /> : <TwoFactorUnverified {...props} />;
}

function TwoFactorUnverified({ form, setForm, twoFactorCredentials }: TwoFactorSettingsProps) {
  const { secret, base64EncodedQrCode } = twoFactorCredentials;
  return (
    <>
      <p>
        {t('in-settings:tabs.scanTheQrCodeBelow')}
        <strong>{secret}</strong>
      </p>
      <canvas
        style={{
          background: `url('data:image/png;base64,${base64EncodedQrCode}')`,
          backgroundSize: 'cover'
        }}
        className={locals.qrCanvas}
      />
      <p>{t('in-settings:tabs.enterThe2FaTokenFromYourAuthenticatorAppToCompleteConfiguration')}</p>
      {form.get('2faToken').map((field: any) => (
        <>
          <Input
            className={locals.input}
            type="text"
            id="2faToken_input"
            value={field.value || ''}
            hasError={!field.valid && field.touched}
            onChange={e => {
              setForm(form.updateIn(['2faToken'], field => field.setValue(e.target.value).setTouched(true)));
            }}
            autoComplete="off"
          />
          <TouchedMessages field={field} />
        </>
      ))}
    </>
  );
}

function TwoFactorVerified({ twoFactorCredentials }: TwoFactorSettingsProps) {
  return (
    <>
      <Message withIcon type="success">
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

function onSubmit(e: FormEvent<HTMLFormElement>, { form, setForm, setMessage }: FormProps) {
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
    type: 'neutral',
    isSaving: true
  });

  const result$ = verifyTwoFactorToken(token);
  result$.once(
    () =>
      setMessage({
        text: t('in-settings:tabs.twoFactorTokenSuccessfullyVerified'),
        type: 'success'
      }),
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToSaveTwoFactorToken') + error.message,
        type: 'error'
      })
  );
}

function deleteItem(params: DeleteItemProps) {
  toggle2Fa(params);
}

function toggle2Fa({ form, setMessage }: DeleteItemProps) {
  const twoFactorEnabled = !!form.get('twoFactorCredentials').value;

  setMessage({
    message: twoFactorEnabled ? t('in-settings:tabs.disableTwoFactorAuth') : t('in-settings:tabs.enableTwoFactorAuth'),
    type: 'neutral',
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
        type: 'error'
      })
  );
}

function enrichForm(
  form: MapForm<any>,
  { setCanSaveItem, setCanDeleteItem, setSaveLabel, result: { twoFactorCredentials } }: FormProps
) {
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

function tokenValidator(token: any): any {
  if (isNaN(token) || token.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSpecifyAValidToken')
      }
    ];
  }
}
