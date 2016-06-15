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

    mod = proxyquire('./search', {
      'in-stores/view': {physicalViewStructure$},

      'in-services/util/memoizingObservableGenerator': {
        default: (generator) => generator
      },

      'in-stores/snapshot': {
        getSnapshot(snapshotId) {
          return create()
            .emit(Immutable.fromJS({
              id: snapshotId
            }));
        }
      },

      'in-stores/events': {
        getHealthInfoAtFocusedMoment() {
          return create()
            .emit(Immutable.fromJS({
              maxSeverity: 0
            }));
        }
      }
    });
    onNext = sinon.stub();
  });

  describe('snapshotIdsInPhysicalView$', () => {
    it('should contain the snapshot IDs of all snapshots listed in the hierarchy', () => {
      mod.snapshotIdsInPhysicalView$.subscribe(onNext);
      expect(onNext.getCall(0).args[0].sort()).to.deep.equal(['a', 'b', 'c']);
    });
  });

  describe('searchablePhysicalViewData$', () => {
    it('should have data immediately even when snapshot or health info data has not been emitted', () => {

    });
  });
});
