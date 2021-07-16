/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */

import { expect } from 'chai';

import toPx from 'in-services/formatters/toPx';

describe('formatters.toPx', () => {
  it('should remove decimal places to avoid sub pixel rendering artifacts', () => {
    expect(toPx(42.876328990321231)).to.equal('42px');
  });

  it('should convert negative values to 0', () => {
    expect(toPx(-5)).to.equal('0px');
  });
});
