/* eslint-env mocha */
import {expect} from 'chai';
import {stub} from 'sinon';

import {clear, blocks$, generateBlocks} from 'in-components/SearchBar/stores/blocks';
import {resetStoreRegistry} from 'in-stores/store';


describe('in-components/SearchBar/misc/blocks', () => {
  let blockSubscription;
  let blockSubscriptionCallback;

  beforeEach(() => {
    resetStoreRegistry();
    clear();

    blockSubscriptionCallback = stub();
    blockSubscription = blocks$.subscribe(blockSubscriptionCallback);
  });

  afterEach(() => {
    blockSubscription.dispose();
  });

  it('should create no blocks', () => {
    expect(generateBlocks('')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(1);
    expect(blockSubscriptionCallback.getCall(0).args[0].size).to.equal(0);

    expect(generateBlocks('thisIsOneLongStringWithoutWhitespace')).to.deep.equal('thisIsOneLongStringWithoutWhitespace');
    expect(blockSubscriptionCallback).to.have.callCount(1);

    expect(generateBlocks('thisIsOneLongStringWithoutWhitespaceAnd()""§"§')).to.deep.equal('thisIsOneLongStringWithoutWhitespaceAnd()""§"§');
    expect(blockSubscriptionCallback).to.have.callCount(1);
  });

  it('should create blocks on whitespace', () => {
    expect(generateBlocks('this is a huge blocker')).to.deep.equal('blocker');
    expect(blockSubscriptionCallback).to.have.callCount(5);
    let blocks = blockSubscriptionCallback.getCall(4).args[0];
    expect(blocks.size).to.equal(4);
    expect(blocks.getIn([0, 'text'])).to.equal('this');
    expect(blocks.getIn([1, 'text'])).to.equal('is');
    expect(blocks.getIn([2, 'text'])).to.equal('a');
    expect(blocks.getIn([3, 'text'])).to.equal('huge');
  });

  it('should not create empty blocks', () => {
    expect(generateBlocks(' ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(1);
    expect(blockSubscriptionCallback.getCall(0).args[0].size).to.equal(0);

    expect(generateBlocks('first ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('first');
  });

  it('should not append an AND to operation blocks', () => {
    expect(generateBlocks('AND ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(0);
  });

  it('should not append an AND to operation blocks', () => {
    expect(generateBlocks('OR ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(0);
  });

  it('should not append an AND to operation blocks', () => {
    expect(generateBlocks('NOT ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(0);
  });

  it('should respect quotes over whitespaces', () => {
    expect(generateBlocks('entity.id="a text with whitespaces" ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('entity.id="a text with whitespaces"');
  });

  it('should respect quotes over whitespaces', () => {
    expect(generateBlocks('entity.id="an id "much other text""')).to.deep.equal('text""');
    expect(blockSubscriptionCallback).to.have.callCount(3);
    const blocks = blockSubscriptionCallback.getCall(2).args[0];
    expect(blocks.size).to.equal(2);
    expect(blocks.getIn([0, 'text'])).to.equal('entity.id="an id "much');
    expect(blocks.getIn([1, 'text'])).to.equal('other');
  });

  it('should respect grouping over whitespaces', () => {
    expect(generateBlocks('(a.id=1 b.id=2) ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('(a.id=1 b.id=2)');
  });

  it('should respect grouping over whitespaces', () => {
    expect(generateBlocks('entity.id=("a" ("b" "c")) ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('entity.id=("a" ("b" "c"))');
  });

  it('should respect quotes over groupings', () => {
    expect(generateBlocks('entity.id="(( dsf (()" ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(2);
    const blocks = blockSubscriptionCallback.getCall(1).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('entity.id="(( dsf (()"');
  });

  it('should remove operators and add them to the previous block if available', () => {
    expect(generateBlocks(' AND a AND b OR c OR d NOT ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(10);
    const blocks = blockSubscriptionCallback.getCall(9).args[0];
    expect(blocks.size).to.equal(4);
    expect(blocks.getIn([0, 'text'])).to.equal('a');
    expect(blocks.getIn([0, 'operator'])).to.equal('AND');
    expect(blocks.getIn([1, 'text'])).to.equal('b');
    expect(blocks.getIn([1, 'operator'])).to.equal('OR');
    expect(blocks.getIn([2, 'text'])).to.equal('c');
    expect(blocks.getIn([2, 'operator'])).to.equal('OR');
    expect(blocks.getIn([3, 'text'])).to.equal('d');
    expect(blocks.getIn([3, 'operator'])).to.equal('NOT');
  });

  it('should remove operators and add them to the previous block if available', () => {
    expect(generateBlocks(' AND OR a AND OR NOT ')).to.deep.equal('');
    expect(blockSubscriptionCallback).to.have.callCount(7);
    const blocks = blockSubscriptionCallback.getCall(6).args[0];
    expect(blocks.size).to.equal(1);
    expect(blocks.getIn([0, 'text'])).to.equal('a');
    expect(blocks.getIn([0, 'operator'])).to.equal('NOT');
  });
});
