/*eslint-env mocha*/
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';

import {create} from '../conveyer';
import {extractCoordinates} from '../snapshots';


class SnapshotConveyerMock {
  static getUniqueId() {
    return Math.random();
  }

  constructor(params) {
    this.params = params;
  }

  getFullFakeSnapshotForCoordinates(coordinates) {
    return Immutable.fromJS({
      hostId: coordinates.get('hostId'),
      pluginId: coordinates.get('pluginId'),
      steadyId: coordinates.get('steadyId'),
      data: {},
      tags: ['Linux', 'Test']
    });
  }

  start(onNext) {
    onNext(this.getFullFakeSnapshotForCoordinates(this.params.coords));
  }
}

describe('in-services/filtering', () => {

  describe('createTagFilter', () => {

    let subscriber;
    let filtering;
    let filter;

    beforeEach(() => {
      subscriber = sinon.stub();
      filtering = proxyquire('./filtering.es6', {
        // reinitialise the store on every test run to clear the store cache
        '../snapshots': {
          getFullSnapshot(coords) {
            return create(SnapshotConveyerMock, {coords});
          }
        }
      });
      filter = filtering.createTagFilter('Java');
    });

    it('should create filters that adhere to the structure', () => {
      assertFilterStructure(filter);
    });

    it('should work even when the tags list does not exist on snapshots', () => {
      const snapshot = newSnapshot('a');

      filter.get('predicate')(snapshot).subscribe(subscriber);
      expect(subscriber.getCall(0).args[0]).to.equal(false);
    });

    it('should identify snapshots with the corresponding tag', () => {
      const snapshot = newSnapshotWithTags('a', ['Linux', 'Test']);

      let onNext = sinon.stub();
      filtering.createTagFilter('Linux').get('predicate')(snapshot).subscribe(onNext);
      expect(onNext.getCall(0).args[0]).to.equal(true);

      onNext = sinon.stub();
      filtering.createTagFilter('Test').get('predicate')(snapshot).subscribe(onNext);
      expect(onNext.getCall(0).args[0]).to.equal(true);

      onNext = sinon.stub();
      filtering.createTagFilter('Foobar').get('predicate')(snapshot).subscribe(onNext);
      expect(onNext.getCall(0).args[0]).to.equal(false);
    });

    function newSnapshotWithTags(n, tags) {
      return newSnapshot(n)
        .set('tags', Immutable.fromJS(tags));
    }
  });

  function newSnapshot(n) {
    return extractCoordinates({
      hostId: 'h' + n,
      pluginId: 'p' + n,
      steadyId: 's' + n
    });
  }

  function assertFilterStructure(filter) {
    expect(Immutable.Map.isMap(filter)).to.equal(true);
    expect(filter.get('type')).to.be.a('string');
    expect(filter.get('label')).to.be.a('string');
    expect(filter.get('icon')).to.be.a('string');
    expect(filter.get('predicate')).to.be.a('function');
    expect(filter.get('predicate').length).to.equal(1);
  }

});
