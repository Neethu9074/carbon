/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { addFormForExpiryTimeStamp } from 'in-settings/components/ApiTokenExpiration/utils';
import { PersonalApiToken } from 'in-settings/tabs/UserSettings/api/personalApiToken';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import { notBlankValidator } from 'in-services/validators/string';

export const createPersonalApiTokenForm = (apiToken?: PersonalApiToken) => {
  let form = createMapForm()
    .put('accessGrantingToken', createField({ value: apiToken ? apiToken.accessGrantingToken : '' }))
    .put(
      'name',
      createField({
        value: apiToken ? apiToken.name : '',
        validator: notBlankValidator
      })
    );
  if (apiTokenExpirationEnabled) {
    const expiryOption = apiToken?.expiresOn ? 'Custom' : 'Never';

    form = form
      .put(
        'expiryOption',
        createField({
          value: expiryOption
        })
      )
      .put(
        'expiresOn',
        createField({
          value: apiToken?.expiresOn ? apiToken.expiresOn : ''
        })
      ) as MapForm<any>;
    if (expiryOption === 'Custom') {
      form = addFormForExpiryTimeStamp(form, apiToken?.expiresOn as number);
    }
  }
  return form;
};
