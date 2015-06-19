/*eslint-env mocha, node*/

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
// import proxyquire from 'proxyquire';
// import sinon from 'sinon';

import {extractConnections} from './index';


describe('snapshot', () => {

  // let onNext;

  beforeEach(() => {
    // onNext = sinon.stub();
  });

  describe('extractConnections', () => {

    it('should extract connections', () => {
      const snapshots = getConnectedSnapshots();
      snapshots.forEach(snapshot => {
        const connections = extractConnections(snapshot, snapshots);

        if(snapshot.get('name') === 'a') {
          expect(connections.get('outgoing').size).to.equal(3);
          expect(connections.get('incoming').size).to.equal(0);
        } else if(snapshot.get('name') === 'b') {
          expect(connections.get('outgoing').size).to.equal(3);
          expect(connections.get('incoming').size).to.equal(2);
        } else if(snapshot.get('name') === 'c') {
          expect(connections.get('outgoing').size).to.equal(0);
          expect(connections.get('incoming').size).to.equal(1);
        } else if(snapshot.get('name') === 'd') {
          expect(connections.get('outgoing').size).to.equal(0);
          expect(connections.get('incoming').size).to.equal(0);
        }
      });
    });

  });

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
