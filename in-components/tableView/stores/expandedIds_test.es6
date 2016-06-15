/* eslint-env mocha */

import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import * as expandedIds from './expandedIds';

describe('in-components/tableView/stores/expandedIds', () => {
  let onNext;

  beforeEach(() => {
    onNext = sinon.stub();
    expandedIds.collapseAll();
    expandedIds.expandedSnapshotIds$.subscribe(onNext);
  });

  it('should be empty initially', () => {
    expectExpanded();
  });

  it('should add multiple expanded IDs', () => {
    expandedIds.addExpandedSnapshotIds(['a', 'b']);
    expectExpanded('b', 'a');
  });

  it('should remove multiple expanded IDs', () => {
    expandedIds.addExpandedSnapshotIds(['a', 'b', 'c']);
    expandedIds.removeExpandedSnapshotIds(['c', 'a']);
    expectExpanded('b');
  });

  it('should collapse all', () => {
    expandedIds.addExpandedSnapshotIds(['a', 'b', 'c']);
    expandedIds.collapseAll();
    expectExpanded();
  });

  it('should toggle IDs', () => {
    expandedIds.toggleExpandedSnapshotId('a');
    expectExpanded('a');
    expandedIds.toggleExpandedSnapshotId('a');
    expectExpanded();
  });

  function expectExpanded(...ids) {
    const expected = Immutable.Set(ids);
    const actual = onNext.getCall(onNext.callCount - 1).args[0];
    expect(expected.equals(actual)).to.equal(true, 'Actual: ' + actual.toString());
  }
});
