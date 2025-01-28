/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

// @ts-expect-error import { sortByPrimaryAction } from 'in-components/Chart/components/ContextMenu/ContextMenu';
import { sortByPrimaryAction } from 'in-components/Chart/components/ContextMenu/ContextMenu';

describe('in-components/Chart/components/ContextMenu/ContextMenu', () => {
  describe('#sortByPrimaryAction', () => {
    it('should only change the order of the primary item', () => {
      expect(sortByPrimaryAction({ name: 'a' }, { name: 'b' }, 'c')).to.equal(0);
      expect(sortByPrimaryAction({ name: 'a' }, { name: 'b' }, 'a')).to.equal(-1);
      expect(sortByPrimaryAction({ name: 'a' }, { name: 'b' }, 'b')).to.equal(1);
    });
  });
});
