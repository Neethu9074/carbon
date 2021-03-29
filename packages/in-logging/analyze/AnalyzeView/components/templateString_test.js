/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { toChunks, PARAMETER, MESSAGE_CHUNK } from 'in-logging/analyze/AnalyzeView/components/templateString';

describe('in-logging/analyze/AnalyzeView/components/templateString', () => {
  it('should ignore empty strings', () => {
    const chunks = toChunks('', []);
    expect(chunks).to.deep.equal([]);
  });

  it('should return message without params', () => {
    const chunks = toChunks('foobar', []);
    expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar' }]);
  });

  it('should ignore unused params', () => {
    const chunks = toChunks('foobar', ['p1']);
    expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar' }]);
  });

  it('should not fail on no params', () => {
    const chunks = toChunks('foobar {}', []);
    expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar {}' }]);
  });

  it('should not fail on not enough params', () => {
    const chunks = toChunks('foobar {}{}', ['p1']);
    expect(chunks).to.deep.equal([
      { type: MESSAGE_CHUNK, value: 'foobar ' },
      { type: PARAMETER, value: 'p1' },
      { type: MESSAGE_CHUNK, value: '{}' }
    ]);
  });

  it('should fill in all params', () => {
    let chunks = toChunks('{} foo {} {} bar', ['p1', 'p2', 'p3']);
    expect(chunks).to.deep.equal([
      { type: PARAMETER, value: 'p1' },
      { type: MESSAGE_CHUNK, value: ' foo ' },
      { type: PARAMETER, value: 'p2' },
      { type: MESSAGE_CHUNK, value: ' ' },
      { type: PARAMETER, value: 'p3' },
      { type: MESSAGE_CHUNK, value: ' bar' }
    ]);

    chunks = toChunks('foo {} {}', ['p1', 'p2']);
    expect(chunks).to.deep.equal([
      { type: MESSAGE_CHUNK, value: 'foo ' },
      { type: PARAMETER, value: 'p1' },
      { type: MESSAGE_CHUNK, value: ' ' },
      { type: PARAMETER, value: 'p2' }
    ]);

    chunks = toChunks('{} foo ', ['p1']);
    expect(chunks).to.deep.equal([
      { type: PARAMETER, value: 'p1' },
      { type: MESSAGE_CHUNK, value: ' foo ' }
    ]);
  });
});
