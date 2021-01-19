/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { mount } from 'enzyme';
import { expect } from 'chai';
import React from 'react';

import createSideEffectHook from 'in-hooks/createSideEffectHook';

describe('in-hooks/createSideEffectHook', () => {
  let useSummingHook;
  let sum;

  beforeEach(() => {
    useSummingHook = createSideEffectHook(
      args => args.reduce((a, b) => a + b, 0),
      _sum => {
        sum = _sum;
      }
    );
  });

  it('must work with a single instance', () => {
    mount(<Component num={42} />);
    expect(sum).to.equal(42);
  });

  it('must work with multiple instances', () => {
    mount(
      <>
        <Component num={10} />
        <Component num={20} />
      </>
    );
    expect(sum).to.equal(30);
  });

  it('must remove a single instance', () => {
    const wrapper = mount(<Component num={42} />);
    wrapper.unmount();
    expect(sum).to.equal(0);
  });

  it('must supports removal', () => {
    mount(<Component num={10} />);
    const wrapper = mount(<Component num={20} />);
    expect(sum).to.equal(30);
    wrapper.unmount();
    expect(sum).to.equal(10);
  });

  function Component({ num }) {
    useSummingHook(num);
    return null;
  }
});
