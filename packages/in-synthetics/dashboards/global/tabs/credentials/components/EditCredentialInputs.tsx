/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { ChangeEvent } from 'react';

import { CarbonPasswordInput as PasswordInput, Stack, CarbonTextInput as TextInput } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialListActionsColumn.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
const EditCredentialInputs = ({ form, updateForm }: Props) => {
  const credentialName = form.get('credentialName') as Field<string>;
  const credentialValue = form.get('credentialValue') as Field<string>;
  return (
    <div className={locals.stepOneWrapper}>
      <Stack gap="large">
        <TextInput
          id={generateUniqueShortId()}
          type="text"
          value={credentialName.value}
          placeholder={t('in-synthetics:dialog.createCredential.steps.textInput.placeholder')}
          labelText={t('in-synthetics:dialog.createCredential.steps.textInput.labelText')}
          helperText={t('in-synthetics:dialog.createCredential.edit.textInputHelperText')}
          readOnly
        />
        <PasswordInput
          id={generateUniqueShortId()}
          type="text"
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
          helperText={t('in-synthetics:dialog.createCredential.edit.passwordInputHelperText')}
          hidePasswordLabel={t('in-synthetics:dialog.createCredential.tooltipLabels.hide')}
          showPasswordLabel={t('in-synthetics:dialog.createCredential.tooltipLabels.show')}
        />
      </Stack>
    </div>
  );
};

export default EditCredentialInputs;
