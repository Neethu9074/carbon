/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm, ValidationResult } from 'formalistic';

import { UserSentState } from './InviteUserDialog';
import { t } from 'in-i18n';

export const hasInvitesValidator = (invites: MapForm<any>[]): ValidationResult => {
  const rows: Field<UserSentState>[] = invites.map(mF => mF.get('userSentState') as Field<UserSentState>);
  const someNotSent = rows.some(r => r.value === 'notSentYet' || r.value === 'sentFailureServerError');
  if (!someNotSent || invites.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
      }
    ];
  }
  return null;
};
