/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import formatInputTime from 'in-components/time/TimeSelectionDialogPresenter/timeInputFormatter';

describe('in-components/time/timeInputFormatter', () => {
  it('must format time string correctly', () => {
    expect(formatInputTime('9', 'HH:mm:ss')).to.equal('09:00:00');
    expect(formatInputTime('09:', 'HH:mm:ss')).to.equal('09:00:00');
    expect(formatInputTime('19', 'HH:mm:ss')).to.equal('19:00:00');
    expect(formatInputTime('9:1', 'HH:mm:ss')).to.equal('09:01:00');
    expect(formatInputTime('9:01', 'HH:mm:ss')).to.equal('09:01:00');
    expect(formatInputTime('9:10:1', 'HH:mm:ss')).to.equal('09:10:01');
    expect(formatInputTime('9:10:11', 'HH:mm:ss')).to.equal('09:10:11');
    expect(formatInputTime('yolo', 'HH:mm:ss')).to.equal('yolo');
  });
});
