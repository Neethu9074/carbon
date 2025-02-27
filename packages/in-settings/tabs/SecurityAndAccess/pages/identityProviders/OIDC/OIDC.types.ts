/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import { t } from 'in-i18n';

export const idpTypes = [
  {
    key: 'DEFAULT',
    label: t('in-settings:tabs.default')
  },
  {
    key: 'GOOGLE',
    label: 'Google'
  },
  {
    key: 'AZURE',
    label: 'Azure'
  },
  {
    key: 'KEYCLOAK',
    label: 'Keycloak'
  }
];

export const defaultIdpType = {
  key: 'DEFAULT',
  label: t('in-settings:tabs.default')
};

export const secretPlaceholder = 'HIDDEN';

export interface OIDCFormProps {
  form: OidcMapForm;
  setForm: React.Dispatch<React.SetStateAction<OidcMapForm>>;
}

type OidcMapFormItems = {
  oidcSignInCallbackUrl: Field<string>;
  oidcSignOutCallbackUrl: Field<string>;
  spEntityId: Field<string>;
  ownerEmail: Field<string>;
  discoveryUri: Field<string>;
  activated: Field<boolean>;
  idpType: Field<string>;
  secret: Field<string>;
  isDeleteEnabled: Field<boolean>;
};
export type OidcMapForm = MapForm<OidcMapFormItems>;
