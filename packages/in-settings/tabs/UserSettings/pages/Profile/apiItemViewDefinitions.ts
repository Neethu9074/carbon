/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { User } from 'in-settings/api/userProfile';

export interface RenderProps {
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  user: User | undefined;
  setCanSaveItem: (next: boolean) => void;
}

export interface MessageProps {
  readonly isSaving: boolean;
  readonly message: string;
  readonly type: string;
}
