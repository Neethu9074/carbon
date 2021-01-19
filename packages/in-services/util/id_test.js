/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import { generateUniqueShortId, generateStableHash } from 'in-services/util/id';

describe('in-services/util/id', () => {
  describe('generateUniqueShortId', () => {
    it('must generate unique string IDs', () => {
      const generatedIds = {};
      const desiredLength = 17;

      for (let i = 0; i < 1000; i++) {
        const id = generateUniqueShortId(desiredLength);
        if (generatedIds[id]) {
          throw new Error(`Received the ID ${id} at least twice.`);
        }
        generatedIds[id] = true;

        expect(id).to.be.a('string');
        expect(id).to.have.lengthOf(desiredLength);
      }
    });
  });

  describe('generateStableHash', () => {
    it('must ignore property order in objects', () => {
      expect(generateStableHash({ b: 42, a: 42 })).to.equal('{"a":42,"b":42}');
    });

    it('must respect order in arrays', () => {
      expect(generateStableHash([3, 1, 2])).to.equal('[3,1,2]');
    });

    it('must support all JSON types', () => {
      expect(generateStableHash([3, undefined, null, 'foo', true, false, 2])).to.equal(
        '[3,null,null,"foo",true,false,2]'
      );
    });

    it('must support recursive objects', () => {
      expect(generateStableHash({ b: 42, a: [{ d: 42, c: true }] })).to.equal('{"a":[{"c":true,"d":42}],"b":42}');
    });

    it('must drop undefined object values like regular JSON.stringify', () => {
      expect(generateStableHash({ a: 42, b: undefined })).to.equal('{"a":42}');
    });
  });
});
