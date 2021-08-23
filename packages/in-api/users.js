/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { refreshSignalUsers } from 'in-api/usersRefreshSignal';
import http from 'in-services/http';

export { refreshSignalUsers } from 'in-api/usersRefreshSignal';

const refreshSignalInvitations = create().emit(true);

// observables

export const getUsersAsResultObservable = memoize(getUsersAsResultObservableInternal, () => '', 60000);
function getUsersAsResultObservableInternal() {
  return refreshSignalUsers.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/users`
      })
    )
  );
}

export const getInvitations$ = memoize(getInvitationsInternal, () => '', 60000);
function getInvitationsInternal() {
  return refreshSignalInvitations.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/invitations`
      })
    )
  );
}

// regular calls

export function getUsersAndInvitations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users/overview`
  }).map(response => fromJS(response.body));
}

export function getUsers() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users`
  }).map(response => response.body);
}

export function getPermissions(userId) {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/permissions/${encodeURIComponent(userId)}`
    })
  );
}

export function removeUserFromTenant(userId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/tenant/users/${encodeURIComponent(userId)}`
  }).map(v => {
    refreshSignalUsers.emit(userId);
    return v;
  });
}

export function sendInvitation(invitations) {
  return http({
    method: 'POST',
    url: `/api/settings/invitations`,
    headers: getCsrfHeader(),
    data: invitations
  }).map(v => {
    refreshSignalInvitations.emit(invitations);
    return v;
  });
}

export function revokeInvitation(email) {
  return http({
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
