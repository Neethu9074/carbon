/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

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
    label: 'Keycloack'
  },
  {
    key: 'APPLE',
    label: 'Apple'
  }
];

export const defaultIdpType = {
  key: 'DEFAULT',
  label: t('in-settings:tabs.default')
};
