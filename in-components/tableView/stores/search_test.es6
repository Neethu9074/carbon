/* eslint-env mocha */

import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {resetStoreRegistry} from 'in-stores/store';

describe('in-components/tableView/stores/search', () => {
  let physicalViewStructure$;
  let mod;
  let onNext;

  beforeEach(() => {
    resetStoreRegistry();

    physicalViewStructure$ = create()
      .emit(Immutable.fromJS({
        id: 'root',
        children: [
          {
            id: 'a',
            children: [
              {
                id: 'c',
                children: []
              }
            ]
          },
          {
            id: 'b',
            children: []
          }
        ]
      }));

    onNext = sinon.stub();
  });


  describe('snapshotIdsInPhysicalView$', () => {
    it('must contain the snapshot IDs of all snapshots listed in the hierarchy', () => {
      doImport();
      mod.snapshotIdsInPhysicalView$.subscribe(onNext);
      expect(onNext.getCall(0).args[0].sort()).to.deep.equal(['a', 'b', 'c']);
    });
  });


  describe('searchablePhysicalViewData$', () => {
    it('must have data immediately even when snapshot or health info data has not been emitted', () => {
      doImport(false);
      mod.searchablePhysicalViewData$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal([
        {
          id: 'a',
          label: '',
          pluginName: '',
          maxSeverity: -1
        },
        {
          id: 'b',
          label: '',
          pluginName: '',
          maxSeverity: -1
        },
        {
          id: 'c',
          label: '',
          pluginName: '',
          maxSeverity: -1
        }
      ]);
    });

    it('must determine snapshot and label data', () => {
      doImport(true);
      mod.searchablePhysicalViewData$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal([
        {
          id: 'a',
          label: 'label-a',
          pluginName: 'plugin-a',
          maxSeverity: 0
        },
        {
          id: 'b',
          label: 'label-b',
          pluginName: 'plugin-b',
          maxSeverity: 0
        },
        {
          id: 'c',
          label: 'label-c',
          pluginName: 'plugin-c',
          maxSeverity: 0
        }
      ]);
    });
  });


  describe('queryParts$', () => {
    it('must only retain query parts with at least three characters', () => {
      doImport(true);
      mod.setQuery('a bcd efgh');
      mod.queryParts$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal(['bcd', 'efgh']);
    });
  });


  describe('isFilterActive$', () => {
    it('must not be active initially', () => {
      doImport(true);
      mod.isFilterActive$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.equal(false);
    });

    it('must not be active when there is no query part with at least three characters', () => {
      doImport(true);
      mod.setQuery('a bc d');
      mod.isFilterActive$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.equal(false);
    });

    it('must be active when there is at least one sufficiently long term', () => {
      doImport(true);
      mod.setQuery('a bcd e');
      mod.isFilterActive$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.equal(true);
    });
  });


  describe('snapshotIdsInPhysicalViewMatchingFilter$', () => {
    it('must list no snapshot IDs when filtering is not active', () => {
      doImport(true);
      mod.snapshotIdsInPhysicalViewMatchingFilter$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal([]);
    });

    it('must include only snapshots matching the query for labels', () => {
      doImport(true);
      mod.setQuery('label-a');
      mod.snapshotIdsInPhysicalViewMatchingFilter$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal(['a']);
    });

    it('must include only snapshots matching the query for plugins', () => {
      doImport(true);
      mod.setQuery('plugin-b');
      mod.snapshotIdsInPhysicalViewMatchingFilter$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal(['b']);
    });

    it('must match multiple plugins', () => {
      doImport(true);
      mod.setQuery('plugin');
      mod.snapshotIdsInPhysicalViewMatchingFilter$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal(['a', 'b', 'c']);
    });
  });


  function doImport(emitData) {
    mod = proxyquire('./search', {
      'in-stores/view': {physicalViewStructure$},

      'in-services/util/memoizingObservableGenerator': {
        default: (generator) => generator
      },

      'in-stores/snapshot': {
        getSnapshot(snapshotId) {
          const result = create();

          if (emitData) {
            result.emit(Immutable.fromJS({
              id: snapshotId,
              plugin: 'plugin-' + snapshotId
            }));
          }

          return result;
        }
      },

      'in-stores/events': {
        getHealthInfoAtFocusedMoment() {
          const result = create();

          if (emitData) {
            result.emit(Immutable.fromJS({
              maxSeverity: 0
            }));
          }

          return result;
        }
      },

      'in-sdk/snapshot': {
        getLabel(snapshot) {
          return 'label-' + snapshot.get('id');
        }
      },

      'in-sdk/pluginName': {
        getSingular(plugin) {
          return plugin;
        }
      }
    });
  }


  function getLastCallValue(stub) {
    expect(stub.callCount).to.be.above(0);
    const value = stub.getCall(stub.callCount - 1).args[0];
    return value;
  }
});
