/* eslint-env mocha */
import {expect} from 'chai';

import {getBlocks} from 'in-components/SearchBar/stores/blocks';


describe('in-components/SearchBar/misc/blocks', () => {
  let blocks;

  it('should create no blocks', () => {
    blocks = getBlocks('');
    expect(blocks).to.deep.equal([]);

    blocks = getBlocks('thisIsOneLongStringWithoutWhitespace');
    expect(blocks).to.deep.equal([]);

    blocks = getBlocks('thisIsOneLongStringWithoutWhitespaceAnd()""§"§');
    expect(blocks).to.deep.equal([]);
  });

  it('should create blocks on whitespace', () => {
    blocks = getBlocks('this is a huge blocker');
    expect(blocks.length).to.equal(4);
    expect(blocks[0].text).to.equal('this');
    expect(blocks[1].text).to.equal('is');
    expect(blocks[2].text).to.equal('a');
    expect(blocks[3].text).to.equal('huge');
  });

  it('should not create empty blocks', () => {
    blocks = getBlocks(' ');
    expect(blocks.length).to.equal(0);

    blocks = getBlocks('first ');
    expect(blocks.length).to.equal(1);
    expect(blocks[0].text).to.equal('first');
  });

  it('should respect quotes over whitespaces', () => {
    blocks = getBlocks('entity.id="a text with whitespaces" ');
    expect(blocks.length).to.equal(1);
    expect(blocks[0].text).to.equal('entity.id="a text with whitespaces"');
  });

  it('should respect quotes over whitespaces', () => {
    blocks = getBlocks('entity.id="an id "much other text""');
    expect(blocks.length).to.equal(2);
    expect(blocks[0].text).to.equal('entity.id="an id "much');
    expect(blocks[1].text).to.equal('other');
  });

  it('should respect grouping over whitespaces', () => {
    blocks = getBlocks('(a.id=1 b.id=2) ');
    expect(blocks.length).to.equal(1);
    expect(blocks[0].text).to.equal('(a.id=1 b.id=2)');
  });

  it('should respect grouping over whitespaces', () => {
    blocks = getBlocks('entity.id=("a" ("b" "c")) ');
    expect(blocks.length).to.equal(1);
    expect(blocks[0].text).to.equal('entity.id=("a" ("b" "c"))');
  });

  it('should respect quotes over groupings', () => {
    blocks = getBlocks('entity.id="(( dsf (()" ');
    expect(blocks.length).to.equal(1);
    expect(blocks[0].text).to.equal('entity.id="(( dsf (()"');
  });
});
