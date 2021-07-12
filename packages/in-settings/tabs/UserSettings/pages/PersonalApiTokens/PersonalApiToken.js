/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React from 'react';

import {
  getPersonalApiTokenAsResultObservable,
  savePersonalApiToken
} from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { userSettingsPersonalApiTokens } from 'in-settings/navigation/paths';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ApiItemView from 'in-settings/components/ApiItemView';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import FormGroup from 'in-settings/components/FormGroup';
import Title from 'in-components/Title/Title';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './PersonalApiTokens.mless';

export default function PersonalApiToken({ match }) {
  const tokenId = match.params.id;

  return (
    <>
      <Title title={t('in-settings:tabs.personalApiToken')} />
      <ApiItemView
        parentViewName={t('in-settings:tabs.personalApiTokens')}
        parentPath={userSettingsPersonalApiTokens}
        getObservables={() => ({
          personalApiToken: getPersonalApiTokenAsResultObservable(tokenId)
        })}
        enrichForm={enrichForm}
        render={renderPersonalApiToken}
        tokenId={tokenId}
        saveItem={saveItem}
      />
    </>
  );
}

function renderPersonalApiToken({ form, setForm }) {
  const onChange = (fieldName, fieldValue) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
  };

  return (
    <div>
      {form.get('accessGrantingToken').map(field => (
        <FormGroup noFlex>
          <Label className={locals.grantingToken} id="personal-api-token-accessGrantingToken">
            {field.value.substring(0, 4) + '********************'}
          </Label>
          <CopyToClipboard getText={() => field.value}>
            {refSetter => (
              <span ref={refSetter}>
                <IconButton
                  onClick={e => {
                    stopPropagationAndPreventDefault(e);
                  }}
                  type="lib_actions_copy"
                />
              </span>
            )}
          </CopyToClipboard>
        </FormGroup>
      ))}

      {form.get('name').map(field => (
        <FormGroup>
          <Label htmlFor="personal-api-token-name" hasError={!field.valid && field.touched}>
            {t('in-settings:tabs.name')}
          </Label>
          <Input
            id="personal-api-token-name"
            value={field.value}
            onChange={e => onChange('name', e.target.value)}
            hasError={!field.valid && field.touched}
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
}

function saveItem({ form, setMessage }) {
  setMessage({ message: t('in-settings:tabs.savingConfig'), type: 'neutral', isSaving: true });
  const setConfigResult$ = savePersonalApiToken(form.toJS());
  setConfigResult$.once(
    () => setMessage({ text: t('in-settings:tabs.configSuccessfullySaved'), type: 'success' }),
    error =>
      setMessage({
        text: t('in-settings:tabs.failedToSaveConfig', { err: error.message }),
        type: 'error'
      })
  );
}

function enrichForm(form, { result: { personalApiToken } }) {
  return createForm(personalApiToken);
}

function createForm(personalApiToken) {
  return createMapForm()
    .put('tenantUnitId', createField({ value: personalApiToken.tenantUnitId }))
    .put('userId', createField({ value: personalApiToken.userId }))
    .put('tokenId', createField({ value: personalApiToken.tokenId }))
    .put('accessGrantingToken', createField({ value: personalApiToken.accessGrantingToken }))
    .put('name', createField({ value: personalApiToken.name, validator: notBlankValidator }));
}
