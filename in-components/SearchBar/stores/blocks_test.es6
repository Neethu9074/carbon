/* eslint-env mocha */
import {expect} from 'chai';

import {getBlocks} from 'in-components/SearchBar/stores/blocks';


describe('in-components/SearchBar/misc/blocks', () => {
  let blocks;

  afterEach(() => {
    blocks = null;
  });

  it('should create no blocks', () => {
    blocks = getBlocks('');
    expect(blocks.length).to.equal(0);

    blocks = getBlocks('thisIsOneLongStringWithoutWhitespace');
    expect(blocks.length).to.equal(0);

    blocks = getBlocks('thisIsOneLongStringWithoutWhitespaceAnd()""§"§');
    expect(blocks.length).to.equal(0);

    blocks = getBlocks('this is a huge blocker');
    expect(blocks.length).to.equal(0);
  });

  it('should create blocks on fields, fieldseperator and rest', () => {
    blocks = getBlocks(' ');
    expect(blocks.length).to.equal(0);
  });
});
