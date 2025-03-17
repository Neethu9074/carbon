/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import { t } from '@instana/i18n-react';

export interface SamlFormProps {
  form: SamlMapForm;
  setForm: React.Dispatch<React.SetStateAction<SamlMapForm>>;
}

type SamlMapFormItems = {
  nameIdFormat: Field<string>;
  ownerEmail: Field<string>;
  samlSignInCallbackUrl: Field<string>;
  samlSignOutCallbackUrl: Field<string>;
  spEntityId: Field<string>;
  activated: Field<boolean>;
  idpMetadataFile: Field<File>;
  isDeleteEnabled: Field<boolean>;
};

export type SamlMapForm = MapForm<SamlMapFormItems>;

export const idpSetupTypes = [
  {
    key: 'AUTOMATIC',
    label: t('in-settings:tabs.samlForm.setupTypeAutomatic')
  },
  {
    key: 'MANUAL',
    label: t('in-settings:tabs.samlForm.setupTypeManual')
  }
];
