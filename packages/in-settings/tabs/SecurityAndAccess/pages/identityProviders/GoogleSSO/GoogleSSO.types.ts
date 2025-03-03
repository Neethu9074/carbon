/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

type GoogleSsoMapFormItems = { filter: Field<string | undefined> };

export type GoogleSsoMapForm = MapForm<GoogleSsoMapFormItems>;

export interface GoogleSsoFormProps {
  form: GoogleSsoMapForm;
  setForm: React.Dispatch<React.SetStateAction<GoogleSsoMapForm>>;
}
