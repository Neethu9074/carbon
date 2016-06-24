/* eslint-env mocha */
/* global global:false */

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
    global.requestAnimationFrame = fn => fn();

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
    it('must have data immediately even when health info data has not been emitted', () => {
      doImport(false);
      mod.searchablePhysicalViewData$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.deep.equal([
        {
          id: 'a',
          maxSeverity: -1
        },
        {
          id: 'b',
          maxSeverity: -1
        },
        {
          id: 'c',
          maxSeverity: -1
        }
      ]);
    });
  });


  describe('isFilterActive$', () => {
    it('must not be active initially', () => {
      doImport(true);
      mod.isFilterActive$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.equal(false);
    });

    it('must be active when there is a severity >0 selected', () => {
      doImport(true);
      mod.setSeverity(5);
      mod.isFilterActive$.subscribe(onNext);
      expect(getLastCallValue(onNext)).to.equal(true);
    });
  });


  describe('snapshotIdsInPhysicalViewMatchingFilter$', () => {
    it('must list all snapshot IDs when filtering is not active', () => {
      doImport(true);
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
      }
    });
  }


  function getLastCallValue(stub) {
    expect(stub.callCount).to.be.above(0);
    const value = stub.getCall(stub.callCount - 1).args[0];
    return value;
  }
});
