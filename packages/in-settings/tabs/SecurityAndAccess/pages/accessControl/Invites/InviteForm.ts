/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  Field,
  ListForm,
  MapForm,
  ValidationResult,
  createField,
  createListForm,
  createMapForm,
  notBlankValidator
} from 'formalistic';

import { UserResult } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  InviteSentState,
  PendingInvite,
  UserInvite,
  UserSentState
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/InviteUserDialog';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { defaultRoleId } from 'in-stores/user';

export const createInviteForm = (previousResult?: UserInvite[], touched?: boolean) => {
  return createListForm({
    validator: invites => {
      const invitesMapForms: MapForm<any>[] = invites as MapForm<any>[];
      const rows: Field<UserSentState>[] = invitesMapForms.map(mF => mF.get('userSentState') as Field<UserSentState>);
      const someNotSent = rows.some(
        r => r.value === InviteSentState.notSentYet || r.value === InviteSentState.INTERNAL_ERROR
      );

      if (!someNotSent) {
        return [
          {
            severity: 'error',
            message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
          }
        ];
      }

      if (invites.length === 0) {
        return [
          {
            severity: 'error',
            message: t('in-settings:tabs.pleaseInviteAtLeastOneUser')
          }
        ];
      }

      return null;
    },
    items: previousResult?.length
      ? previousResult.map(function (item) {
          return mapToFormItem(item, touched);
        })
      : [emptyInvite()]
  });
};
export function emptyInvite() {
  return mapToFormItem({ groupId: defaultRoleId, email: '', userSentState: InviteSentState.notSentYet });
}

export function mapToFormItem(previousResult: UserInvite, touched?: boolean) {
  return createMapForm()
    .put(
      'groupId',
      createField({
        value: previousResult.groupId,
        validator: notBlankValidator
      })
    )
    .put(
      'email',
      createField({
        value: previousResult.email,
        validator: composeAndShortCircuitOnError(notBlankValidator, emailFormatValidator)
      })
    )
    .put(
      'userSentState',
      createField({
        value: previousResult.userSentState,
        validator: userSentStateValidator,
        touched: touched
      })
    );
}

export function userSentStateValidator(userSentState?: string): ValidationResult {
  if (userSentState == InviteSentState.FAILURE_USER_ALREADY_INVITED) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.thisInviteAlreadyExists')
      }
    ];
  } else if (userSentState == InviteSentState.FAILURE_USER_ALREADY_EXISTS) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.thisUserAlreadyExists')
      }
    ];
  }
  return null;
}

export function emailFormatValidator(email: string): ValidationResult {
  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

  if (email && !email.match(emailRegex)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.emailFormatNotValid')
      }
    ];
  }
  return null;
}
export function anyValidEntry(form: ListForm<any>) {
  const asJsObject = form.toJS();
  return asJsObject.some(
    (e: any) =>
      (e.userSentState === InviteSentState.notSentYet || e.userSentState === InviteSentState.INTERNAL_ERROR) &&
      e.email.trim() !== ''
  );
}

export function checkInviteAlreadyExists(userInvite: UserInvite, pendingInvitations?: PendingInvite[]): boolean {
  let invitationAlreadyExists = false;
  if (pendingInvitations && pendingInvitations.length > 0) {
    invitationAlreadyExists = pendingInvitations.some(
      (pendingInvitation: PendingInvite) =>
        pendingInvitation.email === userInvite.email && pendingInvitation.groupId === userInvite.groupId
    );
  }
  return invitationAlreadyExists;
}

export function checkUserAlreadyExists(email: string, users: UserResult[]): boolean {
  let isFound = false;
  if (users && users.length > 0) {
    isFound = users.some(user => user.email === email);
  }
  return isFound;
}
