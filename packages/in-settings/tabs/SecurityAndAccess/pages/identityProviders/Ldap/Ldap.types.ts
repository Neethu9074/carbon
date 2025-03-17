/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

export const LDAP_MODE = Object.freeze({
  EDIT: 'edit',
  DELETE: 'delete'
} as const);

export type LdapFormModes = typeof LDAP_MODE;
export type LdapFormMode = LdapFormModes[keyof LdapFormModes];

export interface LdapFormProps {
  form: LdapMapForm;
  setForm: React.Dispatch<React.SetStateAction<LdapMapForm>>;
}

export type LdapMapFormItems = {
  acceptAnyCA: Field<boolean>;
  base: Field<string>;
  emailField: Field<string>;
  groupMemberField: Field<string>;
  groupMemberFieldConfigured: Field<boolean>;
  groupQuery: Field<string>;
  testPassword: Field<string>;
  testUser: Field<string>;
  url: Field<string>;
  userDnMapping: Field<string>;
  userField: Field<string>;
  userQueryTemplate: Field<string>;
  isDeleteEnabled: Field<boolean>;
  roForm: ReadOnlyAuthForm;
  mode: Field<LdapFormMode>;
};

export type ReadOnlyAuthFormItems = {
  emptyPass: Field<boolean>;
  roPassword: Field<string>;
  roUser: Field<string>;
};

export type LdapMapForm = MapForm<LdapMapFormItems>;
export type ReadOnlyAuthForm = MapForm<ReadOnlyAuthFormItems>;
