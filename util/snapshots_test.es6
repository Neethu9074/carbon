/*eslint-env mocha*/
/*eslint-disable no-unused-vars, new-cap */

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import sinon from 'sinon';
import {create} from 'reactive-observables';
import {
  getIdString,
  extractId,
  isIdEqual,
  extractConnections,
  calculateIpMap,
  only} from './snapshots';

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

    it('should extract undefined', () => {
      const id = getIdString(Immutable.fromJS({
        pluginId: '1',
        steadyId: '2'
      }));
      expect(id).to.equal(undefined);
    });
  });

  describe('extractConnections', () => {
    it('should extract connections', () => {
      const snapshots = getConnectedSnapshots();
      const connections = extractConnections(snapshots);
      expect(connections.size).to.equal(4);

      connections.forEach((con, host) => {
        const hostName = host.get('name');
        if(hostName === 'a') {
          expect(con.outgoing.size).to.equal(3);
          expect(con.incoming.size).to.equal(0);
        } else if(hostName === 'b') {
          expect(con.outgoing.size).to.equal(3);
          expect(con.incoming.size).to.equal(2);
        } else if(hostName === 'c') {
          expect(con.outgoing.size).to.equal(0);
          expect(con.incoming.size).to.equal(1);
        } else if(hostName === 'd') {
          expect(con.outgoing.size).to.equal(0);
          expect(con.incoming.size).to.equal(0);
        }
      });
    });
  });

  describe('only', () => {
    let observable;
    let subscriber;

    beforeEach(() => {
      subscriber = sinon.stub();
      observable = create();
      only(observable, newSnapshot(2)).subscribe(subscriber);
    });

    it('should restrict to the desired snapshots', () => {
      expect(subscriber.callCount).to.equal(0);

      observable.emit(Immutable.List([newSnapshot(1)]));
      expect(subscriber.callCount).to.equal(0);

      observable.emit(Immutable.List([newSnapshot(1), newSnapshot(2)]));
      expect(subscriber.callCount).to.equal(1);
      expect(subscriber.getCall(0).args[0].get('hostId')).to.equal('h2');
    });

    it('should not emit when the snapshots is missing', () => {
      observable.emit(Immutable.List([newSnapshot(1)]));
      observable.emit(Immutable.List([newSnapshot(2)]));
      observable.emit(Immutable.List());
      expect(subscriber.callCount).to.equal(1);
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
        name: 'a',
        data: {
          interfaces: {
            eth0: {
              ips: ['1.1.1.1']
            }
          },
          connections: {
            outgoing: [
              '1.1.1.2',
              '1.1.1.3',
              '1.1.1.6' //unknown
            ]
          }
        }
      }, b: {
        name: 'b',
        data: {
          interfaces: {
            eth0: {
              ips: ['1.1.1.2']
            }
          },
          connections: {
            incoming: [
              '1.1.1.1',
              '1.1.1.3'
            ],
            outgoing: [
              '1.1.1.1',
              '1.1.1.3',
              '1.1.1.5' //unknown
            ]
          }
        }
      }, c: {
        name: 'c',
        data: {
          interfaces: {
            eth0: {
              ips: ['1.1.1.3']
            }
          },
          connections: {
            incoming: [
              '1.1.1.4'
            ]
          }
        }
      }, d: {
        name: 'd',
        data: {
          interfaces: {
            eth0: {
              ips: ['1.1.1.4']
            }
          }
        }
      }
    });
  }
});
