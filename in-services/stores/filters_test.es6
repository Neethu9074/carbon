/*eslint-env mocha*/

import Immutable from 'immutable';
import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import {extractCoordinates, getFullSnapshot} from '../snapshots';

describe('in-services/stores/filters', () => {

  let coordinates;
  let subscriber;
  let mod;

  beforeEach(() => {
    subscriber = sinon.stub();
    mod = proxyquire('./filters.es6', {
      // reinitialise the store on every test run to clear the store cache
      './store': proxyquire('./store', {})
    });
    coordinates = extractCoordinates({
      hostId: 'h1',
      pluginId: 'com.instana.forge.infrastructure.database.cassandra.Cassandra',
      steadyId: 'sCassandra'
    });
  });

  it('should be empty initially', () => {
    mod.activeFilters.subscribe(subscriber);

    expect(subscriber).to.have.callCount(1);
    expect(subscriber.getCall(0).args[0].toJS()).to.deep.equal([]);
  });

  it('should add filters', () => {
    mod.activeFilters.subscribe(subscriber);

    mod.addFilter(newTagFilter('Java'));
    expect(subscriber).to.have.callCount(2);
    expect(subscriber.getCall(1).args[0].toJS()).to.deep.equal([{
      type: 'tag',
      label: 'Java'
    }]);
  });

  it('should not add the same filter twice', () => {
    mod.addFilter(newTagFilter('Java'));
    mod.addFilter(newTagFilter('Java'));

    mod.activeFilters.subscribe(subscriber);
    expect(subscriber).to.have.callCount(1);
    expect(subscriber.getCall(0).args[0].toJS()).to.deep.equal([{
      type: 'tag',
      label: 'Java'
    }]);

    mod.addFilter(newTagFilter('JavaScript'));
    expect(subscriber).to.have.callCount(2);
    expect(subscriber.getCall(1).args[0].toJS()).to.deep.equal([{
      type: 'tag',
      label: 'Java'
    },
    {
      type: 'tag',
      label: 'JavaScript'
    }]);
  });

  it('should remove filters', () => {
    mod.addFilter(newTagFilter('Ham&Cheese'));
    mod.addFilter(newTagFilter('Chicken Teriyaki'));
    mod.addFilter(newTagFilter('Steak&Cheese'));
    mod.addFilter(newTagFilter('Salami'));

    mod.activeFilters.subscribe(subscriber);
    expect(subscriber).to.have.callCount(1);
    expect(subscriber.getCall(0).args[0].size).to.equal(4);

    mod.removeFilter(newTagFilter('Salami'));
    expect(subscriber).to.have.callCount(2);
    expect(subscriber.getCall(1).args[0].toJS()).to.deep.equal([{
      type: 'tag',
      label: 'Ham&Cheese'
    },
    {
      type: 'tag',
      label: 'Chicken Teriyaki'
    },
    {
      type: 'tag',
      label: 'Steak&Cheese'
    }]);
  });

  it('should clear filters', () => {
    mod.addFilter(newTagFilter('Ham&Cheese'));
    mod.addFilter(newTagFilter('Chicken Teriyaki'));
    mod.activeFilters.subscribe(subscriber);

    mod.clearFilters();

    expect(subscriber).to.have.callCount(2);
    expect(subscriber.getCall(1).args[0].size).to.equal(0);
  });

  function newTagFilter(label) {
    return Immutable.Map({
      type: 'tag',
      label
    });
  }

  function newTagFilterWithPredicate(label) {
    return Immutable.Map({
      type: 'tag',
      label,
      predicate: (coords) => {
        return getFullSnapshot(coords).map(snapshot => {
          const tags = snapshot.get('tags');
          if (tags) {
            return tags.some(t => t.indexOf(label) !== -1);
          }
          return false;
        });
      }
    });
  }

  describe('isMatchingAllActiveFilters', () => {

    it('should throw error on undefined coords', () => {
      expect(() => mod.isMatchingAllActiveFilters(undefined)).to.throw(Error);
    });

    it('should return true if no filters are set', () => {
      mod.isMatchingAllActiveFilters(coordinates).subscribe(subscriber);
      expect(subscriber).to.have.callCount(2);
      expect(subscriber.getCall(0).args[0]).to.equal(true);
    });

    it('should return false if a filter filters the coords', () => {
      mod.addFilter(newTagFilterWithPredicate('CantBeFoundTag'));
      mod.addFilter(newTagFilterWithPredicate('CantBeFoundTagReloaded'));

      mod.isMatchingAllActiveFilters(coordinates).subscribe(subscriber);
      expect(subscriber).to.have.callCount(2);
      expect(subscriber.getCall(0).args[0]).to.equal(false);
    });

  });
});
