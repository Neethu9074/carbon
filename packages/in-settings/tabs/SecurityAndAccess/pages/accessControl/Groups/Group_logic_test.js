/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { expect } from 'chai';

import { mapToScopeBindings } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group';

describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group', () => {
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
});
