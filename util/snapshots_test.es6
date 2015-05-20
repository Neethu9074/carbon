/*eslint-env mocha*/
/*eslint-disable no-unused-vars */

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import {
  getIdString,
  extractId,
  isIdEqual,
  extractConnections} from './snapshots';

describe('util.snapshots', () => {

  describe('extractId', () => {
    it('should extract IDs', () => {
      const id = extractId(newSnapshot(1));
      expect(id.get('pluginId')).to.equal('p1');
      expect(id.get('steadyId')).to.equal('s1');
      expect(id.get('hostId')).to.equal('h1');
    });
  });

  describe('isIdEqual', () => {
    it('should return false when IDs do not match', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(1))).to.equal(false);
    });

    it('should return true when ID matches', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(0))).to.equal(true);
    });
  });

  describe('getIdString', () => {
    it('should turn an immutable snapshot into an ID string', () => {
      expect(getIdString(newSnapshot(42)))
        .to.equal('h42#p42#s42');
    });
  });

  describe('extractConnections', () => {
    it('should extract connections', () => {
      const snapshots = getConnectedSnapshots();
      const connections = extractConnections(snapshots);
      expect(connections.size).to.equal(3);
    });
  });

  function newSnapshot(n) {
    return Immutable.fromJS({
      pluginId: 'p' + n,
      steadyId: 's' + n,
      hostId: 'h' + n
    });
  }

  function getConnectedSnapshots() {

    return Immutable.fromJS({
      a: {
        data: {
          interfaces: {
            eth0: {
              ips: ['192.168.0.1']
            }
          },
          connections: [
            '192.168.0.2',
            '192.168.0.3'
          ]
        }
      }, b: {
        data: {
          interfaces: {
            eth0: {
              ips: ['192.168.0.2']
            }
          },
          connections: [
            '192.168.0.1',
            '192.168.0.3'
          ]
        }
      }, c: {
        data: {
          interfaces: {
            eth0: {
              ips: ['192.168.0.3']
            }
          },
          connections: [
            '192.168.0.1',
            '192.168.0.2'
          ]
        }
      }
    });
  }
});
