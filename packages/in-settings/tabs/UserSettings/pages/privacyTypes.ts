/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import { ApiItemMessage } from 'in-settings/types';

export interface SaveItemProps {
  form: MapForm<any>;
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage>>;
}

export interface PrivacyProps {
  form: MapForm<any>;
  setForm: React.Dispatch<React.SetStateAction<MapForm<any>>>;
  setCanSaveItem: React.Dispatch<React.SetStateAction<boolean>>;
}
