/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  findNextIndexToOpen,
  findPrevIndexToOpen
} from 'in-applications/analyze/components/TraceDetails/components/NavigatorSplitScreen/NavigatorSplitScreen';

describe('in-applications/analyze/components/TraceDetails/components/NavigatorSplitScreen/NavigatorSplitScreen', () => {
  it('must find next index', () => {
    const array = [{ isDisabledForOpen: true }, {}, { isDisabledForOpen: true }, {}];
    const find = (c, e) => expect(findNextIndexToOpen(c, array)).to.equal(e);
    find(0, 1);
    find(1, 3);
    find(2, 3);
    find(3, 3);
  });

  it('must find previous index', () => {
    const array = [{ isDisabledForOpen: true }, {}, { isDisabledForOpen: true }, {}];
    const find = (c, e) => expect(findPrevIndexToOpen(c, array)).to.equal(e);
    find(0, 0);
    find(1, 1);
    find(2, 1);
    find(3, 1);
  });
});
