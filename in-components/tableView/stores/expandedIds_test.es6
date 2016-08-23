/* eslint-env mocha */

import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {
  addExpandedSnapshotIds,
  collapseAll,
  expandedSnapshotIds$,
  removeExpandedSnapshotIds,
  toggleExpandedSnapshotId
} from './expandedIds';

describe('in-components/tableView/stores/expandedIds', () => {
  let onNext;

  beforeEach(() => {
    onNext = sinon.stub();
    collapseAll();
    expandedSnapshotIds$.subscribe(onNext);
  });

  it('should be empty initially', () => {
    expectExpanded();
  });

  it('should add multiple expanded IDs', () => {
    addExpandedSnapshotIds(['a', 'b']);
    expectExpanded('b', 'a');
  });

  it('should remove multiple expanded IDs', () => {
    addExpandedSnapshotIds(['a', 'b', 'c']);
    removeExpandedSnapshotIds(['c', 'a']);
    expectExpanded('b');
  });

  it('should collapse all', () => {
    addExpandedSnapshotIds(['a', 'b', 'c']);
    collapseAll();
    expectExpanded();
  });

  it('should toggle IDs', () => {
    toggleExpandedSnapshotId('a');
    expectExpanded('a');
    toggleExpandedSnapshotId('a');
    expectExpanded();
  });

  function expectExpanded(...ids) {
    const expected = Immutable.Set(ids);
    const actual = onNext.getCall(onNext.callCount - 1).args[0];
    expect(expected.equals(actual)).to.equal(true, 'Actual: ' + actual.toString());
  }
});
