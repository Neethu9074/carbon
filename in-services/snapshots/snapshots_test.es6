/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap */
import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import {create} from 'reactive-observables';

import {
  getIdString,
  extractCoordinates,
  isIdEqual,
  extractConnections,
  calculateIpMap} from './snapshots';

describe('util.snapshots', () => {

  describe('extractCoordinates', () => {
    it('should extract Coordinates', () => {
      const id = extractCoordinates(newSnapshot(1));
      expect(id.get('pluginId')).to.equal('p1');
      expect(id.get('steadyId')).to.equal('s1');
      expect(id.get('hostId')).to.equal('h1');
    });

    it('should expose an equal function on snapshot ids', () => {
      const id1 = extractCoordinates(newSnapshot(1));
      expect(id1.equal).to.be.a('function');

      expect(Immutable.is(id1, extractCoordinates(newSnapshot(1)))).to.equal(true);
      expect(Immutable.is(id1, extractCoordinates(newSnapshot(2)))).to.equal(false);
    });

    it('should extract coordinates from standard JS objects', () => {
      const id = extractCoordinates({
        pluginId: 'p2',
        hostId: 'h2',
        steadyId: 's2'
      });
      expect(id.get('pluginId')).to.equal('p2');
      expect(id.get('steadyId')).to.equal('s2');
      expect(id.get('hostId')).to.equal('h2');
    });
  });

  describe('isIdEqual', () => {
    it('should return false when IDs do not match', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(1))).to.equal(false);
    });

    it('should return true when ID matches', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(0))).to.equal(true);
    });

    it('should return false when one of them is null', () => {
      expect(isIdEqual(newSnapshot(0), null)).to.equal(false);
      expect(isIdEqual(null, newSnapshot(0))).to.equal(false);
    });

    it('should return false when one of them is undefined', () => {
      expect(isIdEqual(newSnapshot(0), undefined)).to.equal(false);
      expect(isIdEqual(undefined, newSnapshot(0))).to.equal(false);
    });
  });

  describe('getIdString', () => {
    it('should turn an immutable snapshot into an ID string', () => {
      expect(getIdString(newSnapshot(42)))
        .to.equal('p42#h42#s42');
    });

    it('should extract undefined', () => {
      const id = getIdString(Immutable.fromJS({
        pluginId: '1',
        steadyId: '2'
      }));
      expect(id).to.equal(undefined);
    });

    it('should turn a mutable object into an ID string', () => {
      const snapshot = {
        steadyId: 's42',
        hostId: 'h42',
        pluginId: 'p42'
      };
      expect(getIdString(snapshot)).to.equal('p42#h42#s42');
    });
  });

  function newSnapshot(n) {
    return Immutable.fromJS({
      pluginId: 'p' + n,
      steadyId: 's' + n,
      hostId: 'h' + n
    });
  }
});
