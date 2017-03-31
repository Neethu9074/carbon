/* eslint-env mocha */

import { expect } from 'chai';

import { generateUniqueShortId } from 'in-services/util/id';

describe('in-services/util/id', () => {
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
