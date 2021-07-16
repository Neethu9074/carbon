/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import {
  findNextMatcherIndex,
  toChunks,
  fillWithParams,
  PARAMETER,
  MESSAGE_CHUNK
} from 'in-services/util/stringToChunks';

describe('in-services/util/stringToChunks', () => {
  describe('findNextMatcherIndex', () => {
    it('should match empty matcher', () => {
      const [_indexOfNextMatcher, match] = findNextMatcherIndex('', ['']);
      expect(_indexOfNextMatcher).to.deep.equal(0);
      expect(match).to.deep.equal('');
    });

    it('should return not found for no template inside string', () => {
      const [_indexOfNextMatcher, match] = findNextMatcherIndex('', ['x']);
      expect(_indexOfNextMatcher).to.deep.equal(-1);
      expect(match).to.deep.equal('');
    });

    it('should return not found for no template inside string', () => {
      const [_indexOfNextMatcher, match] = findNextMatcherIndex('', ['template 1']);
      expect(_indexOfNextMatcher).to.deep.equal(-1);
      expect(match).to.deep.equal('');
    });

    it('should return not found for no template inside string', () => {
      const [_indexOfNextMatcher, match] = findNextMatcherIndex('template 2', ['template 1']);
      expect(_indexOfNextMatcher).to.deep.equal(-1);
      expect(match).to.deep.equal('');
    });

    it('should find the first match hit inside the template string', () => {
      let res = findNextMatcherIndex('a b c d e f g', ['c', 'd']);
      expect(res[0]).to.deep.equal(4);
      expect(res[1]).to.deep.equal('c');

      res = findNextMatcherIndex('a b c d e f g', ['d', 'c']);
      expect(res[0]).to.deep.equal(4);
      expect(res[1]).to.deep.equal('c');

      res = findNextMatcherIndex('a b c d e f g', ['c1', 'd']);
      expect(res[0]).to.deep.equal(6);
      expect(res[1]).to.deep.equal('d');
    });
  });

  describe('toChunks', () => {
    it('should ignore empty strings', () => {
      const chunks = toChunks('', []);
      expect(chunks).to.deep.equal([]);
    });

    it('should return message without matcher', () => {
      const chunks = toChunks('foobar', []);
      expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar' }]);
    });

    it('should ignore unused matcher', () => {
      const chunks = toChunks('foobar', ['p1']);
      expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar' }]);
    });

    it('should not fail on no matcher', () => {
      const chunks = toChunks('foobar {}', []);
      expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar {}' }]);
    });

    it('should find all matcher', () => {
      const chunks = toChunks('foobar {}{}', ['{}']);
      expect(chunks).to.deep.equal([
        { type: MESSAGE_CHUNK, value: 'foobar ' },
        { type: PARAMETER, value: '{}' },
        { type: PARAMETER, value: '{}' }
      ]);
    });

    it('should find all matcher', () => {
      let chunks = toChunks('{} foo { } {} bar', ['{}']);
      expect(chunks).to.deep.equal([
        { type: PARAMETER, value: '{}' },
        { type: MESSAGE_CHUNK, value: ' foo { } ' },
        { type: PARAMETER, value: '{}' },
        { type: MESSAGE_CHUNK, value: ' bar' }
      ]);
    });

    it('should return different matcher', () => {
      const chunks = toChunks('foobar ${application.name}', ['${application.name}', '${service.name}']);
      expect(chunks).to.deep.equal([
        { type: MESSAGE_CHUNK, value: 'foobar ' },
        { type: PARAMETER, value: '${application.name}' }
      ]);
    });

    it('should return different matcher', () => {
      const chunks = toChunks('foobar ${application.name} ${service.name} ', [
        '${application.name}',
        '${service.name}'
      ]);
      expect(chunks).to.deep.equal([
        { type: MESSAGE_CHUNK, value: 'foobar ' },
        { type: PARAMETER, value: '${application.name}' },
        { type: MESSAGE_CHUNK, value: ' ' },
        { type: PARAMETER, value: '${service.name}' },
        { type: MESSAGE_CHUNK, value: ' ' }
      ]);
    });

    it('should return different matcher', () => {
      const chunks = toChunks('foobar ${application.name} ${service.name}', ['${application.name}']);
      expect(chunks).to.deep.equal([
        { type: MESSAGE_CHUNK, value: 'foobar ' },
        { type: PARAMETER, value: '${application.name}' },
        { type: MESSAGE_CHUNK, value: ' ${service.name}' }
      ]);
    });

    it('should return different matcher', () => {
      const chunks = toChunks('foobar ${applicationx.name}', ['${application.name}']);
      expect(chunks).to.deep.equal([{ type: MESSAGE_CHUNK, value: 'foobar ${applicationx.name}' }]);
    });
  });

  describe('fillWithParams', () => {
    it('should fill up with params', () => {
      expect(fillWithParams(toChunks('foobar ${} ${}', ['${}']), ['param1'])).to.deep.equal([
        { type: MESSAGE_CHUNK, value: 'foobar ' },
        { type: PARAMETER, value: 'param1' },
        { type: MESSAGE_CHUNK, value: ' ' },
        { type: PARAMETER, value: '${}' }
      ]);
    });
  });
});
