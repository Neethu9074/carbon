/*eslint-env mocha*/

import Immutable from 'immutable';
import {expect} from 'chai';

import {extractCoordinates} from '../snapshots';
import * as filtering from './filtering';

describe('in-services/filtering', () => {

  describe('createTagFilter', () => {

    let filter;

    beforeEach(() => {
      filter = filtering.createTagFilter('Java');
    });

    it('should create filters that adhere to the structure', () => {
      assertFilterStructure(filter);
    });

    it('should work even when the tags list does not exist on snapshots', () => {
      const snapshot = newSnapshot('a');
      expect(filter.get('predicate')(snapshot)).to.equal(false);
    });

    it('should identify snapshots with the corresponding tag', () => {
      const snapshot = newSnapshotWithTags('a', ['Linux', 'Test']);
      expect(filtering.createTagFilter('Linux').get('predicate')(snapshot)).to.equal(true);
      expect(filtering.createTagFilter('Test').get('predicate')(snapshot)).to.equal(true);
      expect(filtering.createTagFilter('Foobar').get('predicate')(snapshot)).to.equal(false);
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
