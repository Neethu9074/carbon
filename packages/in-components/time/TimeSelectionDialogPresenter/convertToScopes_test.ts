/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

// @ts-expect-error import convertToScopes from 'in-components/time/TimeSelectionDialogPresenter/convertToScopes';
import convertToScopes from 'in-components/time/TimeSelectionDialogPresenter/convertToScopes';

describe('in-components/time/convertToScopes', () => {
  it('must convert service scope correctly', () => {
    const scopes = convertToScopes({ services: [{ id: 's1', name: 'service1' }] });
    expect(scopes.length).to.equal(1);
    expect(scopes[0].serviceId).to.equal('s1');
    expect(scopes[0].serviceName).to.equal('service1');
  });
  it('must convert application scope correctly', () => {
    const scopes = convertToScopes({ applications: [{ id: 'app1', name: 'application1' }] });
    expect(scopes.length).to.equal(1);
    expect(scopes[0].applicationId).to.equal('app1');
    expect(scopes[0].applicationName).to.equal('application1');
  });
  it('must convert service and application scope correctly', () => {
    const scopes = convertToScopes({
      services: [{ id: 's1', name: 'service1' }],
      applications: [{ id: 'app1', name: 'application1' }]
    });
    expect(scopes.length).to.equal(2);
  });
  it('must convert service within application scope correctly', () => {
    const scopes = convertToScopes({
      services: [{ id: 's1', name: 'service1', scopedTo: { applications: [{ id: 'app1', name: 'application1' }] } }]
    });
    expect(scopes.length).to.equal(1);
    expect(scopes[0].serviceId).to.equal('s1');
    expect(scopes[0].serviceName).to.equal('service1');
    expect(scopes[0].applicationId).to.equal('app1');
    expect(scopes[0].applicationName).to.equal('application1');
  });
});
