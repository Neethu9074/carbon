/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { expect } from 'chai';

import {
  RESTRICTED_ACCESS,
  ACCESS_APPLICATIONS,
  ACCESS_KUBERNETES,
  ACCESS_WEBSITES,
  ACCESS_MOBILE_APPS
} from 'in-stores/permission';
import {
  mapToScopeBindings,
  needsToShowRestricAccessedWarning
} from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group';

describe('in-settings/tabs/TeamSettings/pages/accessControl/Groups/Group', () => {
  it('must not loose data on adding scope binding', () => {
    expect(extractIds(mapToScopeBindings(['a', 'b', 'c'], [{ scopeId: 'a' }]))).to.include.members(['a', 'b', 'c']);

    expect(
      extractIds(mapToScopeBindings(['a', 'b'], [{ scopeId: 'a' }, { scopeId: 'b' }, { scopeId: 'c' }]))
    ).to.include.members(['a', 'b']);

    expect(extractIds(mapToScopeBindings(['a', 'b'], [{ scopeId: 'a' }, { scopeId: 'b' }]))).to.include.members([
      'a',
      'b'
    ]);
  });

  function extractIds(a) {
    return a.map(({ scopeId }) => scopeId);
  }

  it('must not show restrict access warning if permissionSet is empty set', () => {
    const permissionSet = {
      permissions: []
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if ACCESS_APPLICATIONS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_APPLICATIONS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if ACCESS_APPLICATIONS & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_APPLICATIONS, RESTRICTED_ACCESS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if ACCESS_KUBERNETES permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_KUBERNETES]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if ACCESS_KUBERNETES & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_KUBERNETES, RESTRICTED_ACCESS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if ACCESS_WEBSITES permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_WEBSITES]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if ACCESS_WEBSITES & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_WEBSITES, RESTRICTED_ACCESS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if ACCESS_MOBILE_APPS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_MOBILE_APPS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if ACCESS_MOBILE_APPS & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [ACCESS_MOBILE_APPS, RESTRICTED_ACCESS]
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });
});
