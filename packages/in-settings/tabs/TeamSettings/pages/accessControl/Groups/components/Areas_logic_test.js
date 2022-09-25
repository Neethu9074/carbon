/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { expect } from 'chai';

import { needsToShowRestricAccessedWarning } from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Areas';
import { RESTRICTED_ACCESS } from 'in-stores/permission';

describe('in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/Areas', () => {
  it('must not show restrict access warning if permissionSet is empty set', () => {
    const permissionSet = {
      permissions: [],
      infraDfqFilter: {
        scopeId: ''
      }
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if applicationIds are set', () => {
    const permissionSet = {
      permissions: [],
      applicationIds: ['applicationId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if applicationIds & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      applicationIds: ['applicationId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if kubernetesClusterUUIDs are set', () => {
    const permissionSet = {
      permissions: [],
      kubernetesClusterUUIDs: ['UUID']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if kubernetesClusterUUIDs & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      kubernetesClusterUUIDs: ['UUID']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if kubernetesNamespaceUIDs are set', () => {
    const permissionSet = {
      permissions: [],
      kubernetesNamespaceUIDs: ['UID']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if kubernetesNamespaceUIDs & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      kubernetesNamespaceUIDs: ['UID']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if websiteIds are set', () => {
    const permissionSet = {
      permissions: [],
      websiteIds: ['websiteId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if websiteIds & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      websiteIds: ['websiteId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if mobileAppIds are set', () => {
    const permissionSet = {
      permissions: [],
      mobileAppIds: ['mobileAppId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if mobileAppIds & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      mobileAppIds: ['mobileAppId']
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });

  it('must show restrict access warning if infraDfqFilter is set', () => {
    const permissionSet = {
      permissions: [],
      infraDfqFilter: {
        scopeId: 'entity.host:*',
        scopeRoleId: '-600'
      }
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(true);
  });

  it('must not show restrict access warning if infraDfqFilter & RESTRICTED_ACCESS permission is set', () => {
    const permissionSet = {
      permissions: [RESTRICTED_ACCESS],
      infraDfqFilter: {
        scopeId: 'entity.host:*',
        scopeRoleId: '-600'
      }
    };
    expect(needsToShowRestricAccessedWarning(permissionSet)).to.equals(false);
  });
});
