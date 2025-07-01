/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { localisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/localisationStrings';
import { LoadingStatus } from 'in-settings/types';

type RetentionStatusProps = {
  isChangingRetention: boolean;
  hasRetentionChangeSucceeded: boolean;
};

export function getRetentionStatus({ isChangingRetention, hasRetentionChangeSucceeded }: RetentionStatusProps): {
  loadingStatus: LoadingStatus;
  loadingDescription: string;
} {
  if (isChangingRetention) {
    return {
      loadingStatus: 'active',
      loadingDescription: localisationStrings.changingRetention
    };
  }

  if (hasRetentionChangeSucceeded) {
    return {
      loadingStatus: 'finished',
      loadingDescription: localisationStrings.retentionChangeSuccessful
    };
  }

  return {
    loadingStatus: 'inactive',
    loadingDescription: ''
  };
}
