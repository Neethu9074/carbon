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


  describe('snapshotIdsInPhysicalView$', () => {
    it('should contain the snapshot IDs of all snapshots listed in the hierarchy', () => {
      doImport();
      mod.snapshotIdsInPhysicalView$.subscribe(onNext);
      expect(onNext.getCall(0).args[0].sort()).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('searchablePhysicalViewData$', () => {
    it('should have data immediately even when snapshot or health info data has not been emitted', () => {
      doImport(false);
      mod.searchablePhysicalViewData$.subscribe(onNext);
      expect(getLastCallValue()).to.deep.equal([
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

    it('should determine snapshot and label data', () => {
      doImport(true);
      mod.searchablePhysicalViewData$.subscribe(onNext);
      expect(getLastCallValue()).to.deep.equal([
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

    function getLastCallValue() {
      expect(onNext.callCount).to.be.above(0);
      const value = onNext.getCall(onNext.callCount - 1).args[0].slice();
      return value;
    }
  });
});
