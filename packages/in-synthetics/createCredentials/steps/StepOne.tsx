/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { ChangeEvent } from 'react';

import { PasswordInput, Stack, TextInput } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { t } from 'in-i18n';

import locals from 'in-synthetics/createCredentials/CreateCredentials.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const StepOne = ({ form, updateForm }: Props) => {
  const credentialName = form.get('credentialName') as Field<string>;
  const credentialValue = form.get('credentialValue') as Field<string>;

  return (
    <div className={locals.stepOneWrapper}>
      <Stack gap="large">
        <TextInput
          id={generateUniqueShortId()}
          type="text"
          value={credentialName.value}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            updateForm(
              form.updateIn(['credentialName'], (field: Item) =>
                (field as Field<any>).setValue(target.value).setTouched(true)
              )
            );
          }}
          placeholder={t('in-synthetics:dialog.createCredential.steps.textInput.placeholder')}
          labelText={t('in-synthetics:dialog.createCredential.steps.textInput.labelText')}
          invalid={!credentialName.valid && credentialName.touched}
          invalidText={t('in-synthetics:dialog.createCredential.steps.textInput.invalidText')}
        />
        <PasswordInput
          id={generateUniqueShortId()}
          type="password"
          value={credentialValue.value}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            updateForm(
              form.updateIn(['credentialValue'], (field: Item) =>
                (field as Field<any>).setValue(target.value).setTouched(true)
              )
            );
          }}
          placeholder={t('in-synthetics:dialog.createCredential.steps.passwordInput.placeholder')}
          labelText={t('in-synthetics:dialog.createCredential.steps.passwordInput.labelText')}
          invalid={!credentialValue.valid && credentialValue.touched}
          invalidText={t('in-synthetics:dialog.createCredential.steps.passwordInput.invalidText')}
          hidePasswordLabel={t('in-synthetics:dialog.createCredential.tooltipLabels.hide')}
          showPasswordLabel={t('in-synthetics:dialog.createCredential.tooltipLabels.show')}
        />
      </Stack>
    </div>
  );
};

export default StepOne;
