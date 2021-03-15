/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';
import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

export const refreshSignalUsers = create().emit(true);
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
        url: `/api/tenant/users/invitations`
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

export function getInvitations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users/invitations`
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

// it is possible to either pass a string for email and groupId or pass an array for each of them
export function sendInvitation(emails, groupIds) {
  return http({
    method: 'POST',
    url: `/api/settings/users/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email: emails,
      roleId: groupIds
    }
  }).map(v => {
    refreshSignalInvitations.emit(emails);
    return v;
  });
}

export function revokeInvitation(email) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/users/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email
    }
  }).map(v => {
    refreshSignalInvitations.emit(email);
    return v;
  });
}
