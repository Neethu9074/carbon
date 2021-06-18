/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { alwaysNull, alwaysEmptyArray } from 'in-services/fixedStreams';

describe('fixedStreams', () => {
  testPrimitive('alwaysNull', null);
  testCollection('alwaysEmptyArray', []);
});

function testPrimitive(name, expectedValue) {
  testFrozen(name);
  testInitialValue(name, expectedValue);
}

function testCollection(name, expectedValue) {
  testFrozen(name);
  testInitialValue(name, expectedValue);
  testCollectionIsFrozen(name);
}

function testFrozen(name) {
  it(`${name} observable should be frozen`, () => {
    const ro = getImplementation(name);
    expect(ro.emit).to.equal(undefined);
  });
}

function testInitialValue(name, expectedValue) {
  it(`${name} should be configured to emit ${expectedValue}`, () => {
    const ro = getImplementation(name);
    const stub = sinon.stub();
    ro.subscribe(stub);
    expect(stub).to.have.callCount(1);
    expect(stub.getCall(0).args[0]).to.deep.equal(expectedValue);
  });
}

function testCollectionIsFrozen(name) {
  it(`${name}'s value should be frozen`, () => {
    const ro = getImplementation(name);
    const stub = sinon.stub();
    ro.subscribe(stub);
    expect(stub).to.have.callCount(1);

    const value = stub.getCall(0).args[0];
    expect(() => (value.foobar = 10)).to.throw(/object is not extensible/);
  });
}

function getImplementation(name) {
  switch (name) {
    case 'alwaysEmptyArray':
      return alwaysEmptyArray;
    case 'alwaysNull':
      return alwaysNull;
    default:
      return null;
  }
}
