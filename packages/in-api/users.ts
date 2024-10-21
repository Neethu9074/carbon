/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable, create } from '@instana/observables';
import { UserGroupRestrictions } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import { refreshSignalUsers } from 'in-api/usersRefreshSignal';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

export { refreshSignalUsers } from 'in-api/usersRefreshSignal';

export enum InvitationStatus {
  SUCCESS = 'SUCCESS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  FAILURE_USER_ALREADY_EXISTS = 'FAILURE_USER_ALREADY_EXISTS'
}

export interface InvitationResult {
  readonly userEmail: string;
  readonly invitationStatus: InvitationStatus;
}

export interface InvitationResponse {
  readonly invitationResults: InvitationResult[];
}

export interface Invitation {
  readonly email: string;
  readonly groupId: string;
  readonly message?: string;
  readonly path?: string;
}

export interface PendingInvitation {
  readonly email: string;
  readonly groupId: string;
  readonly groupName: string;
  readonly expireAt: number;
  readonly invitedBy: string;
}

export interface UserResult {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly lastLoggedIn: number | null | undefined;
  readonly groupCount: number | null | undefined;
  readonly tfaEnabled: boolean | null | undefined;
}

export const getUsersAsResultObservable = memoize(getUsersAsResultObservableInternal, () => 'Users', 60000);
function getUsersAsResultObservableInternal() {
  return refreshSignalUsers.flatMap(() => createObservable(getUsersInternal()));
}

export function getUsers() {
  return getUsersInternal().map(response => response.body);
}

function getUsersInternal() {
  return http<UserResult[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users`
  });
}
export function getUser(userId: string): Observable<UserResult> {
  return getUserInternal(userId).map(response => response.body);
}

function getUserInternal(userId: string): Observable<Response<UserResult>> {
  return http<UserResult>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users/${encodeURIComponent(userId)}`
  });
}

export function getPermissions(userId: string) {
  return createObservable(
    http<string[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/permissions/${encodeURIComponent(userId)}`
    })
  );
}

export function removeUserFromTenant(userId: string) {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/users/${encodeURIComponent(userId)}`
  }).map(v => {
    refreshSignalUsers.emit(true);
    return v;
  });
}

const refreshSignalInvitations = create().emit(true);

export const getInvitations$ = memoize(getInvitationsInternal, () => 'Invitations', 60000);
function getInvitationsInternal() {
  return refreshSignalInvitations.flatMap(() =>
    createObservable(
      http<InvitationResponse>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/invitations`
      })
    )
  );
}

export const getPendingInvitations = memoize(getPendingInvitationsInternal, () => 'PendingInvitations', 60000);
function getPendingInvitationsInternal(): Observable<PendingInvitation[]> {
  return refreshSignalInvitations.flatMap(() =>
    http<PendingInvitation[]>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/invitations`
    }).map(response => response.body)
  );
}

export function sendInvitations(invitations: Invitation[]) {
  return http<InvitationResponse>({
    method: 'POST',
    url: `/api/settings/${shareAndInviteEnabled ? 'invitation/share' : 'invitations'}`,
    headers: getCsrfHeader(),
    data: invitations
  }).map(v => {
    refreshSignalInvitations.emit(invitations);
    return v;
  });
}

export function sendInvitation(invitation: Invitation) {
  return http<void>({
    method: 'POST',
    url: `/api/settings/${shareAndInviteEnabled ? 'invitation/share' : 'invitations'}`,
    headers: getCsrfHeader(),
    data: invitation
  }).map(v => {
    refreshSignalInvitations.emit(invitation);
    return v;
  });
}

export function revokeInvitation(email: string) {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email
    }
  }).map(v => {
    refreshSignalInvitations.emit(email);
    return v;
  });
}

export function getUserRestrictedApplications() {
  return createObservable(
    http<UserGroupRestrictions[]>({
      method: 'GET',
      maxRetries: 3,
      url: `api/settings/rbac/user/restrictions`
    })
  );
}

export function getApplicationConfigScopeRoleId(appId: string) {
  return createObservable(
    http<String>({
      method: 'GET',
      maxRetries: 3,
      url: `api/settings/rbac/user/application/${encodeURIComponent(appId)}`
    })
  );
}
