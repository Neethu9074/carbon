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

import locals from './Settings.mless';

export default function Settings() {
  return (
    <ApiItemView
      getObservables={() => ({
        twoFactorCredentials: getTwoFactorCredentials()
      })}
      render={render}
      enrichForm={enrichForm}
      deleteLabel="Disable two-factor"
      saveLabel="Save token"
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
      <Title title="Two-Factor Authentication" />
      <SubViewHeader>Two-Factor Authentication</SubViewHeader>

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
      Two-factor authentication is currently disabled for this user.
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
        Scan the QR code below with your Two-Factor authenticator to enable your account. If you cannot scan the code,
        you can also setup the account by entering the following key manually: <strong>{secret}</strong>
      </p>
      <canvas
        style={{
          background: `url('data:image/png;base64,${base64EncodedQrCode}')`
        }}
        className={locals.qrCanvas}
      />
      <p>Enter the 2FA token from your authenticator app to complete configuration:</p>
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
        Two-factor authentication is enabled and verified.
      </Message>
      <Section className={locals.scratchCodesSection}>
        <h2>Scratch codes</h2>
        <p>
          Scratch codes are your backup in case you ever lose access to your device. A scratch code can only be used
          once, so please take care when using them. Should you have exhausted all your scratch codes, you can only get
          new ones by disabling and re-enabling two-factor authorization for your account.
        </p>
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
    message: 'Saving two-factor token.',
    type: neutral,
    isSaving: true
  });

  const result$ = verifyTwoFactorToken(token);
  result$.once(
    () => setMessage({ text: 'Two-factor token successfully verified.', type: success }),
    error => setMessage({ text: 'Failed to save two-factor token: ' + error.message, type: errorType })
  );
}

function deleteItem(params) {
  toggle2Fa(params);
}

function toggle2Fa({ form, setMessage }) {
  const twoFactorEnabled = !!form.get('twoFactorCredentials').value;

  setMessage({
    message: (twoFactorEnabled ? 'Disable' : 'Enable') + ' two factor auth',
    type: neutral,
    isSaving: true
  });
  const result$ = toggleTwoFactor();
  result$.once(
    () => {},
    error =>
      setMessage({
        text: 'Failed to ' + (twoFactorEnabled ? 'disable' : 'enable') + ' two factor auth: ' + error.message,
        type: errorType
      })
  );
}

function enrichForm(form, { setCanSaveItem, setCanDeleteItem, setSaveLabel, result: { twoFactorCredentials } }) {
  if (!twoFactorCredentials) {
    setCanSaveItem(true);
    setSaveLabel('Enable two-factor');
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
        message: 'Please specify a valid token.'
      }
    ];
  }
}
